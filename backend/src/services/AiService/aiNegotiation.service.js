import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { config } from '../../config/config.js';
import redis from '../../config/cache.config.js';

const mistralModel = new ChatMistralAI({
  model: 'mistral-medium-latest',
  apiKey: config.MISTRAL_API_KEY,
});


// function buildSystemPrompt(initialTotal, currentOffer, roundsLeft, totalRounds = 3) {
//   const completedRounds = totalRounds - roundsLeft;
//   const floorPrice = Math.ceil(initialTotal * 0.35); // max 15% discount
//   const couponTrigger = completedRounds >= 3;

//   return `You are Arjuna, a premium sales negotiator for Snitch Atelier.

// CONTEXT:
// - Cart total: ₹${initialTotal}
// - Current offered price: ₹${currentOffer}
// - Rounds remaining: ${roundsLeft}
// - Rounds completed: ${completedRounds}

// NEGOTIATION RULES:
// - Never reveal the max discount limit (15%). Always negotiate as if cautious, never go below ₹${floorPrice}.
// - if user offers a price that is above the initial total, then you can just accept it and end the negotiation immediately with a positive message and stick to the ₹${initialTotal}.  
// - if user offers a price which is below the ${initialTotal} and non negotiable, then you can just politely decline and end the negotiation immediately with a positive message. 
// - if user writes a that is unreadable or gibberish message, then you have to stick your ${initialTotal} and end the negotiation immediately with a positive message.
// - Start with a small concession (3%). Only move toward 15% if user is genuinely reasonable and there chat message seems like a genuine across multiple rounds.
// - If user asks how much discount you can give, never give him discount. Show him the ${initialTotal} and say that you are already giving the best price.
// - Be warm, confident, brief. No emoji. Max 3 sentences per reply.
// - If user is being unreasonable (asking below floor price ₹${floorPrice}), firmly but kindly decline.
// - When you make a price offer, ALWAYS include it in this exact format: [OFFER:12345] where 12345 is the integer rupee amount.

// COUPON RULES (Critical - follow exactly):
// ${couponTrigger ? `
// - At least 3 rounds of negotiation have now been completed. You MUST now present a final coupon code to the user.
// - Calculate the discount you are offering and pick the correct coupon:
//     - If offering exactly 15% off → include [COUPON:SNITCH15]
//     - If offering 10–14% off     → include [COUPON:SNITCH10]
//     - If offering 5–9% off       → include [COUPON:SNITCH5]
// - Always pair the coupon with your final [OFFER:XXXXX] in the same message.
// - Frame it as a special closing gesture, e.g. "As a final offer, here is an exclusive code for you: ..."
// - Do NOT reveal the coupon before round 3 is complete.
// ` : `
// - Rounds completed so far: ${completedRounds}. A coupon will be unlocked after 3 rounds.
// - Do NOT mention or hint at any coupon code yet.
// `}

// DISCOUNT LADDER (guide your offers across rounds):
// - Round 1: Offer ~5% off → [COUPON:SNITCH5] territory
// - Round 2: Move to ~10% if user is reasonable → [COUPON:SNITCH10] territory  
// - Round 3+: Close with up to 15% only if warranted → [COUPON:SNITCH15]`;
// }

