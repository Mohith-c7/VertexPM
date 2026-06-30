import { AISkill, SkillContext, SkillExecuteOptions } from '../skill.interface';
import { SKILL_CATEGORIES } from '../skill.constants';
import { AIGateway } from '../../gateway';

export class AcceptanceSkill implements AISkill<any, string[]> {
  id = 'generation-acceptance';
  name = 'Acceptance';
  description = 'AI Skill for acceptance';
  category = SKILL_CATEGORIES.GENERATION;

  async execute(input: any, context: SkillContext, options?: SkillExecuteOptions) {
    const prompt = `Perform ${this.name} based on the following input: ${JSON.stringify(input)} and context: ${JSON.stringify(context)}.
Respond ONLY with a valid JSON object matching this schema:
["Item 1", "Item 2"]`;
    
    const response = await AIGateway.generateDirect(prompt, options);
    
    try {
      const match = response.content.match(/```json\n([\s\S]*?)\n```/);
      const jsonStr = match ? match[1] : response.content.trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON for generation-acceptance", response.content);
      throw e;
    }
  }
}
