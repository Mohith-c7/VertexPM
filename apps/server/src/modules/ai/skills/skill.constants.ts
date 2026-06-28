export const SKILL_CATEGORIES = {
  GENERATION: 'generation',
  WRITING: 'writing',
  ESTIMATION: 'estimation',
  ANALYSIS: 'analysis',
} as const;

export type SkillCategory = typeof SKILL_CATEGORIES[keyof typeof SKILL_CATEGORIES];
