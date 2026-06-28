import { z } from "zod";
import { WorkItemType, WorkItemStatus, WorkItemPriority } from "@prisma/client";

export const createWorkItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  type: z.nativeEnum(WorkItemType),
  status: z.nativeEnum(WorkItemStatus).default(WorkItemStatus.TODO),
  priority: z.nativeEnum(WorkItemPriority).default(WorkItemPriority.MEDIUM),
  estimate: z.number().nonnegative().optional(),
  storyPoints: z.number().int().nonnegative().optional(),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  columnId: z.string().uuid("Invalid column ID"),
  assigneeId: z.string().uuid().optional().nullable(),
  reviewerId: z.string().uuid().optional().nullable(),
  position: z.number().int().optional(),
});

export type CreateWorkItemInput = z.infer<typeof createWorkItemSchema>;

export const updateWorkItemSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  type: z.nativeEnum(WorkItemType).optional(),
  status: z.nativeEnum(WorkItemStatus).optional(),
  priority: z.nativeEnum(WorkItemPriority).optional(),
  estimate: z.number().nonnegative().optional().nullable(),
  storyPoints: z.number().int().nonnegative().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  columnId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional().nullable(),
  reviewerId: z.string().uuid().optional().nullable(),
  position: z.number().int().optional(),
});

export type UpdateWorkItemInput = z.infer<typeof updateWorkItemSchema>;

export const queryWorkItemsSchema = z.object({
  boardId: z.string().uuid().optional(),
  columnId: z.string().uuid().optional(),
  type: z.nativeEnum(WorkItemType).optional(),
  status: z.nativeEnum(WorkItemStatus).optional(),
  priority: z.nativeEnum(WorkItemPriority).optional(),
  assigneeId: z.string().uuid().optional(),
  reporterId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  sortBy: z.enum(["createdAt", "updatedAt", "priority", "status", "position"]).default("position"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type QueryWorkItemsInput = z.infer<typeof queryWorkItemsSchema>;

export const createDependencySchema = z.object({
  successorId: z.string().uuid("Invalid successor ID"),
});

export type CreateDependencyInput = z.infer<typeof createDependencySchema>;
