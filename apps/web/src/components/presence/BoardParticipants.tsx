'use client';

import React, { useEffect, useState } from 'react';
import { useRealtime } from '../../hooks/useRealtime';
import { PresenceUser } from '../../services/realtime/types';
import { AvatarGroup } from './AvatarGroup';
import { Users } from 'lucide-react';

interface BoardParticipantsProps {
  boardId: string;
}

export function BoardParticipants({ boardId }: BoardParticipantsProps) {
  const { socket, connectionState, joinRoom, leaveRoom } = useRealtime();
  const [participants, setParticipants] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!socket || connectionState !== 'connected') return;

    const roomName = `board:${boardId}`;
    joinRoom(roomName);

    const onPresenceUpdate = (data: { room: string; users: PresenceUser[] }) => {
      if (data.room === roomName) {
        setParticipants(data.users);
      }
    };

    socket.on('presence:room', onPresenceUpdate);

    return () => {
      socket.off('presence:room', onPresenceUpdate);
      leaveRoom(roomName);
    };
  }, [socket, connectionState, boardId, joinRoom, leaveRoom]);

  if (participants.length === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
      <div className="flex items-center gap-1.5 text-slate-500 pl-1 border-r border-slate-100 pr-3">
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">{participants.length}</span>
      </div>
      <AvatarGroup users={participants} max={4} size="md" />
    </div>
  );
}