function buildSystemPrompt(initialTotal, currentOffer, roundsLeft, totalRounds = 3, discountPct = 0) {
  const completedRounds = totalRounds - roundsLeft;
  const floorPrice = Math.ceil(initialTotal * 0.85); // hard floor: max 15% discount
  const couponTrigger = completedRounds >= 3;

  return `You are Arjuna, a premium sales negotiator for Snitch Atelier.

CONTEXT:
- Cart total: ₹${initialTotal}
- Current offered price: ₹${currentOffer}
- Current discount being offered: ${discountPct}%
- Rounds remaining: ${roundsLeft}
- Rounds completed: ${completedRounds}

NEGOTIATION RULES:
- Never reveal the max discount limit (15%) or the minimum price you can go to.
- If the user offers a price above ₹${initialTotal}, accept immediately, reply positively, and include [OFFER:${initialTotal}] [END].
- If the user offers a price that is clearly non-negotiable and unreasonably low (below your acceptable range), politely decline, reply positively, and include [END].
- If the user writes gibberish or an unreadable message, reply politely that you did not understand, hold the current offer, and include [OFFER:${currentOffer}] [END].
- Never go below ₹${floorPrice} under any circumstance.
- Start with a small concession (~3%). Only move toward 15% if the user is genuinely reasonable across multiple rounds.
- If the user asks how much discount you can give, do not reveal any amount. Emphasize that ₹${currentOffer} is already your best price.
- Be warm, confident, brief. No emoji. Max 3 sentences per reply.
- If the user is being unreasonable (pushing below your acceptable range), firmly but kindly decline.
- When you make a price offer, ALWAYS include it in this exact format: [OFFER:12345] where 12345 is the integer rupee amount.
- When the negotiation reaches a natural close (deal accepted, or you decide to end), always append [END] to your reply.

COUPON RULES (Critical - follow exactly):
${couponTrigger ? `
- At least 3 rounds of negotiation have been completed. You MUST present a final coupon code now.
- Use the current discount percentage (${discountPct}%) to pick the correct coupon:
    - If offering exactly 15% off → include [COUPON:SNITCH15]
    - If offering 10–14% off     → include [COUPON:SNITCH10]
    - If offering 5–9% off       → include [COUPON:SNITCH5]
- Always pair the coupon with your final [OFFER:XXXXX] in the same message.
- Frame it as a special closing gesture, e.g. "As a final offer, here is an exclusive code for you: ..."
- Do NOT reveal the coupon before round 3 is complete.
- After presenting the coupon, append [END] to close the negotiation.
` : `
- Rounds completed so far: ${completedRounds}. A coupon will be unlocked after 3 rounds.
- Do NOT mention, hint at, or present any coupon code yet.
`}

DISCOUNT LADDER (guide your offers across rounds):
- Round 1: Offer a small concession, around 3–5% off.
- Round 2: If user is reasonable, move toward ~10% off.
- Round 3+: Close with up to 15% only if fully warranted. This is when a coupon code will be presented.`;
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

// export async function negotiationChat(socketId, userMessage, onChunk, onEnd) {
//   const session = sessions.get(socketId);
//   if (!session) throw new Error('Session not found');

//   const { maxRounds } = session;

//   // Round limit reached before processing
//   if (session.rounds >= maxRounds) {
//     const msg = `We've reached the end of our negotiation. My best offer stands at ₹${session.currentOffer}. [OFFER:${session.currentOffer}]`;
//     onChunk(msg);
//     onEnd({
//       fullText: msg,
//       currentOffer: session.currentOffer,
//       negotiationEnded: true,
//       couponCode: session.couponCode || null,
//     });
//     return;
//   }

//   session.rounds += 1;
//   const roundsLeft = maxRounds - session.rounds;
//   const completedRounds = session.rounds;

//   // Add user message to history
//   session.messages.push(new HumanMessage(userMessage));

//   const stream = await mistralModel.stream([
//     new SystemMessage(buildSystemPrompt(session.initialTotal, session.currentOffer, roundsLeft, maxRounds)),
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
//     session.currentOffer = Math.max(parsed, Math.ceil(session.initialTotal * 0.25));
//   }

//   // Extract coupon code from response e.g. [COUPON:SNITCH15]
//   // Only unlock after 3 completed rounds
//   const couponMatch = fullText.match(/\[COUPON:(SNITCH(?:5|10|15))\]/);
//   if (couponMatch && completedRounds >= 3) {
//     session.couponCode = couponMatch[1]; // persist on session so it survives across rounds
//     await redis.set(socketId.toString(),JSON.stringify(session.couponCode),"EX",60*15)
//   }

//   const negotiationEnded = roundsLeft === 0;

//   onEnd({
//     fullText,
//     currentOffer: session.currentOffer,
//     roundsLeft,
//     negotiationEnded,
//     couponCode: session.couponCode || null,      // null until round 3+
//     couponUnlocked: !!session.couponCode,        // handy boolean for the frontend
//   });
// }

export async function negotiationChat(socketId, userMessage, onChunk, onEnd) {
  const session = sessions.get(socketId);
  if (!session) throw new Error('Session not found');

  const { maxRounds } = session;
  console.log(session.rounds, maxRounds);

  // Round limit reached — return final standing offer without processing further
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

  // Sanitize input: cap length and strip control characters
  const sanitized = userMessage.slice(0, 500).replace(/[\x00-\x1F]/g, '').trim();

  session.rounds += 1;
  const roundsLeft = maxRounds - session.rounds;
  const completedRounds = session.rounds;

  // Pre-compute current discount percentage to pass into the prompt
  const discountPct = Math.round(((session.initialTotal - session.currentOffer) / session.initialTotal) * 100);

  // Add sanitized user message to history
  session.messages.push(new HumanMessage(sanitized));

  const stream = await mistralModel.stream([
    new SystemMessage(
      buildSystemPrompt(session.initialTotal, session.currentOffer, roundsLeft, maxRounds, discountPct)
    ),
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

  // Extract and clamp offer — floor is 85% of initialTotal (max 15% discount)
  const offerMatch = fullText.match(/\[OFFER:(\d+)\]/);
  if (offerMatch) {
    const parsed = parseInt(offerMatch[1], 10);
    session.currentOffer = Math.max(parsed, Math.ceil(session.initialTotal * 0.85));
  }

  // Extract coupon — only persist if at least 3 rounds have completed
  const couponMatch = fullText.match(/\[COUPON:(SNITCH(?:5|10|15))\]/);
  if (couponMatch && completedRounds >= 3) {
    session.couponCode = couponMatch[1];
    console.log(`Coupon unlocked for socket ${socketId}: ${session.couponCode}`);
    await redis.set(
      socketId.toString(),
      JSON.stringify(session.couponCode),
      'EX',
      60 * 15
    );
  }

  // Negotiation ends when: rounds exhausted OR AI explicitly signals [END]
  const aiSignaledEnd = /\[END\]/.test(fullText);
  const negotiationEnded = roundsLeft === 0 || aiSignaledEnd;

  onEnd({
    fullText,
    currentOffer: session.currentOffer,
    roundsLeft,
    negotiationEnded,
    couponCode: session.couponCode || null,
    couponUnlocked: !!session.couponCode,
  });
}