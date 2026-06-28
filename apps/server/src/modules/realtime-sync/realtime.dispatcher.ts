import { Server as SocketIOServer } from "socket.io";
import { randomUUID } from "crypto";
import { RealtimeEvent, RealtimeEventSchema, DispatcherInput } from "./realtime.types";

export class RealtimeDispatcher {
  private static instance: RealtimeDispatcher;
  private io: SocketIOServer | null = null;

  private constructor() {}

  public static getInstance(): RealtimeDispatcher {
    if (!RealtimeDispatcher.instance) {
      RealtimeDispatcher.instance = new RealtimeDispatcher();
    }
    return RealtimeDispatcher.instance;
  }

  public setServer(io: SocketIOServer) {
    this.io = io;
  }

  public dispatch(rawEvent: DispatcherInput) {
    if (!this.io) {
      console.warn("RealtimeDispatcher: Socket.io server not initialized");
      return;
    }

    const event: RealtimeEvent = {
      ...rawEvent,
      eventId: randomUUID(),
      timestamp: new Date().toISOString()
    };

    const parsedResult = RealtimeEventSchema.safeParse(event);
    if (!parsedResult.success) {
      console.error("RealtimeDispatcher: Event validation failed", parsedResult.error);
      return;
    }

    const parsedEvent = parsedResult.data;
    const room = this.resolveRoom(parsedEvent);
    
    if (room) {
      this.io.to(room).emit(parsedEvent.event, parsedEvent);
    } else {
      this.io.emit(parsedEvent.event, parsedEvent);
    }
  }

  private resolveRoom(event: RealtimeEvent): string | null {
    // Only broadcast to the smallest room necessary
    if (event.boardId) return `board:${event.boardId}`;
    if (event.projectId) return `project:${event.projectId}`;
    if (event.workspaceId) return `workspace:${event.workspaceId}`;
    return null;
  }
}

export const realtimeDispatcher = RealtimeDispatcher.getInstance();
