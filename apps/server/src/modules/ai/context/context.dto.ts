import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().uuid().optional(),
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  boardId: z.string().uuid().optional(),
  workItemId: z.string().uuid().optional(),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;

export const createConversationSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().optional(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
