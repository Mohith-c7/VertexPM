'use client';

import React, { useEffect, useState } from 'react';
import { useRealtime } from '../../hooks/useRealtime';
import { PresenceUser } from '../../services/realtime/types';
import { AvatarGroup } from './AvatarGroup';

export function OnlineUsers() {
  const { socket, connectionState } = useRealtime();
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for global online user updates
    const onUsersUpdate = (users: PresenceUser[]) => {
      setOnlineUsers(users);
    };

    socket.on('presence:global', onUsersUpdate);

    return () => {
      socket.off('presence:global', onUsersUpdate);
    };
  }, [socket]);

  if (connectionState !== 'connected' || onlineUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Online</span>
      <AvatarGroup users={onlineUsers} max={5} size="sm" />
    </div>
  );
}
