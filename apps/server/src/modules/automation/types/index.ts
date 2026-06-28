import { AutomationRule, ExecutionLog, ScheduledJob, Reminder } from "@prisma/client";

export type { AutomationRule, ExecutionLog, ScheduledJob, Reminder };

export type TriggerType =
  | "WORKITEM_CREATED"
  | "WORKITEM_UPDATED"
  | "WORKITEM_ASSIGNED"
  | "WORKITEM_COMPLETED"
  | "WORKITEM_DELETED"
  | "COMMENT_ADDED"
  | "REPLY_ADDED"
  | "MENTION_CREATED"
  | "DUE_DATE_REACHED"
  | "REMINDER_TIME"
  | "SCHEDULE"
  | "BOARD_CREATED"
  | "PROJECT_UPDATED";

export type ConditionType =
  | "STATUS_EQUALS"
  | "STATUS_NOT_EQUALS"
  | "PRIORITY_EQUALS"
  | "PRIORITY_GREATER_THAN"
  | "LABEL_EXISTS"
  | "ASSIGNEE_EXISTS"
  | "DUE_DATE_BEFORE"
  | "DUE_DATE_AFTER"
  | "ESTIMATE_GREATER_THAN"
  | "WORKSPACE"
  | "PROJECT"
  | "BOARD";

export type ActionType =
  | "CREATE_NOTIFICATION"
  | "ASSIGN_USER"
  | "MOVE_WORKITEM"
  | "CHANGE_STATUS"
  | "CHANGE_PRIORITY"
  | "ADD_LABEL"
  | "REMOVE_LABEL"
  | "CREATE_ACTIVITY"
  | "SCHEDULE_REMINDER"
  | "CANCEL_REMINDER";

export interface AutomationCondition {
  type: ConditionType;
  config?: any;
}

export interface AutomationAction {
  type: ActionType;
  config: any;
}

export interface RuleTriggerConfig {
  cronExpression?: string; // for SCHEDULE
  remindBeforeHours?: number; // for DUE_DATE_REACHED
  [key: string]: any;
}

// Struct representing the context of a rule execution
export interface AutomationContext {
  depth: number;
  executedRuleIds: Set<string>;
  actorId?: string;
  eventTimestamp: number;
  triggerEvent?: any; // The original event payload that triggered this rule evaluation
}

// Scheduled job payload details
export interface DueDateReminderPayload {
  workItemId: string;
  dueDate: string;
}

export interface OverdueReminderPayload {
  workItemId: string;
  dueDate: string;
}

export interface DailyDigestPayload {
  userId: string;
}

export interface WeeklyDigestPayload {
  userId: string;
}
