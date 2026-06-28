import fp from "fastify-plugin";
import { Server as SocketIOServer } from "socket.io";
import { realtimeDispatcher } from "./realtime.dispatcher";
import { verifyAccessToken } from "../../utils/jwt";
import type { FastifyInstance } from "fastify";

export const realtimeSyncPlugin = fp(async (app: FastifyInstance) => {
  const io = new SocketIOServer(app.server, {
    cors: {
      origin: "*", // Adjust in production
      methods: ["GET", "POST"]
    }
  });

  // Permission Layer & Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = verifyAccessToken(token.replace('Bearer ', ''));
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    // Room subscription based on permissions
    // Assuming clients emit 'join' with the room they want to join
    socket.on("join", (room: string) => {

      // Future: Add real permission checking here (e.g. check if user can access this board/project/workspace)
      socket.join(room);
    });

    socket.on("leave", (room: string) => {
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      // Clean up if needed
    });
  });

  // Attach io to dispatcher
  realtimeDispatcher.setServer(io);

  app.decorate("io", io);

  app.addHook("onClose", (instance: FastifyInstance, done: () => void) => {
    io.close();
    done();
  });
});
