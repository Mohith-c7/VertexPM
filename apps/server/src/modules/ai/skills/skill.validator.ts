import { ZodObject, ZodError } from 'zod';
import { SkillValidationError } from './skill.errors';
import { skillLogger } from './skill.logger';

export class SkillValidator {
  static validateInput(skillId: string, schema: ZodObject<any>, data: any) {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        skillLogger.error(`Validation error in ${skillId}`, error.issues);
        throw new SkillValidationError(skillId, error.issues.map((e: any) => e.message).join(', '));
      }
      throw error;
    }
  }
}
