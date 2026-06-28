import { z } from "zod";

// Shared schemas
const contextSchema = z.record(z.string(), z.any()).optional();

export const executeSkillSchema = z.object({
  body: z.object({
    skillId: z.string(),
    input: z.any().optional(),
    context: contextSchema,
    options: z.record(z.string(), z.any()).optional(),
  }),
});

export const generationSkillSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    context: contextSchema,
  }),
});

export const writingSkillSchema = z.object({
  body: z.object({
    text: z.string().min(1),
    instruction: z.string().optional(),
    context: contextSchema,
  }),
});

export const estimationSkillSchema = z.object({
  body: z.object({
    title: z.string(),
    description: z.string().optional(),
    acceptanceCriteria: z.array(z.string()).optional(),
    context: contextSchema,
  }),
});

export type ExecuteSkillInput = z.infer<typeof executeSkillSchema>;
export type GenerationSkillInput = z.infer<typeof generationSkillSchema>;
export type WritingSkillInput = z.infer<typeof writingSkillSchema>;
export type EstimationSkillInput = z.infer<typeof estimationSkillSchema>;
