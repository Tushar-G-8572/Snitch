const sessions = new Map();

export async function createSession(cartItems,socketId) {
  const session = {
   socketId,
   cartItems,
   roundsLeft:5,
   status:'active', // 'active' | 'accepted' | 'rejected' | 'expired'
   currentOffer:null, // { discountPercent, finalTotal }
   messageHistory: [], // [{ role: 'user'|'ai', content: string }]
   createdAt: Date.now()
  };
  sessions.set(socketId,session);
  return session
}

export async function getSession(socketId) {
 return sessions.get(socketId);
}

export async function deleteSession(socketId) {
  sessions.delete(socketId)
}