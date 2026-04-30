import { Server } from 'socket.io';
import {
  negotiationChat,
  createSession,
  destroySession,
} from '../services/AiService/aiNegotiation.service.js';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: 'http://localhost:5173', credentials: true },
    allowEIO3: true,
  });

  io.on('connection', (socket) => {

    socket.on('negotiation_start', ({ initialTotal }) => {
      createSession(socket.id, initialTotal);
      socket.emit('negotiation_ready', { initialTotal });
    });

    socket.on('chat_message', async ({ inputText }) => {
      try {
        await negotiationChat(
          socket.id,
          inputText,
          (token) => socket.emit('token', token),
          (result) => socket.emit('stream_end', result)
        );
      } catch (err) {
        socket.emit('stream_error', 'Something went wrong');
      }
    });

    socket.on('disconnect', () => {
      destroySession(socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}