'use client';

import { useState, useCallback } from 'react';
import {
  BuilderState,
  BuilderStep,
  TriggerType,
  TriggerConfig,
  ConditionGroup,
  AutomationAction,
  AutomationStatus,
  AutomationTemplate,
} from '../types';
import {
  createInitialBuilderState,
  createEmptyConditionGroup,
  createEmptyAction,
  generateId,
  applyTemplateToBuilderState,
  isBuilderStepComplete,
} from '../utils';

export function useAutomationBuilder(initialState?: Partial<BuilderState>) {
  const [state, setState] = useState<BuilderState>({
    ...createInitialBuilderState(),
    ...initialState,
  });

  const setStep = useCallback((step: BuilderStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (prev.step < 5) return { ...prev, step: (prev.step + 1) as BuilderStep };
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      if (prev.step > 1) return { ...prev, step: (prev.step - 1) as BuilderStep };
      return prev;
    });
  }, []);

  const setName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, name }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setState((prev) => ({ ...prev, description }));
  }, []);

  const setStatus = useCallback((status: AutomationStatus) => {
    setState((prev) => ({ ...prev, status }));
  }, []);

  const setTriggerType = useCallback((triggerType: TriggerType | '') => {
    setState((prev) => ({ ...prev, triggerType, triggerConfig: {} }));
  }, []);

  const setTriggerConfig = useCallback((triggerConfig: TriggerConfig) => {
    setState((prev) => ({ ...prev, triggerConfig }));
  }, []);

  const updateTriggerConfig = useCallback((key: string, value: unknown) => {
    setState((prev) => ({
      ...prev,
      triggerConfig: { ...prev.triggerConfig, [key]: value },
    }));
  }, []);

  // ─── Condition Group Operations ──────────────────────────────────────────────

  const addConditionGroup = useCallback(() => {
    setState((prev) => ({
      ...prev,
      conditionGroups: [...prev.conditionGroups, createEmptyConditionGroup()],
    }));
  }, []);

  const removeConditionGroup = useCallback((groupId: string) => {
    setState((prev) => ({
      ...prev,
      conditionGroups: prev.conditionGroups.filter((g) => g.id !== groupId),
    }));
  }, []);

  const updateGroupLogic = useCallback((groupId: string, logic: 'AND' | 'OR') => {
    setState((prev) => ({
      ...prev,
      conditionGroups: prev.conditionGroups.map((g) =>
        g.id === groupId ? { ...g, logic } : g
      ),
    }));
  }, []);

  const addCondition = useCallback((groupId: string) => {
    setState((prev) => ({
      ...prev,
      conditionGroups: prev.conditionGroups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          conditions: [
            ...g.conditions,
            { id: generateId(), field: '', operator: '', value: '' },
          ],
        };
      }),
    }));
  }, []);

  const removeCondition = useCallback((groupId: string, conditionId: string) => {
    setState((prev) => ({
      ...prev,
      conditionGroups: prev.conditionGroups
        .map((g) => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            conditions: g.conditions.filter((c) => c.id !== conditionId),
          };
        })
        .filter((g) => g.conditions.length > 0),
    }));
  }, []);

  const updateCondition = useCallback(
    (groupId: string, conditionId: string, updates: Partial<ConditionGroup['conditions'][0]>) => {
      setState((prev) => ({
        ...prev,
        conditionGroups: prev.conditionGroups.map((g) => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            conditions: g.conditions.map((c) =>
              c.id === conditionId ? { ...c, ...updates } : c
            ),
          };
        }),
      }));
    },
    []
  );

  // ─── Action Operations ────────────────────────────────────────────────────────

  const addAction = useCallback(() => {
    setState((prev) => ({
      ...prev,
      actions: [...prev.actions, createEmptyAction(prev.actions.length + 1)],
    }));
  }, []);

  const removeAction = useCallback((actionId: string) => {
    setState((prev) => ({
      ...prev,
      actions: prev.actions
        .filter((a) => a.id !== actionId)
        .map((a, i) => ({ ...a, order: i + 1 })),
    }));
  }, []);

  const updateAction = useCallback((actionId: string, updates: Partial<AutomationAction>) => {
    setState((prev) => ({
      ...prev,
      actions: prev.actions.map((a) =>
        a.id === actionId ? { ...a, ...updates } : a
      ),
    }));
  }, []);

  const updateActionConfig = useCallback(
    (actionId: string, key: string, value: unknown) => {
      setState((prev) => ({
        ...prev,
        actions: prev.actions.map((a) =>
          a.id === actionId
            ? { ...a, config: { ...a.config, [key]: value } }
            : a
        ),
      }));
    },
    []
  );

  // ─── Template ─────────────────────────────────────────────────────────────────

  const applyTemplate = useCallback((templateId: string) => {
    setState((prev) => applyTemplateToBuilderState(prev, templateId));
  }, []);

  const clearTemplate = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedTemplateId: null,
      triggerType: '',
      triggerConfig: {},
      conditionGroups: [],
      actions: [],
    }));
  }, []);

  // ─── Reset ────────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setState(createInitialBuilderState());
  }, []);

  const canProceed = isBuilderStepComplete(state, state.step);

  return {
    state,
    canProceed,
    setStep,
    nextStep,
    prevStep,
    setName,
    setDescription,
    setStatus,
    setTriggerType,
    setTriggerConfig,
    updateTriggerConfig,
    addConditionGroup,
    removeConditionGroup,
    updateGroupLogic,
    addCondition,
    removeCondition,
    updateCondition,
    addAction,
    removeAction,
    updateAction,
    updateActionConfig,
    applyTemplate,
    clearTemplate,
    reset,
  };
}
