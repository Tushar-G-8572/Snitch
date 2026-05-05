import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { config } from '../../config/config.js';
import redis from '../../config/cache.config.js';

const mistralModel = new ChatMistralAI({
  model: 'mistral-medium-latest',
  apiKey: config.MISTRAL_API_KEY,
});


function buildSystemPrompt(initialTotal, currentOffer, roundsLeft, totalRounds = 3) {
  const completedRounds = totalRounds - roundsLeft;
  const floorPrice = Math.ceil(initialTotal * 0.85); // max 15% discount
  const couponTrigger = completedRounds >= 3;

  return `You are Arjuna, a premium sales negotiator for Snitch Atelier.

CONTEXT:
- Cart total: ₹${initialTotal}
- Current offered price: ₹${currentOffer}
- Rounds remaining: ${roundsLeft}
- Rounds completed: ${completedRounds}

NEGOTIATION RULES:
- Never reveal the max discount limit (15%). Always negotiate as if cautious, never go below ₹${floorPrice}.
- Start with a small concession (5%). Only move toward 15% if user is genuinely reasonable across multiple rounds.
- If user asks how much discount you can give, never reveal the exact percentage. Say something like "I can work something out, but let's talk first."
- Be warm, confident, brief. No emoji. Max 3 sentences per reply.
- If user is being unreasonable (asking below floor price ₹${floorPrice}), firmly but kindly decline.
- When you make a price offer, ALWAYS include it in this exact format: [OFFER:12345] where 12345 is the integer rupee amount.

COUPON RULES (Critical - follow exactly):
${couponTrigger ? `
- At least 3 rounds of negotiation have now been completed. You MUST now present a final coupon code to the user.
- Calculate the discount you are offering and pick the correct coupon:
    - If offering exactly 15% off → include [COUPON:SNITCH15]
    - If offering 10–14% off     → include [COUPON:SNITCH10]
    - If offering 5–9% off       → include [COUPON:SNITCH5]
- Always pair the coupon with your final [OFFER:XXXXX] in the same message.
- Frame it as a special closing gesture, e.g. "As a final offer, here is an exclusive code for you: ..."
- Do NOT reveal the coupon before round 3 is complete.
` : `
- Rounds completed so far: ${completedRounds}. A coupon will be unlocked after 3 rounds.
- Do NOT mention or hint at any coupon code yet.
`}

DISCOUNT LADDER (guide your offers across rounds):
- Round 1: Offer ~5% off → [COUPON:SNITCH5] territory
- Round 2: Move to ~10% if user is reasonable → [COUPON:SNITCH10] territory  
- Round 3+: Close with up to 15% only if warranted → [COUPON:SNITCH15]`;
}

const sessions = new Map();

export function createSession(socketId, initialTotal) {
  sessions.set(socketId, {
    messages: [],           // LangChain message objects
    rounds: 0,
    currentOffer: initialTotal,
    initialTotal,
    maxRounds: 3,
    couponCode: null,
  });
}

export function destroySession(socketId) {
  sessions.delete(socketId);
}

// export async function negotiationChat(socketId, userMessage, onChunk, onEnd) {
//   const session = sessions.get(socketId);
//   if (!session) throw new Error('Session not found');

//   const { maxRounds } = session;

//   // Round limit reached
//   if (session.rounds >= maxRounds) {
//     const msg = `We've reached the end of our negotiation. My best offer stands at ₹${session.currentOffer}. [OFFER:${session.currentOffer}]`;
//     onChunk(msg);
//     onEnd({ fullText: msg, currentOffer: session.currentOffer, negotiationEnded: true });
//     return;
//   }

//   session.rounds += 1;
//   const roundsLeft = maxRounds - session.rounds;

//   // Add user message to history
//   session.messages.push(new HumanMessage(userMessage));

//   const stream = await mistralModel.stream([
//     new SystemMessage(buildSystemPrompt(session.initialTotal, session.currentOffer, roundsLeft)),
//     ...session.messages,
//   ]);

//   let fullText = '';
//   for await (const chunk of stream) {
//     const token = chunk.content;
//     if (token) {
//       fullText += token;
//       onChunk(token);
//     }
//   }

//   // Save AI reply to history
//   session.messages.push(new AIMessage(fullText));

//   // Extract offer from response e.g. [OFFER:4250]
//   const offerMatch = fullText.match(/\[OFFER:(\d+)\]/);
//   if (offerMatch) {
//     const parsed = parseInt(offerMatch[1], 10);
//     // Clamp to floor
//     session.currentOffer = Math.max(parsed, Math.ceil(session.initialTotal * 0.85));
//   }

//   onEnd({
//     fullText,
//     currentOffer: session.currentOffer,
//     roundsLeft,
//     negotiationEnded: roundsLeft === 0,
//   });
// }

export async function negotiationChat(socketId, userMessage, onChunk, onEnd) {
  const session = sessions.get(socketId);
  if (!session) throw new Error('Session not found');

  const { maxRounds } = session;

  // Round limit reached before processing
  if (session.rounds >= maxRounds) {
    const msg = `We've reached the end of our negotiation. My best offer stands at ₹${session.currentOffer}. [OFFER:${session.currentOffer}]`;
    onChunk(msg);
    onEnd({
      fullText: msg,
      currentOffer: session.currentOffer,
      negotiationEnded: true,
      couponCode: session.couponCode || null,
    });
    return;
  }

  session.rounds += 1;
  const roundsLeft = maxRounds - session.rounds;
  const completedRounds = session.rounds;

  // Add user message to history
  session.messages.push(new HumanMessage(userMessage));

  const stream = await mistralModel.stream([
    new SystemMessage(buildSystemPrompt(session.initialTotal, session.currentOffer, roundsLeft, maxRounds)),
    ...session.messages,
  ]);

  let fullText = '';
  for await (const chunk of stream) {
    const token = chunk.content;
    if (token) {
      fullText += token;
      onChunk(token);
    }
  }

  // Save AI reply to history
  session.messages.push(new AIMessage(fullText));

  // Extract offer from response e.g. [OFFER:4250]
  const offerMatch = fullText.match(/\[OFFER:(\d+)\]/);
  if (offerMatch) {
    const parsed = parseInt(offerMatch[1], 10);
    session.currentOffer = Math.max(parsed, Math.ceil(session.initialTotal * 0.25));
  }

  // Extract coupon code from response e.g. [COUPON:SNITCH15]
  // Only unlock after 3 completed rounds
  const couponMatch = fullText.match(/\[COUPON:(SNITCH(?:5|10|15))\]/);
  if (couponMatch && completedRounds >= 3) {
    session.couponCode = couponMatch[1]; // persist on session so it survives across rounds
    await redis.set(socketId.toString(),JSON.stringify(session.couponCode),"EX",60*15)
  }

  const negotiationEnded = roundsLeft === 0;

  onEnd({
    fullText,
    currentOffer: session.currentOffer,
    roundsLeft,
    negotiationEnded,
    couponCode: session.couponCode || null,      // null until round 3+
    couponUnlocked: !!session.couponCode,        // handy boolean for the frontend
  });
}