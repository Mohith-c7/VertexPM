// ─── Trigger Types ────────────────────────────────────────────────────────────

export type TriggerType =
  | 'WORKITEM_CREATED'
  | 'WORKITEM_UPDATED'
  | 'WORKITEM_ASSIGNED'
  | 'WORKITEM_COMPLETED'
  | 'COMMENT_ADDED'
  | 'DUE_DATE_REACHED'
  | 'REMINDER_TIME'
  | 'SCHEDULE';

export interface TriggerConfig {
  entityType?: string;
  workspaceId?: string;
  projectId?: string;
  boardId?: string;
  cronExpression?: string;
  [key: string]: unknown;
}

// ─── Condition Types ──────────────────────────────────────────────────────────

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'is_empty'
  | 'is_not_empty'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'not_in';

export type ConditionField =
  | 'status'
  | 'priority'
  | 'labels'
  | 'assignee'
  | 'dueDate'
  | 'storyPoints'
  | 'type'
  | 'reporter';

export type LogicOperator = 'AND' | 'OR';

export interface Condition {
  id: string;
  field: ConditionField | '';
  operator: ConditionOperator | '';
  value: string | string[];
}

export interface ConditionGroup {
  id: string;
  logic: LogicOperator;
  conditions: Condition[];
}

// ─── Action Types ─────────────────────────────────────────────────────────────

export type ActionType =
  | 'CREATE_NOTIFICATION'
  | 'ASSIGN_USER'
  | 'CHANGE_STATUS'
  | 'CHANGE_PRIORITY'
  | 'ADD_LABEL'
  | 'SCHEDULE_REMINDER';

export interface ActionConfig {
  message?: string;
  title?: string;
  userId?: string;
  status?: string;
  priority?: string;
  label?: string;
  reminderType?: string;
  remindAt?: string;
  [key: string]: unknown;
}

export interface AutomationAction {
  id: string;
  type: ActionType | '';
  config: ActionConfig;
  order: number;
}

// ─── Automation Rule ──────────────────────────────────────────────────────────

export type AutomationStatus = 'active' | 'disabled' | 'draft';

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  status: AutomationStatus;
  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
  conditionGroups: ConditionGroup[];
  actions: AutomationAction[];
  workspaceId?: string;
  projectId?: string;
  executionCount?: number;
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
}

export interface CreateAutomationRuleDto {
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
  conditionGroups?: ConditionGroup[];
  actions: AutomationAction[];
  workspaceId?: string;
  projectId?: string;
  status?: AutomationStatus;
}

export interface UpdateAutomationRuleDto extends Partial<CreateAutomationRuleDto> {}

// ─── Execution History ────────────────────────────────────────────────────────

export type ExecutionStatus = 'SUCCESS' | 'FAILED' | 'RETRYING' | 'PENDING';

export interface ExecutionLog {
  id: string;
  ruleId: string;
  ruleName?: string;
  triggerType: TriggerType;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  actionsRun?: number;
  retryCount?: number;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface ExecutionHistoryFilters {
  status?: ExecutionStatus | 'ALL';
  dateFrom?: string;
  dateTo?: string;
  ruleId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedExecutionHistory {
  data: ExecutionLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Scheduled Jobs ───────────────────────────────────────────────────────────

export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type JobType =
  | 'DUE_DATE_REMINDER'
  | 'OVERDUE_REMINDER'
  | 'CUSTOM_REMINDER'
  | 'RECURRING_AUTOMATION';

export interface ScheduledJob {
  id: string;
  type: JobType;
  status: JobStatus;
  scheduledFor?: string;
  nextRun?: string;
  lastRun?: string;
  retryCount?: number;
  maxRetries?: number;
  payload?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Reminders ────────────────────────────────────────────────────────────────

export type ReminderType = 'DUE_TODAY' | 'OVERDUE' | 'CUSTOM';
export type ReminderStatus = 'UPCOMING' | 'OVERDUE' | 'COMPLETED' | 'CANCELLED';

export interface Reminder {
  id: string;
  entityType: string;
  entityId: string;
  type: ReminderType;
  message?: string;
  remindAt: string;
  status: ReminderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReminderDto {
  entityType: string;
  entityId: string;
  type: ReminderType;
  message?: string;
  remindAt: string;
}

// ─── Automation Template ──────────────────────────────────────────────────────

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  triggerType: TriggerType;
  conditionGroups: ConditionGroup[];
  actions: AutomationAction[];
  category?: string;
  tags?: string[];
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface AutomationStats {
  activeRules: number;
  disabledRules: number;
  executionsToday: number;
  failedJobs: number;
  totalRules: number;
  successRate?: number;
}

// ─── Builder State ────────────────────────────────────────────────────────────

export type BuilderStep = 1 | 2 | 3 | 4 | 5;

export interface BuilderState {
  step: BuilderStep;
  name: string;
  description: string;
  status: AutomationStatus;
  triggerType: TriggerType | '';
  triggerConfig: TriggerConfig;
  conditionGroups: ConditionGroup[];
  actions: AutomationAction[];
  selectedTemplateId: string | null;
}
