import { Server, Socket } from "socket.io";
import { RoomManager } from "./room-manager";
import { presenceEngine } from "./presence-engine";

export function setupConnectionManager(io: Server, socket: Socket) {
  const userId = socket.data.userId;
  
  console.log(`[Socket.io] Client connected: ${socket.id} (User: ${userId})`);
  
  // Register user presence
  presenceEngine.userConnected(socket.id, userId);

  // Heartbeat/Ping support
  socket.on("ping", (cb) => {
    if (typeof cb === "function") cb("pong");
  });

  // Room Management Events
  socket.on("join:workspace", (workspaceId: string) => {
    const room = RoomManager.joinWorkspace(socket, workspaceId);
    console.log(`[Socket.io] Socket ${socket.id} joined ${room}`);
  });

  socket.on("leave:workspace", (workspaceId: string) => {
    RoomManager.leaveWorkspace(socket, workspaceId);
  });

  socket.on("join:project", (projectId: string) => {
    RoomManager.joinProject(socket, projectId);
  });

  socket.on("leave:project", (projectId: string) => {
    RoomManager.leaveProject(socket, projectId);
  });

  socket.on("join:board", (boardId: string) => {
    RoomManager.joinBoard(socket, boardId);
    presenceEngine.setActiveBoard(socket.id, boardId);
    
    // Broadcast to board that user joined
    io.to(RoomManager.getBoardRoom(boardId)).emit("presence:update", {
      userId,
      boardId,
      action: "joined"
    });
  });

  socket.on("leave:board", (boardId: string) => {
    RoomManager.leaveBoard(socket, boardId);
    presenceEngine.clearActiveBoard(socket.id);
    
    // Broadcast to board that user left
    io.to(RoomManager.getBoardRoom(boardId)).emit("presence:update", {
      userId,
      boardId,
      action: "left"
    });
  });

  socket.on("error", (err) => {
    console.error(`[Socket.io] Socket error for ${socket.id}:`, err);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[Socket.io] Client disconnected: ${socket.id} (Reason: ${reason})`);
    
    // Notify board if they were active in one
    const presence = presenceEngine.getUserPresenceBySocket(socket.id);
    if (presence?.activeBoardId) {
      io.to(RoomManager.getBoardRoom(presence.activeBoardId)).emit("presence:update", {
        userId,
        boardId: presence.activeBoardId,
        action: "left"
      });
    }

    presenceEngine.userDisconnected(socket.id);
  });
}
