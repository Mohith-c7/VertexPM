import { z } from 'zod';

// ==========================================
// Comments
// ==========================================

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(5000),
  parentCommentId: z.string().uuid().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(5000),
});

export const commentParamsSchema = z.object({
  id: z.string().uuid(),
});

export const getCommentsQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 50)),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type GetCommentsQueryInput = z.infer<typeof getCommentsQuerySchema>;

// ==========================================
// Attachments
// ==========================================

export const attachmentParamsSchema = z.object({
  id: z.string().uuid(),
});

export const createAttachmentSchema = z.object({
  fileName: z.string().min(1).max(255),
  originalName: z.string().min(1).max(255),
  mimeType: z.string(),
  fileSize: z.number().positive(),
  data: z.string(), // base64 mock
});

export const getAttachmentsQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 50)),
});

export type CreateAttachmentInput = z.infer<typeof createAttachmentSchema>;
export type GetAttachmentsQueryInput = z.infer<typeof getAttachmentsQuerySchema>;

// ==========================================
// Activity
// ==========================================

export const activityParamsSchema = z.object({
  id: z.string().uuid(),
});

export const getActivityQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 50)),
});

export type GetActivityQueryInput = z.infer<typeof getActivityQuerySchema>;
