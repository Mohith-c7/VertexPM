import { z } from "zod";

export const TriggerTypeEnum = z.enum([
  "WORKITEM_CREATED",
  "WORKITEM_UPDATED",
  "WORKITEM_ASSIGNED",
  "WORKITEM_COMPLETED",
  "WORKITEM_DELETED",
  "COMMENT_ADDED",
  "REPLY_ADDED",
  "MENTION_CREATED",
  "DUE_DATE_REACHED",
  "REMINDER_TIME",
  "SCHEDULE",
  "BOARD_CREATED",
  "PROJECT_UPDATED"
]);

export const ConditionTypeEnum = z.enum([
  "STATUS_EQUALS",
  "STATUS_NOT_EQUALS",
  "PRIORITY_EQUALS",
  "PRIORITY_GREATER_THAN",
  "LABEL_EXISTS",
  "ASSIGNEE_EXISTS",
  "DUE_DATE_BEFORE",
  "DUE_DATE_AFTER",
  "ESTIMATE_GREATER_THAN",
  "WORKSPACE",
  "PROJECT",
  "BOARD"
]);

export const ActionTypeEnum = z.enum([
  "CREATE_NOTIFICATION",
  "ASSIGN_USER",
  "MOVE_WORKITEM",
  "CHANGE_STATUS",
  "CHANGE_PRIORITY",
  "ADD_LABEL",
  "REMOVE_LABEL",
  "CREATE_ACTIVITY",
  "SCHEDULE_REMINDER",
  "CANCEL_REMINDER"
]);

export const conditionSchema = z.object({
  type: ConditionTypeEnum,
  config: z.record(z.string(), z.any()).or(z.any()).optional(),
});

export const actionSchema = z.object({
  type: ActionTypeEnum,
  config: z.record(z.string(), z.any()).or(z.any()),
});

export const createAutomationRuleSchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid().optional().nullable(),
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional().nullable(),
  triggerType: TriggerTypeEnum,
  triggerConfig: z.record(z.string(), z.any()).or(z.any()).optional().nullable(),
  conditions: z.array(conditionSchema).optional().nullable(),
  actions: z.array(actionSchema).min(1),
  isEnabled: z.boolean().optional().default(true),
});

export const updateAutomationRuleSchema = z.object({
  workspaceId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional().nullable(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  triggerType: TriggerTypeEnum.optional(),
  triggerConfig: z.record(z.string(), z.any()).or(z.any()).optional().nullable(),
  conditions: z.array(conditionSchema).optional().nullable(),
  actions: z.array(actionSchema).min(1).optional(),
  isEnabled: z.boolean().optional(),
});

export const getAutomationRulesQuerySchema = z.object({
  workspaceId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  isEnabled: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }, z.boolean().optional()),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(100).default(20)),
});

export const getAutomationHistoryQuerySchema = z.object({
  ruleId: z.string().uuid().optional(),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(100).default(20)),
});

export const getScheduledJobsQuerySchema = z.object({
  jobType: z.string().optional(),
  status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED"]).optional(),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(100).default(20)),
});

export const runJobSchema = z.object({
  jobType: z.string().min(1),
  payload: z.record(z.string(), z.any()).or(z.any()).optional(),
});

export const cancelJobSchema = z.object({
  jobId: z.string().uuid(),
});

export const getRemindersQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
});

export const createReminderSchema = z.object({
  userId: z.string().uuid(),
  entityId: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
  type: z.enum(["DUE_TODAY", "OVERDUE", "CUSTOM"]),
  message: z.string().min(1).max(1000),
  remindAt: z.preprocess((val) => {
    if (typeof val === "string") return new Date(val);
    return val;
  }, z.date()),
});

export const automationRuleIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const reminderIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateAutomationRuleInput = z.infer<typeof createAutomationRuleSchema>;
export type UpdateAutomationRuleInput = z.infer<typeof updateAutomationRuleSchema>;
export type GetAutomationRulesQuery = z.infer<typeof getAutomationRulesQuerySchema>;
export type GetAutomationHistoryQuery = z.infer<typeof getAutomationHistoryQuerySchema>;
export type GetScheduledJobsQuery = z.infer<typeof getScheduledJobsQuerySchema>;
export type RunJobInput = z.infer<typeof runJobSchema>;
export type CancelJobInput = z.infer<typeof cancelJobSchema>;
export type GetRemindersQuery = z.infer<typeof getRemindersQuerySchema>;
export type CreateReminderInput = z.infer<typeof createReminderSchema>;
