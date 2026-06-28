import { z } from "zod";

export const RealtimeEventSchema = z.object({
  eventId: z.string().uuid(),
  event: z.string(), // e.g., workitem.created
  workspaceId: z.string().optional(),
  projectId: z.string().optional(),
  boardId: z.string().optional(),
  entityId: z.string().optional(),
  actor: z.object({
    id: z.string(),
    name: z.string().optional(),
  }).optional(),
  timestamp: z.string().datetime(),
  payload: z.any()
});

export type RealtimeEvent = z.infer<typeof RealtimeEventSchema>;

export type DispatcherInput = Omit<RealtimeEvent, 'eventId' | 'timestamp'>;
