import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  boardType: z.enum(['KANBAN', 'SCRUM', 'PERSONAL']).optional(),
  visibility: z.enum(['PRIVATE', 'WORKSPACE']).optional(),
});

export const updateBoardSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  boardType: z.enum(['KANBAN', 'SCRUM', 'PERSONAL']).optional(),
  visibility: z.enum(['PRIVATE', 'WORKSPACE']).optional(),
  isArchived: z.boolean().optional(),
  position: z.number().optional(),
});

export const boardIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const projectIdParamSchema = z.object({
  projectId: z.string().uuid(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
