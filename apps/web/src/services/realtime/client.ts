import { io, Socket } from 'socket.io-client';

class RealtimeClient {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    // Determine the websocket URL (e.g. from env, defaulting to localhost if not found)
    this.url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
  }

  public connect(token?: string): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (!this.socket) {
      this.socket = io(this.url, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        auth: {
          token,
        },
      });
    }

    if (token) {
      this.socket.auth = { token };
    }

    this.socket.connect();
    return this.socket;
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

// Export a singleton instance
export const realtimeClient = new RealtimeClient();
