import { v4 as uuidv4 } from 'uuid';
import { ConditionGroup, AutomationAction, BuilderState, AutomationTemplate } from '../types';
import { AUTOMATION_TEMPLATES } from '../constants';

// ─── ID Generators ────────────────────────────────────────────────────────────

export const generateId = (): string =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

// ─── Condition Builders ───────────────────────────────────────────────────────

export const createEmptyConditionGroup = (): ConditionGroup => ({
  id: generateId(),
  logic: 'AND',
  conditions: [
    {
      id: generateId(),
      field: '',
      operator: '',
      value: '',
    },
  ],
});

export const createEmptyAction = (order: number): AutomationAction => ({
  id: generateId(),
  type: '',
  config: {},
  order,
});

// ─── Builder State ────────────────────────────────────────────────────────────

export const createInitialBuilderState = (): BuilderState => ({
  step: 1,
  name: '',
  description: '',
  status: 'active',
  triggerType: '',
  triggerConfig: {},
  conditionGroups: [],
  actions: [],
  selectedTemplateId: null,
});

export const applyTemplateToBuilderState = (
  state: BuilderState,
  templateId: string
): BuilderState => {
  const template = AUTOMATION_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return state;

  return {
    ...state,
    selectedTemplateId: templateId,
    name: template.name,
    description: template.description,
    triggerType: template.triggerType,
    triggerConfig: {},
    conditionGroups: template.conditionGroups.map((g) => ({
      ...g,
      id: generateId(),
      conditions: g.conditions.map((c) => ({ ...c, id: generateId() })),
    })),
    actions: template.actions.map((a, i) => ({ ...a, id: generateId(), order: i + 1 })),
  };
};

// ─── Duration Formatter ───────────────────────────────────────────────────────

export const formatDuration = (ms?: number): string => {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

// ─── Date Formatters ──────────────────────────────────────────────────────────

export const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

export const formatDateTime = (dateStr?: string): string => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString();
};

// ─── Validation Helpers ───────────────────────────────────────────────────────

export const isBuilderStepComplete = (state: BuilderState, step: number): boolean => {
  switch (step) {
    case 1:
      return true; // Template selection is optional
    case 2:
      return !!state.triggerType;
    case 3:
      return true; // Conditions are optional
    case 4:
      return (
        state.actions.length > 0 &&
        state.actions.every((a) => !!a.type)
      );
    case 5:
      return !!state.name.trim();
    default:
      return false;
  }
};

// ─── Status Helpers ───────────────────────────────────────────────────────────

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Active',
    disabled: 'Disabled',
    draft: 'Draft',
    SUCCESS: 'Success',
    FAILED: 'Failed',
    RETRYING: 'Retrying',
    PENDING: 'Pending',
    RUNNING: 'Running',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    UPCOMING: 'Upcoming',
    OVERDUE: 'Overdue',
  };
  return labels[status] ?? status;
};
