'use client';

import { useEffect, useContext } from 'react';
import { RealtimeContext } from '@/services/realtime/provider';
import {
  NotificationCreatedEvent,
  NotificationReadEvent,
  NotificationCountUpdatedEvent,
  Notification,
} from '../types';
import { SOCKET_EVENTS } from '../constants';

interface UseNotificationSocketOptions {
  onNotificationCreated?: (notification: Notification) => void;
  onNotificationRead?: (notificationId: string) => void;
  onCountUpdated?: (count: number) => void;
  enabled?: boolean;
}

export function useNotificationSocket({
  onNotificationCreated,
  onNotificationRead,
  onCountUpdated,
  enabled = true,
}: UseNotificationSocketOptions = {}) {
  const ctx = useContext(RealtimeContext);

  useEffect(() => {
    if (!ctx?.socket || !enabled) return;
    const { socket } = ctx;

    const handleCreated = (event: NotificationCreatedEvent) => {
      onNotificationCreated?.(event.notification);
    };

    const handleRead = (event: NotificationReadEvent) => {
      onNotificationRead?.(event.notificationId);
    };

    const handleCountUpdated = (event: NotificationCountUpdatedEvent) => {
      onCountUpdated?.(event.count);
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION_CREATED, handleCreated);
    socket.on(SOCKET_EVENTS.NOTIFICATION_READ, handleRead);
    socket.on(SOCKET_EVENTS.COUNT_UPDATED, handleCountUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_CREATED, handleCreated);
      socket.off(SOCKET_EVENTS.NOTIFICATION_READ, handleRead);
      socket.off(SOCKET_EVENTS.COUNT_UPDATED, handleCountUpdated);
    };
  }, [ctx?.socket, enabled, onNotificationCreated, onNotificationRead, onCountUpdated]);

  return {
    isConnected: ctx?.connectionState === 'connected',
    connectionState: ctx?.connectionState,
  };
}
