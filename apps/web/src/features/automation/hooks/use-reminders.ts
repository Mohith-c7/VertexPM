'use client';

import { useState, useEffect, useCallback } from 'react';
import { Reminder, CreateReminderDto } from '../types';
import { automationService } from '../services/automation.service';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await automationService.getReminders();
      setReminders(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load reminders';
      setError(msg);
      setReminders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const createReminder = useCallback(async (data: CreateReminderDto): Promise<Reminder | null> => {
    try {
      setSavingId('new');
      const created = await automationService.createReminder(data);
      setReminders((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create reminder';
      setError(msg);
      return null;
    } finally {
      setSavingId(null);
    }
  }, []);

  const deleteReminder = useCallback(async (id: string): Promise<boolean> => {
    try {
      setSavingId(id);
      await automationService.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete reminder';
      setError(msg);
      return false;
    } finally {
      setSavingId(null);
    }
  }, []);

  const upcomingReminders = reminders.filter((r) => r.status === 'UPCOMING');
  const overdueReminders = reminders.filter((r) => r.status === 'OVERDUE');
  const completedReminders = reminders.filter((r) => r.status === 'COMPLETED');

  return {
    reminders,
    upcomingReminders,
    overdueReminders,
    completedReminders,
    isLoading,
    error,
    savingId,
    fetchReminders,
    createReminder,
    deleteReminder,
  };
}
