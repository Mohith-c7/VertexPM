import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(60),
  slug: z.string().optional(),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(3).max(60).optional(),
  slug: z.string().optional(),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
});

export const addWorkspaceMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['OWNER', 'MEMBER']).default('MEMBER'),
});

export const workspaceIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const workspaceMemberParamsSchema = z.object({
  id: z.string().uuid(),
  memberId: z.string().uuid(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>;
