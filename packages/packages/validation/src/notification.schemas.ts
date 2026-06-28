import { z } from "zod";

export const NotificationTypeEnum = z.enum([
  "ASSIGNMENT",
  "MENTION",
  "COMMENT",
  "REPLY",
  "STATUS_CHANGE",
  "PRIORITY_CHANGE",
  "DUE_DATE",
  "REMINDER",
  "BOARD_UPDATE",
  "PROJECT_UPDATE",
  "WORKSPACE_UPDATE",
  "SYSTEM",
  "AI",
  "AUTOMATION",
  "SECURITY"
]);

export const quietHoursSchema = z.object({
  enabled: z.boolean(),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(0).max(23),
});

export const getNotificationsQuerySchema = z.object({
  isRead: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }, z.boolean().optional()),
  isArchived: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return undefined;
  }, z.boolean().optional()),
  type: NotificationTypeEnum.optional(),
  category: z.string().optional(),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(100).default(20)),
});

export const notificationIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const getNotificationPreferencesQuerySchema = z.object({
  workspaceId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
});

export const updateNotificationPreferencesSchema = z.object({
  workspaceId: z.string().uuid().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
  types: z.array(NotificationTypeEnum).optional(),
  channels: z.array(z.enum(["IN_APP", "BROWSER"])).optional(),
  quietHours: quietHoursSchema.optional(),
  digestFreq: z.string().optional().nullable(),
});

export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>;
export type UpdateNotificationPreferences = z.infer<typeof updateNotificationPreferencesSchema>;
export type GetNotificationPreferencesQuery = z.infer<typeof getNotificationPreferencesQuerySchema>;
