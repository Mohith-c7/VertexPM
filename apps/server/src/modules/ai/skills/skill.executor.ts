import { AISkill, SkillContext, SkillExecuteOptions } from './skill.interface';
import { SkillExecutionError } from './skill.errors';
import { skillLogger } from './skill.logger';

export class SkillExecutor {
  static async execute<TInput, TOutput>(
    skill: AISkill<TInput, TOutput>,
    input: TInput,
    context: SkillContext,
    options?: SkillExecuteOptions
  ): Promise<TOutput> {
    try {
      skillLogger.info(`Executing skill: ${skill.id}`, { context, options });
      const startTime = Date.now();
      
      const result = await skill.execute(input, context, options);
      
      const duration = Date.now() - startTime;
      skillLogger.info(`Skill ${skill.id} executed successfully in ${duration}ms`);
      
      return result;
    } catch (error: any) {
      skillLogger.error(`Skill execution failed: ${skill.id}`, error);
      throw new SkillExecutionError(skill.id, error.message);
    }
  }
}
