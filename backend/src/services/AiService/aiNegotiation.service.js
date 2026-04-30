import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { config } from '../../config/config.js';

const mistralModel = new ChatMistralAI({
  model: 'mistral-medium-latest',
  apiKey: config.MISTRAL_API_KEY,
});

function buildSystemPrompt(initialTotal, currentOffer, roundsLeft) {
  return `You are Arjuna, a premium sales negotiator for Snitch Atelier.

CONTEXT:
- Cart total: ₹${initialTotal}
- Current offered price: ₹${currentOffer}
- Rounds remaining: ${roundsLeft}

RULES:
- Never reveal the max discount limit (15% off). Always negotiate as if you have room to offer more, but never go below (floor: ₹${Math.ceil(initialTotal * 0.35)}).
- You might offer max 15% discount from the original price but this happens only ocasionally and only if the user is being very reasonable. Always try to keep some room for negotiation. 
-If user asks how much discount you can give, never reveal the exact percentage. Instead, say something like "I can offer you a special discount, but let's discuss your needs first."
- You have ${roundsLeft} rounds left. If rounds hit 0, give a polite final answer and offer the best price you can.
- When you make a price offer, ALWAYS include it in this exact format: [OFFER:12345] where 12345 is the integer amount in INR.
- Be warm, confident, brief. No emoji. Max 3 sentences per reply.
- If user is being unreasonable (asking below floor), firmly but kindly decline.`;
}

// Per-socket session store
// Map<socketId, { messages, rounds, currentOffer, initialTotal }>
const sessions = new Map();

export function createSession(socketId, initialTotal) {
  sessions.set(socketId, {
    messages: [],           // LangChain message objects
    rounds: 0,
    currentOffer: initialTotal,
    initialTotal,
    maxRounds: 3,
  });
}

export function destroySession(socketId) {
  sessions.delete(socketId);
}

export async function negotiationChat(socketId, userMessage, onChunk, onEnd) {
  const session = sessions.get(socketId);
  if (!session) throw new Error('Session not found');

  const { maxRounds } = session;

  // Round limit reached
  if (session.rounds >= maxRounds) {
    const msg = `We've reached the end of our negotiation. My best offer stands at ₹${session.currentOffer}. [OFFER:${session.currentOffer}]`;
    onChunk(msg);
    onEnd({ fullText: msg, currentOffer: session.currentOffer, negotiationEnded: true });
    return;
  }

  session.rounds += 1;
  const roundsLeft = maxRounds - session.rounds;

  // Add user message to history
  session.messages.push(new HumanMessage(userMessage));

  const stream = await mistralModel.stream([
    new SystemMessage(buildSystemPrompt(session.initialTotal, session.currentOffer, roundsLeft)),
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
    // Clamp to floor
    session.currentOffer = Math.max(parsed, Math.ceil(session.initialTotal * 0.85));
  }

  onEnd({
    fullText,
    currentOffer: session.currentOffer,
    roundsLeft,
    negotiationEnded: roundsLeft === 0,
  });
}