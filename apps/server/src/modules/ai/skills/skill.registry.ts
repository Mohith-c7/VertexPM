import { AISkill } from './skill.interface';
import { SkillNotFoundError } from './skill.errors';
import { skillLogger } from './skill.logger';

export class SkillRegistry {
  private skills: Map<string, AISkill> = new Map();

  register(skill: AISkill) {
    if (this.skills.has(skill.id)) {
      skillLogger.warn(`Overwriting existing skill with id: ${skill.id}`);
    }
    this.skills.set(skill.id, skill);
    skillLogger.info(`Registered skill: ${skill.id}`);
  }

  get(skillId: string): AISkill {
    const skill = this.skills.get(skillId);
    if (!skill) {
      throw new SkillNotFoundError(skillId);
    }
    return skill;
  }

  getAll(): AISkill[] {
    return Array.from(this.skills.values());
  }
}

export const skillRegistry = new SkillRegistry();
