import {
  TriggerType,
  ConditionField,
  ConditionOperator,
  ActionType,
  AutomationTemplate,
} from '../types';
import {
  Zap,
  Edit,
  UserCheck,
  CheckCircle,
  MessageCircle,
  Calendar,
  Bell,
  Clock,
  BellRing,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  Tag,
  type LucideIcon,
} from 'lucide-react';

// ─── Trigger Definitions ──────────────────────────────────────────────────────

export interface TriggerDefinition {
  type: TriggerType;
  label: string;
  description: string;
  icon: LucideIcon;
  category: string;
  color: string;
}

export const TRIGGER_DEFINITIONS: TriggerDefinition[] = [
  {
    type: 'WORKITEM_CREATED',
    label: 'Work Item Created',
    description: 'When a work item is created',
    icon: Zap,
    category: 'Work Items',
    color: '#6366f1',
  },
  {
    type: 'WORKITEM_UPDATED',
    label: 'Work Item Updated',
    description: 'When a work item is updated',
    icon: Edit,
    category: 'Work Items',
    color: '#8b5cf6',
  },
  {
    type: 'WORKITEM_ASSIGNED',
    label: 'Work Item Assigned',
    description: 'When someone is assigned',
    icon: UserCheck,
    category: 'Work Items',
    color: '#3b82f6',
  },
  {
    type: 'WORKITEM_COMPLETED',
    label: 'Work Item Completed',
    description: 'When a work item is completed',
    icon: CheckCircle,
    category: 'Work Items',
    color: '#10b981',
  },
  {
    type: 'COMMENT_ADDED',
    label: 'Comment Added',
    description: 'When a comment is added',
    icon: MessageCircle,
    category: 'Communication',
    color: '#f59e0b',
  },
  {
    type: 'DUE_DATE_REACHED',
    label: 'Due Date Reached',
    description: 'When due date is reached',
    icon: Calendar,
    category: 'Scheduling',
    color: '#ef4444',
  },
  {
    type: 'REMINDER_TIME',
    label: 'Reminder Time',
    description: 'At a scheduled reminder time',
    icon: Bell,
    category: 'Scheduling',
    color: '#f97316',
  },
  {
    type: 'SCHEDULE',
    label: 'Recurring Schedule',
    description: 'On a recurring schedule',
    icon: Clock,
    category: 'Scheduling',
    color: '#06b6d4',
  },
];

export const TRIGGER_CATEGORIES = Array.from(
  new Set(TRIGGER_DEFINITIONS.map((t) => t.category))
);

// ─── Action Definitions ───────────────────────────────────────────────────────

export interface ActionDefinition {
  type: ActionType;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export const ACTION_DEFINITIONS: ActionDefinition[] = [
  {
    type: 'CREATE_NOTIFICATION',
    label: 'Send Notification',
    icon: BellRing,
    color: '#6366f1',
    description: 'Send a notification to users',
  },
  {
    type: 'ASSIGN_USER',
    label: 'Assign User',
    icon: UserPlus,
    color: '#3b82f6',
    description: 'Assign the work item to a user',
  },
  {
    type: 'CHANGE_STATUS',
    label: 'Change Status',
    icon: RefreshCw,
    color: '#10b981',
    description: 'Update the work item status',
  },
  {
    type: 'CHANGE_PRIORITY',
    label: 'Change Priority',
    icon: AlertTriangle,
    color: '#f59e0b',
    description: 'Update the work item priority',
  },
  {
    type: 'ADD_LABEL',
    label: 'Add Label',
    icon: Tag,
    color: '#8b5cf6',
    description: 'Add a label to the work item',
  },
  {
    type: 'SCHEDULE_REMINDER',
    label: 'Schedule Reminder',
    icon: Clock,
    color: '#06b6d4',
    description: 'Schedule a reminder for later',
  },
];

// ─── Condition Field Definitions ──────────────────────────────────────────────

export interface FieldDefinition {
  field: ConditionField;
  label: string;
  operators: ConditionOperator[];
  valueType: 'text' | 'select' | 'multi-select' | 'date' | 'number';
  options?: { label: string; value: string }[];
}

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    field: 'status',
    label: 'Status',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    valueType: 'select',
    options: [
      { label: 'Backlog', value: 'Backlog' },
      { label: 'Todo', value: 'Todo' },
      { label: 'In Progress', value: 'In Progress' },
      { label: 'In Review', value: 'In Review' },
      { label: 'Done', value: 'Done' },
    ],
  },
  {
    field: 'priority',
    label: 'Priority',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    valueType: 'select',
    options: [
      { label: 'Low', value: 'Low' },
      { label: 'Medium', value: 'Medium' },
      { label: 'High', value: 'High' },
      { label: 'Critical', value: 'Critical' },
    ],
  },
  {
    field: 'labels',
    label: 'Labels',
    operators: ['contains', 'not_contains', 'is_empty', 'is_not_empty'],
    valueType: 'text',
  },
  {
    field: 'assignee',
    label: 'Assignee',
    operators: ['equals', 'not_equals', 'is_empty', 'is_not_empty'],
    valueType: 'text',
  },
  {
    field: 'dueDate',
    label: 'Due Date',
    operators: ['equals', 'greater_than', 'less_than', 'is_empty', 'is_not_empty'],
    valueType: 'date',
  },
  {
    field: 'storyPoints',
    label: 'Story Points',
    operators: ['equals', 'not_equals', 'greater_than', 'less_than'],
    valueType: 'number',
  },
];

