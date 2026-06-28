'use client';

import { useState, useEffect, useCallback } from 'react';
import { AutomationRule, CreateAutomationRuleDto, UpdateAutomationRuleDto } from '../types';
import { automationService } from '../services/automation.service';

export function useAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await automationService.getRules();
      setRules(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load automation rules';
      setError(msg);
      // Use mock data if backend not available
      setRules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = useCallback(async (data: CreateAutomationRuleDto): Promise<AutomationRule | null> => {
    try {
      setSavingId('new');
      const created = await automationService.createRule(data);
      setRules((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create rule';
      setError(msg);
      return null;
    } finally {
      setSavingId(null);
    }
  }, []);

  const updateRule = useCallback(async (id: string, data: UpdateAutomationRuleDto): Promise<AutomationRule | null> => {
    try {
      setSavingId(id);
      const updated = await automationService.updateRule(id, data);
      setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update rule';
      setError(msg);
      return null;
    } finally {
      setSavingId(null);
    }
  }, []);

  const deleteRule = useCallback(async (id: string): Promise<boolean> => {
    try {
      setSavingId(id);
      await automationService.deleteRule(id);
      setRules((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete rule';
      setError(msg);
      return false;
    } finally {
      setSavingId(null);
    }
  }, []);

  const toggleRule = useCallback(async (id: string, enable: boolean): Promise<boolean> => {
    try {
      setSavingId(id);
      const updated = enable
        ? await automationService.enableRule(id)
        : await automationService.disableRule(id);
      setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle rule';
      setError(msg);
      return false;
    } finally {
      setSavingId(null);
    }
  }, []);

  const activeRules = rules.filter((r) => r.status === 'active');
  const disabledRules = rules.filter((r) => r.status === 'disabled');
  const draftRules = rules.filter((r) => r.status === 'draft');

  return {
    rules,
    activeRules,
    disabledRules,
    draftRules,
    isLoading,
    error,
    savingId,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
  };
}
