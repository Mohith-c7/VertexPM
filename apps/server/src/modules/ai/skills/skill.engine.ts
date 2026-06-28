import { skillRegistry } from './skill.registry';
import { SkillExecutor } from './skill.executor';
import { SkillContext, SkillExecuteOptions } from './skill.interface';
import { skillLogger } from './skill.logger';

export class SkillEngine {
  
  static async execute(
    skillId: string,
    input: any,
    context: SkillContext,
    options?: SkillExecuteOptions
  ) {
    skillLogger.info(`SkillEngine executing ${skillId}`);
    const skill = skillRegistry.get(skillId);
    return await SkillExecutor.execute(skill, input, context, options);
  }

  static getSkills() {
    return skillRegistry.getAll();
  }
}
