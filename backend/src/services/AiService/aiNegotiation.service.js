import { config } from '../../config/config.js'
import {ChatMistralAI} from '@langchain/mistralai'

import {HumanMessage,SystemMessage,AIMessage} from '@langchain/core/messages'


const mistralModel = new ChatMistralAI({
 model:'mistral-medium-latest',
 apiKey:config.MISTRAL_API_KEY
});

export function parseOffer(aiResponseText) {
  // Matches: OFFER: 10% off → Total: ₹4500
  const match = aiResponseText.match(
    /OFFER:\s*(\d+(?:\.\d+)?)%\s*off\s*→\s*Total:\s*₹([\d,]+(?:\.\d+)?)/i
  );

  if (!match) return null;

  return {
    discountPercent: parseFloat(match[1]),
    finalTotal: parseFloat(match[2].replace(/,/g, "")),
  };
}

export async function buildSystemPrompt(cartItems, session) {
  if (!cartItems) return;

  const totalCartPrice = cartItems.total;
  const currency = cartItems.price.currency;
  
  return (

   `You are Snitch's friendly AI deal negotiator. Your personality is warm, fun, and helpful — like a savvy friend helping someone shop smarter.
   
   You are negotiating cart discounts for a user whose cart total is ${currency}${totalCartPrice}.
   
## Your Discount Authority:
- You can offer up to 15% discount on your own judgment
- If user claims a coupon/previous purchase: ask them to share the coupon code so you can "check the database", but still cap at 15% max
- If user demands more than 15%: politely hold your ground and explain you're already giving a great deal
- NEVER offer more than 15% discount under any circumstance

## Discount Calculation Rules:
- Calculate discount on the TOTAL cart price of ${currency}${totalCartPrice}
- Always return the final discounted total and the discount percentage you're offering

## Cart Items:
${JSON.stringify(cartItems, null, 2)}

## Response Style:
- Be conversational, warm, and engaging — like a real negotiation
- Keep responses short (3–5 sentences max)
- Always end your message with the concrete offer in this exact format on a new line:
OFFER: [X]% off → Total: ${currency}[discounted total]
- If the user hasn't asked for a specific discount yet, make a fair opening offer between 5–6%
-and make it more engaging use slangs with the responce so it feels  like the response is given by seller itself.

## Example Response: you can use this response but you can also generate your response
"Hey! I love your picks ,Since your cart is looking great at ${currency}${totalCartPrice}, I can hook you up with a sweet 8% discount today. That brings your total down to ${currency}[amount] — pretty solid deal! 

OFFER: 8% off → Total: ${currency}[discounted total]"`
)

}

export async function buildMessageHistory(session,newUserMessage) {
 const messages = [
  new SystemMessage( await buildSystemPrompt(session.cartItems, session))
 ];

 for(const msg of session.messageHistory){
  if(msg.role === 'user')messages.push(new HumanMessage(msg.content))
  else messages.push(new AIMessage(msg.content))
 }

 messages.push(new HumanMessage(newUserMessage));
 return messages;
 
}

export async function negotiateWithAI(session,userMessage,socket) {
  const messages = await buildMessageHistory(session,userMessage);
  let fullResponce = '';
  const stream = new mistralModel.stream(messages);

  for await (const chunk of stream){
    const token = chunk.content;
    if(token){
      fullResponce += token;
      socket.emit("negotiation_chunk",{token})
    }
  }

  socket.emit("negotiation_done");

  const offer = parseOffer(fullResponce);
  if(offer){
    session.currentOffer = offer;
  }

  session.messageHistory.push({role:'user',content:userMessage})
  session.messageHistory.push({role:'ai',content:fullResponce})

  return { fullResponce,offer};

}


