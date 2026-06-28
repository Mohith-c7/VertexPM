'use client';

import { useState, useCallback, useEffect } from 'react';
import { Notification } from '../types';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function useBrowserNotifications() {
  const [permissionState, setPermissionState] = useState<PermissionState>('default');

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermissionState('unsupported');
      return;
    }
    setPermissionState(window.Notification.permission as PermissionState);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const result = await window.Notification.requestPermission();
      setPermissionState(result as PermissionState);
      return result === 'granted';
    } catch {
      return false;
    }
  }, []);

  const showBrowserNotification = useCallback(
    (notification: Notification) => {
      if (permissionState !== 'granted') return;
      if (typeof window === 'undefined' || !('Notification' in window)) return;

      const title = notification.title;
      const body = notification.body;
      const icon = '/favicon.ico';

      try {
        const browserNotif = new window.Notification(title, {
          body,
          icon,
          tag: notification.id,
          requireInteraction: notification.priority === 'URGENT' || notification.priority === 'HIGH',
        });

        browserNotif.onclick = () => {
          window.focus();
          browserNotif.close();
          // Navigate to entity if available
          const url = notification.entity?.url;
          if (url && url !== '#') {
            window.location.href = url;
          }
        };
      } catch {
        // Browser notification failed silently
      }
    },
    [permissionState]
  );

  return {
    permissionState,
    isSupported: permissionState !== 'unsupported',
    isGranted: permissionState === 'granted',
    isDenied: permissionState === 'denied',
    requestPermission,
    showBrowserNotification,
  };
}
