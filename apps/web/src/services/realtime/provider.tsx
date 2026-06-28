'use client';

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { realtimeClient } from './client';
import { ConnectionState, RealtimeContextValue } from './types';

export const RealtimeContext = createContext<RealtimeContextValue | null>(null);

interface RealtimeProviderProps {
  children: ReactNode;
  token?: string; // Optional auth token for connection
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children, token }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  useEffect(() => {
    const socketInstance = realtimeClient.connect(token);
    setSocket(socketInstance);

    const onConnect = () => {
      setConnectionState('connected');
    };

    const onDisconnect = (reason: string) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        setConnectionState('disconnected');
      } else {
        // else the socket will automatically try to reconnect
        setConnectionState('reconnecting');
      }
    };

    const onConnectError = () => {
      setConnectionState('error');
    };

    if (socketInstance.connected) {
      setConnectionState('connected');
    } else {
      setConnectionState('connecting');
    }

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onConnectError);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onConnectError);
      
      // We don't necessarily want to disconnect the global socket on provider unmount if it's meant to be global,
      // but usually the provider wraps the entire app.
      // realtimeClient.disconnect();
    };
  }, [token]);

  const joinRoom = (room: string) => {
    if (socket && socket.connected) {
      socket.emit('room:join', { room });
    }
  };

  const leaveRoom = (room: string) => {
    if (socket && socket.connected) {
      socket.emit('room:leave', { room });
    }
  };

  const value: RealtimeContextValue = {
    socket,
    connectionState,
    joinRoom,
    leaveRoom,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};
