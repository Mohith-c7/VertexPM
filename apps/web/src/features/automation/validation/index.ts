import { CreateAutomationRuleDto, CreateReminderDto } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Rule Validation ──────────────────────────────────────────────────────────

export const validateAutomationRule = (
  data: Partial<CreateAutomationRuleDto>
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Rule name is required' });
  }
  if (data.name && data.name.length > 100) {
    errors.push({ field: 'name', message: 'Name must be 100 characters or fewer' });
  }
  if (!data.triggerType) {
    errors.push({ field: 'triggerType', message: 'A trigger type is required' });
  }
  if (!data.actions || data.actions.length === 0) {
    errors.push({ field: 'actions', message: 'At least one action is required' });
  }
  data.actions?.forEach((action, i) => {
    if (!action.type) {
      errors.push({ field: `actions[${i}].type`, message: `Action ${i + 1} requires a type` });
    }
  });

  return errors;
};

// ─── Reminder Validation ──────────────────────────────────────────────────────

export const validateReminder = (data: Partial<CreateReminderDto>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.entityType) {
    errors.push({ field: 'entityType', message: 'Entity type is required' });
  }
  if (!data.entityId?.trim()) {
    errors.push({ field: 'entityId', message: 'Entity ID is required' });
  }
  if (!data.type) {
    errors.push({ field: 'type', message: 'Reminder type is required' });
  }
  if (!data.remindAt) {
    errors.push({ field: 'remindAt', message: 'Reminder date/time is required' });
  }
  if (data.remindAt && new Date(data.remindAt) < new Date()) {
    errors.push({ field: 'remindAt', message: 'Reminder must be set in the future' });
  }

  return errors;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

export const hasErrors = (errors: ValidationError[]): boolean => errors.length > 0;

export const getFieldError = (
  errors: ValidationError[],
  field: string
): string | undefined => errors.find((e) => e.field === field)?.message;
