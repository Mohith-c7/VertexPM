import { z } from 'zod';

export const createProjectSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(3).max(100),
  key: z.string().min(3).max(10).regex(/^[A-Z0-9]+$/).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  key: z.string().min(3).max(10).regex(/^[A-Z0-9]+$/).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  isArchived: z.boolean().optional(),
});

export const projectParamsSchema = z.object({
  id: z.string().uuid(),
});

export const getProjectsQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  isArchived: z.string().optional().transform((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type GetProjectsQueryInput = z.infer<typeof getProjectsQuerySchema>;
