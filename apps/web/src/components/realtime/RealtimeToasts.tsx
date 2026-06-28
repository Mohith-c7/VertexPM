'use client';

import React, { useEffect } from 'react';
import { useRealtime } from '../../hooks/useRealtime';
import { useToast } from '../../providers/ToastProvider';

export function RealtimeToasts() {
  const { socket } = useRealtime();
  const { toast } = useToast();

  useEffect(() => {
    if (!socket) return;

    const onNotification = (data: { title: string; description?: string; type?: 'default' | 'success' | 'error' | 'warning' }) => {
      toast({
        title: data.title,
        description: data.description,
        type: data.type || 'default',
      });
    };

    socket.on('notification', onNotification);

    return () => {
      socket.off('notification', onNotification);
    };
  }, [socket, toast]);

  return null; // This is a logic-only component that handles realtime events
}
