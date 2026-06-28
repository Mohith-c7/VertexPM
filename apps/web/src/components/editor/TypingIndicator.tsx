'use client';

import React, { useEffect, useState } from 'react';
import { useRealtime } from '../../hooks/useRealtime';

interface TypingIndicatorProps {
  itemId: string; // The ID of the item (e.g. work item, comment) being typed on
}

export function TypingIndicator({ itemId }: TypingIndicatorProps) {
  const { socket, connectionState } = useRealtime();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || connectionState !== 'connected') return;

    const onTyping = (data: { itemId: string; user: string }) => {
      if (data.itemId === itemId) {
        setTypingUsers((prev) => {
          if (!prev.includes(data.user)) {
            return [...prev, data.user];
          }
          return prev;
        });
      }
    };

    const onStopTyping = (data: { itemId: string; user: string }) => {
      if (data.itemId === itemId) {
        setTypingUsers((prev) => prev.filter(u => u !== data.user));
      }
    };

    socket.on('typing:start', onTyping);
    socket.on('typing:stop', onStopTyping);

    return () => {
      socket.off('typing:start', onTyping);
      socket.off('typing:stop', onStopTyping);
    };
  }, [socket, connectionState, itemId]);

  if (typingUsers.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 text-xs text-slate-500 italic mt-1">
      <div className="flex space-x-1">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>
        {typingUsers.length === 1
          ? `${typingUsers[0]} is typing...`
          : typingUsers.length === 2
          ? `${typingUsers.join(' and ')} are typing...`
          : `${typingUsers.length} people are typing...`}
      </span>
    </div>
  );
}
