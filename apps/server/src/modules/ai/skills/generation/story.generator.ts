import { AISkill, SkillContext, SkillExecuteOptions } from '../skill.interface';
import { SKILL_CATEGORIES } from '../skill.constants';
import { AIGateway } from '../../gateway';

export class StorySkill implements AISkill<any, any> {
  id = 'generation-story';
  name = 'Story';
  description = 'AI Skill for story';
  category = SKILL_CATEGORIES.GENERATION;

  async execute(input: any, context: SkillContext, options?: SkillExecuteOptions) {
    const prompt = `Perform ${this.name} based on the following input: ${JSON.stringify(input)} and context: ${JSON.stringify(context)}.
Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Title",
  "description": "Description"
}`;
    
    const response = await AIGateway.generateDirect(prompt, options);
    
    try {
      const match = response.content.match(/```json\n([\s\S]*?)\n```/);
      const jsonStr = match ? match[1] : response.content.trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON for generation-story", response.content);
      throw e;
    }
  }
}
