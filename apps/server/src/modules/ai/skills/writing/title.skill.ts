import { AISkill, SkillContext, SkillExecuteOptions } from '../skill.interface';
import { SKILL_CATEGORIES } from '../skill.constants';
import { AIGateway } from '../../gateway';

export class TitleSkill implements AISkill<any, any> {
  id = 'writing-title';
  name = 'Title';
  description = 'AI Skill for title';
  category = SKILL_CATEGORIES.WRITING;

  async execute(input: any, context: SkillContext, options?: SkillExecuteOptions) {
    const prompt = `Perform ${this.name} based on the following input: ${JSON.stringify(input)} and context: ${JSON.stringify(context)}.
Respond ONLY with a valid JSON object matching this schema:
{
  "result": "The rewritten or improved text"
}`;
    
    const response = await AIGateway.generateDirect(prompt, options);
    
    try {
      const match = response.content.match(/```json\n([\s\S]*?)\n```/);
      const jsonStr = match ? match[1] : response.content.trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON for writing-title", response.content);
      throw e;
    }
  }
}
