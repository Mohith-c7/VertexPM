import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { setupConnectionManager } from "./connection-manager";
import { socketAuthMiddleware } from "./middleware";

let io: SocketIOServer;

export function initSocketServer(httpServer: HttpServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // Adjust appropriately for production
      methods: ["GET", "POST"]
    },
    // Heartbeat and reconnect settings
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  // Authenticate every connection before it joins any rooms
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    setupConnectionManager(io, socket);
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.io has not been initialized yet.");
  }
  return io;
}
