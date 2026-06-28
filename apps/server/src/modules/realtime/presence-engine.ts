export interface UserPresence {
  userId: string;
  socketId: string;
  activeBoardId?: string;
  lastSeen: Date;
}

class PresenceEngine {
  // Map socketId -> UserPresence
  private presences: Map<string, UserPresence> = new Map(); 
  // Map userId -> Set<socketId> (supports multiple connections per user)
  private userSockets: Map<string, Set<string>> = new Map(); 

  userConnected(socketId: string, userId: string) {
    this.presences.set(socketId, {
      userId,
      socketId,
      lastSeen: new Date(),
    });

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
  }

  userDisconnected(socketId: string) {
    const presence = this.presences.get(socketId);
    if (presence) {
      const { userId } = presence;
      this.presences.delete(socketId);
      
      const userSocketSet = this.userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.delete(socketId);
        if (userSocketSet.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
    return presence;
  }

  setActiveBoard(socketId: string, boardId: string) {
    const presence = this.presences.get(socketId);
    if (presence) {
      presence.activeBoardId = boardId;
      presence.lastSeen = new Date();
    }
  }

  clearActiveBoard(socketId: string) {
    const presence = this.presences.get(socketId);
    if (presence) {
      presence.activeBoardId = undefined;
      presence.lastSeen = new Date();
    }
  }

  getUserPresenceBySocket(socketId: string): UserPresence | undefined {
    return this.presences.get(socketId);
  }

  getUserPresence(userId: string): UserPresence[] {
    const socketIds = this.userSockets.get(userId) || new Set();
    const presences: UserPresence[] = [];
    for (const sid of socketIds) {
      const p = this.presences.get(sid);
      if (p) presences.push(p);
    }
    return presences;
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }
}

export const presenceEngine = new PresenceEngine();
