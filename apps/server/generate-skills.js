/* eslint-disable */
const fs = require('fs');
const path = require('path');

const generationSkills = ['epic.generator.ts', 'story.generator.ts', 'task.generator.ts', 'bug.generator.ts', 'feature.generator.ts', 'checklist.generator.ts', 'acceptance.generator.ts'];
const writingSkills = ['rewrite.skill.ts', 'improve.skill.ts', 'summarize.skill.ts', 'explain.skill.ts', 'grammar.skill.ts', 'title.skill.ts'];
const estimationSkills = ['storypoint.skill.ts', 'estimate.skill.ts'];

const baseDir = 'd:\\VertexPM\\apps\\server\\src\\modules\\ai\\skills';

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getTemplate = (name, category, schema, isList = false) => {
  const className = name.split('.')[0].replace(/-/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()).replace(/ /g, '') + 'Skill';
  const id = `${category.toLowerCase()}-${name.split('.')[0]}`;
  const responseType = isList ? 'string[]' : 'any';

  return `import { AISkill, SkillContext, SkillExecuteOptions } from '../skill.interface';
import { SKILL_CATEGORIES } from '../skill.constants';
import { AIGateway } from '../../gateway';

export class ${className} implements AISkill<any, ${responseType}> {
  id = '${id}';
  name = '${className.replace('Skill', '')}';
  description = 'AI Skill for ${name.split('.')[0]}';
  category = SKILL_CATEGORIES.${category.toUpperCase()};

  async execute(input: any, context: SkillContext, options?: SkillExecuteOptions) {
    const prompt = \`Perform \${this.name} based on the following input: \${JSON.stringify(input)} and context: \${JSON.stringify(context)}.
Respond ONLY with a valid JSON object matching this schema:
${schema}\`;
    
    const response = await AIGateway.generateDirect(prompt, options);
    
    try {
      const match = response.content.match(/\\\`\\\`\\\`json\\n([\\s\\S]*?)\\n\\\`\\\`\\\`/);
      const jsonStr = match ? match[1] : response.content.trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON for ${id}", response.content);
      throw e;
    }
  }
}
`;
};

createDir(path.join(baseDir, 'generation'));
createDir(path.join(baseDir, 'writing'));
createDir(path.join(baseDir, 'estimation'));

generationSkills.forEach(file => {
  const schema = file.includes('checklist') || file.includes('acceptance') 
    ? '["Item 1", "Item 2"]' 
    : '{\n  "title": "Title",\n  "description": "Description"\n}';
  fs.writeFileSync(path.join(baseDir, 'generation', file), getTemplate(file, 'Generation', schema, file.includes('checklist') || file.includes('acceptance')));
});

writingSkills.forEach(file => {
  const schema = '{\n  "result": "The rewritten or improved text"\n}';
  fs.writeFileSync(path.join(baseDir, 'writing', file), getTemplate(file, 'Writing', schema));
});

estimationSkills.forEach(file => {
  const schema = '{\n  "estimate": 5,\n  "reasoning": "Explanation"\n}';
  fs.writeFileSync(path.join(baseDir, 'estimation', file), getTemplate(file, 'Estimation', schema));
});

console.log('Skill files generated successfully');
