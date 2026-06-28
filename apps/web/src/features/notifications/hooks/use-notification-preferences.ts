'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '../services/notification.service';
import { NotificationPreferences, NotificationType, NotificationChannel } from '../types';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  inAppEnabled: true,
  browserEnabled: false,
  emailEnabled: true,
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  },
  types: [
    { type: 'ASSIGNMENT', enabled: true, channels: ['IN_APP', 'BROWSER'] },
    { type: 'MENTION', enabled: true, channels: ['IN_APP', 'BROWSER'] },
    { type: 'COMMENT', enabled: true, channels: ['IN_APP'] },
    { type: 'REPLY', enabled: true, channels: ['IN_APP'] },
    { type: 'STATUS_CHANGE', enabled: true, channels: ['IN_APP'] },
    { type: 'PRIORITY_CHANGE', enabled: true, channels: ['IN_APP', 'BROWSER'] },
    { type: 'DUE_DATE', enabled: true, channels: ['IN_APP', 'BROWSER'] },
    { type: 'REMINDER', enabled: true, channels: ['IN_APP', 'BROWSER'] },
    { type: 'SYSTEM', enabled: true, channels: ['IN_APP'] },
  ],
};

export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const prefs = await fetchNotificationPreferences();
      setPreferences(prefs);
    } catch {
      // Use defaults silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      setIsSaving(true);
      setError(null);
      const optimistic = { ...preferences, ...updates };
      setPreferences(optimistic);
      try {
        const saved = await updateNotificationPreferences(updates);
        setPreferences(saved);
      } catch {
        setPreferences(preferences);
        setError('Failed to save preferences');
      } finally {
        setIsSaving(false);
      }
    },
    [preferences]
  );

  const toggleTypeEnabled = useCallback(
    (type: NotificationType) => {
      const types = preferences.types.map((t) =>
        t.type === type ? { ...t, enabled: !t.enabled } : t
      );
      save({ types });
    },
    [preferences.types, save]
  );

  const toggleTypeChannel = useCallback(
    (type: NotificationType, channel: NotificationChannel) => {
      const types = preferences.types.map((t) => {
        if (t.type !== type) return t;
        const channels = t.channels.includes(channel)
          ? t.channels.filter((c) => c !== channel)
          : [...t.channels, channel];
        return { ...t, channels };
      });
      save({ types });
    },
    [preferences.types, save]
  );

  return {
    preferences,
    isLoading,
    isSaving,
    error,
    save,
    toggleTypeEnabled,
    toggleTypeChannel,
    reload: load,
  };
}
