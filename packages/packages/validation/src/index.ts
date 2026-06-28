import { z } from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type WorkspaceInput = z.infer<typeof workspaceSchema>;
