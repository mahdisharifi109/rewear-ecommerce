import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import pool from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';

interface AuthSocket extends Socket {
  user?: {
    id: string;
    email: string;
  };
}

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow all origins for now, restrict in production
      methods: ['GET', 'POST'],
    },
  });

  // Middleware for authentication
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log(`User connected: ${socket.user?.id}`);

    // Join a conversation room
    socket.on('join_room', (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User ${socket.user?.id} joined room ${conversationId}`);
    });

    // Send a message
    socket.on('send_message', async (data: { conversationId: string; content: string }) => {
      const { conversationId, content } = data;
      const senderId = socket.user?.id;

      if (!senderId || !conversationId || !content) {
        return;
      }

      try {
        // Save message to database
        const [result]: any = await pool.query(
          'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
          [conversationId, senderId, content]
        );

        // Fetch the saved message to return full object (including timestamp)
        const [messages]: any = await pool.query(
          'SELECT * FROM messages WHERE id = ?',
          [result.insertId]
        );
        const newMessage = messages[0];

        // Emit to everyone in the room (including sender)
        io.to(conversationId).emit('receive_message', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.id}`);
    });
  });

  return io;
};
