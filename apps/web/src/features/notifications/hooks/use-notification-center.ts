'use client';

import { useState, useCallback } from 'react';

export function useNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'notifications' | 'preferences'>('notifications');

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const openPreferences = useCallback(() => {
    setActivePanel('preferences');
    setIsOpen(true);
  }, []);

  const openNotifications = useCallback(() => {
    setActivePanel('notifications');
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    activePanel,
    open,
    close,
    toggle,
    openPreferences,
    openNotifications,
    setActivePanel,
  };
}
