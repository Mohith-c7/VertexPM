import { Socket } from 'socket.io-client';

export type ConnectionState = 'connected' | 'disconnected' | 'connecting' | 'reconnecting' | 'error';

export interface RealtimeContextValue {
  socket: Socket | null;
  connectionState: ConnectionState;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

export interface PresenceUser {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: string;
}

export interface RoomPresenceState {
  users: PresenceUser[];
}

// Event types for the board
export interface WorkItemUpdatePayload {
  id: string;
  boardId: string;
  [key: string]: any; // Allow partial updates
}