export const OPERATOR_LABELS: Record<ConditionOperator, string> = {
  equals: 'equals',
  not_equals: 'does not equal',
  contains: 'contains',
  not_contains: 'does not contain',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
  greater_than: 'greater than',
  less_than: 'less than',
  in: 'is any of',
  not_in: 'is none of',
};

// ─── Automation Templates ─────────────────────────────────────────────────────

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Task Assigned → Notify Assignee',
    description: 'Automatically notify users when a task is assigned to them.',
    triggerType: 'WORKITEM_ASSIGNED',
    conditionGroups: [],
    actions: [
      {
        id: 'action-1',
        type: 'CREATE_NOTIFICATION',
        config: { message: 'You have been assigned a new task.' },
        order: 1,
      },
    ],
    category: 'Notifications',
    tags: ['notification', 'assignment'],
  },
  {
    id: 'tpl-2',
    name: 'Task Completed → Move to Done + Notify Reporter',
    description: 'When a task is completed, update status and notify the reporter.',
    triggerType: 'WORKITEM_COMPLETED',
    conditionGroups: [],
    actions: [
      {
        id: 'action-1',
        type: 'CHANGE_STATUS',
        config: { status: 'Done' },
        order: 1,
      },
      {
        id: 'action-2',
        type: 'CREATE_NOTIFICATION',
        config: { message: 'A task you reported has been completed.' },
        order: 2,
      },
    ],
    category: 'Workflow',
    tags: ['completion', 'status', 'notification'],
  },
  {
    id: 'tpl-3',
    name: 'Due Tomorrow → Send Reminder',
    description: 'Send a reminder when a task is due the next day.',
    triggerType: 'DUE_DATE_REACHED',
    conditionGroups: [],
    actions: [
      {
        id: 'action-1',
        type: 'SCHEDULE_REMINDER',
        config: {
          reminderType: 'DUE_TODAY',
          message: 'This task is due tomorrow!',
        },
        order: 1,
      },
    ],
    category: 'Reminders',
    tags: ['reminder', 'due-date'],
  },
  {
    id: 'tpl-4',
    name: 'Overdue → Escalation Reminder',
    description: 'Automatically escalate overdue tasks with a high-priority reminder.',
    triggerType: 'DUE_DATE_REACHED',
    conditionGroups: [
      {
        id: 'grp-1',
        logic: 'AND',
        conditions: [
          {
            id: 'cond-1',
            field: 'status',
            operator: 'not_equals',
            value: 'Done',
          },
        ],
      },
    ],
    actions: [
      {
        id: 'action-1',
        type: 'CHANGE_PRIORITY',
        config: { priority: 'Critical' },
        order: 1,
      },
      {
        id: 'action-2',
        type: 'CREATE_NOTIFICATION',
        config: { message: 'URGENT: This task is overdue and requires immediate attention.' },
        order: 2,
      },
    ],
    category: 'Escalation',
    tags: ['overdue', 'escalation', 'priority'],
  },
];

// ─── Status Options ───────────────────────────────────────────────────────────

export const STATUS_OPTIONS = [
  { label: 'Backlog', value: 'Backlog' },
  { label: 'Todo', value: 'Todo' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'In Review', value: 'In Review' },
  { label: 'Done', value: 'Done' },
];

export const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Critical', value: 'Critical' },
];

export const REMINDER_TYPE_OPTIONS = [
  { label: 'Due Today', value: 'DUE_TODAY' },
  { label: 'Overdue', value: 'OVERDUE' },
  { label: 'Custom', value: 'CUSTOM' },
];

export const ENTITY_TYPE_OPTIONS = [
  { label: 'Work Item', value: 'WORK_ITEM' },
  { label: 'Project', value: 'PROJECT' },
  { label: 'Sprint', value: 'SPRINT' },
];

// ─── Builder Steps ────────────────────────────────────────────────────────────

export const BUILDER_STEPS = [
  { step: 1, label: 'Template', description: 'Choose a starting point' },
  { step: 2, label: 'Trigger', description: 'When to run' },
  { step: 3, label: 'Conditions', description: 'Filter by criteria' },
  { step: 4, label: 'Actions', description: 'What to do' },
  { step: 5, label: 'Review', description: 'Save your rule' },
];

// ─── Colors ───────────────────────────────────────────────────────────────────

export const JOB_STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  RUNNING: '#3b82f6',
  COMPLETED: '#10b981',
  FAILED: '#ef4444',
  CANCELLED: '#6b7280',
};

export const EXECUTION_STATUS_COLORS: Record<string, string> = {
  SUCCESS: '#10b981',
  FAILED: '#ef4444',
  RETRYING: '#f59e0b',
  PENDING: '#6b7280',
};
