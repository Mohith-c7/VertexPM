import { z } from 'zod';

export const createColumnSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  wipLimit: z.number().optional(),
  isCompletedColumn: z.boolean().optional(),
});

export const updateColumnSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  wipLimit: z.number().optional(),
  isCompletedColumn: z.boolean().optional(),
});

export const columnIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const columnBoardIdParamSchema = z.object({
  boardId: z.string().uuid(),
});

export const reorderColumnsSchema = z.object({
  columns: z.array(z.object({
    id: z.string().uuid(),
    position: z.number()
  }))
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
export type ReorderColumnsInput = z.infer<typeof reorderColumnsSchema>;
