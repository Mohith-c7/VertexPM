import { z } from 'zod';

export const AIRequestSchema = z.object({
  promptId: z.string(),
  variables: z.record(z.string(), z.any()).optional(),
  config: z.object({
    provider: z.enum(['gemini', 'openrouter']).optional(),
    modelId: z.string().optional(),
    temperature: z.number().optional(),
    maxTokens: z.number().optional(),
    topP: z.number().optional(),
  }).optional(),
});

export type AIRequestDto = z.infer<typeof AIRequestSchema>;
