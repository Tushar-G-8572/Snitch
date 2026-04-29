import { Server } from 'socket.io';
import { createSession, getSession, deleteSession } from '../services/AiService/negotiation.session.js';
import { negotiateWithAI } from '../services/AiService/aiNegotiation.service.js';

let io;

export async function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"]
    },
  })

  io.on("connection", (socket) => {
    console.log("New Socket connected", socket.id);
    socket.on('negotiation_start', ({ cartItems }) => {
      if (cartItems.total < 5000) {
        return socket.emit('negotiate_error', { message: 'Cart total must be above ₹5000.' });
      }
      const session = createSession(socket.id, cartItems);
      socket.emit('negotiate_started', {
        roundsLeft: session.roundsLeft,
        message: 'Negotiation started! Make your offer.',
      });
    })
    socket.on('negotiate_message', async ({ userMessage }) => {
      const session = getSession(socket.id);

      if (!session || session.status !== 'active') {
        return socket.emit('negotiate_error', { message: 'No active session.' });
      }
      if (session.roundsLeft <= 0) {
        session.status = 'expired';
        return socket.emit('negotiate_expired', { message: 'No rounds left!' });
      }

      // Decrement BEFORE calling AI
      session.roundsLeft -= 1;

      try {
        const { offer } = await negotiateWithAI(session, userMessage, socket);
        socket.emit('negotiate_state', {
          roundsLeft: session.roundsLeft,
          currentOffer: offer,
        });
      } catch (err) {
        socket.emit('negotiate_error', { message: 'AI error, try again.' });
      }
    });
    socket.on('negotiate_accept', () => {
      const session = getSession(socket.id);
      if (!session?.currentOffer) {
        return socket.emit('negotiate_error', { message: 'No offer to accept.' });
      }
      session.status = 'accepted';
      socket.emit('negotiate_closed', {
        status: 'accepted',
        finalOffer: session.currentOffer,
      });
      deleteSession(socket.id);
    });
    socket.on('negotiate_reject', () => {
      const session = getSession(socket.id);
      if (session) {
        session.status = 'rejected';
        deleteSession(socket.id);
      }
      socket.emit('negotiate_closed', { status: 'rejected' });
    });
    socket.on("disconnect", () => {
      console.log("Socket Disconnected")
      deleteSession(socket.id);
    })
  })

  return io;

}

export function getIO() {
  if (!io) throw new Error("Socket.IO not initialised yet");
  return io;
}