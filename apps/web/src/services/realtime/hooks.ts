'use client';

import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { RealtimeContext } from './provider';
import { ConnectionState, PresenceUser, RoomPresenceState, WorkItemUpdatePayload } from './types';

// Core hook to access the context
export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

// Hook to get connection state
export const useConnection = (): { state: ConnectionState; isConnected: boolean } => {
  const { connectionState } = useRealtime();
  
  return {
    state: connectionState,
    isConnected: connectionState === 'connected',
  };
};

// Hook to manage presence in a room
export const usePresence = (roomId: string): RoomPresenceState => {
  const { socket, joinRoom, leaveRoom } = useRealtime();
  const [users, setUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!socket || !roomId) return;

    // Join room when component mounts
    joinRoom(roomId);

    // Setup listeners for presence
    const handlePresenceSync = (data: PresenceUser[]) => {
      setUsers(data);
    };

    const handleUserJoin = (user: PresenceUser) => {
      setUsers((prev) => {
        // Prevent duplicates
        if (prev.find((u) => u.id === user.id)) return prev;
        return [...prev, user];
      });
    };

    const handleUserLeave = (userId: string) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    };

    // Assuming standard event names, these can be adjusted later
    socket.on(`presence:${roomId}:sync`, handlePresenceSync);
    socket.on(`presence:${roomId}:join`, handleUserJoin);
    socket.on(`presence:${roomId}:leave`, handleUserLeave);

    return () => {
      socket.off(`presence:${roomId}:sync`, handlePresenceSync);
      socket.off(`presence:${roomId}:join`, handleUserJoin);
      socket.off(`presence:${roomId}:leave`, handleUserLeave);
      
      // Leave room when component unmounts
      leaveRoom(roomId);
    };
  }, [socket, roomId, joinRoom, leaveRoom]);

  return { users };
};

export interface UseBoardRealtimeOptions {
  onWorkItemUpdated?: (payload: WorkItemUpdatePayload) => void;
  onWorkItemCreated?: (payload: any) => void;
  onWorkItemDeleted?: (payload: { id: string }) => void;
}

// Hook to sync board state automatically
export const useBoardRealtime = (boardId: string, options?: UseBoardRealtimeOptions) => {
  const { socket, joinRoom, leaveRoom } = useRealtime();
  
  // Store callbacks in refs so we don't rebind socket events on every render if options change
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (!socket || !boardId) return;

    const roomName = `board:${boardId}`;
    joinRoom(roomName);

    const handleWorkItemUpdated = (payload: WorkItemUpdatePayload) => {
      if (optionsRef.current?.onWorkItemUpdated) {
        optionsRef.current.onWorkItemUpdated(payload);
      }
    };

    const handleWorkItemCreated = (payload: any) => {
      if (optionsRef.current?.onWorkItemCreated) {
        optionsRef.current.onWorkItemCreated(payload);
      }
    };

    const handleWorkItemDeleted = (payload: { id: string }) => {
      if (optionsRef.current?.onWorkItemDeleted) {
        optionsRef.current.onWorkItemDeleted(payload);
      }
    };

    socket.on('work_item:updated', handleWorkItemUpdated);
    socket.on('work_item:created', handleWorkItemCreated);
    socket.on('work_item:deleted', handleWorkItemDeleted);

    return () => {
      socket.off('work_item:updated', handleWorkItemUpdated);
      socket.off('work_item:created', handleWorkItemCreated);
      socket.off('work_item:deleted', handleWorkItemDeleted);
      leaveRoom(roomName);
    };
  }, [socket, boardId, joinRoom, leaveRoom]);

  // Can also return methods to emit events for optimistic UI
  const emitWorkItemUpdate = useCallback(
    (payload: WorkItemUpdatePayload) => {
      if (socket && socket.connected) {
        socket.emit('work_item:update', payload);
      }
    },
    [socket]
  );

  return {
    emitWorkItemUpdate,
  };
};
