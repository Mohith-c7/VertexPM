import { skillRegistry } from './skill.registry';
import { EpicSkill } from './generation/epic.generator';
import { StorySkill } from './generation/story.generator';
import { TaskSkill } from './generation/task.generator';
import { BugSkill } from './generation/bug.generator';
import { FeatureSkill } from './generation/feature.generator';
import { ChecklistSkill } from './generation/checklist.generator';
import { AcceptanceSkill } from './generation/acceptance.generator';

import { RewriteSkill } from './writing/rewrite.skill';
import { ImproveSkill } from './writing/improve.skill';
import { SummarizeSkill } from './writing/summarize.skill';
import { ExplainSkill } from './writing/explain.skill';
import { GrammarSkill } from './writing/grammar.skill';
import { TitleSkill } from './writing/title.skill';

import { StorypointSkill } from './estimation/storypoint.skill';
import { EstimateSkill } from './estimation/estimate.skill';

export * from './skill.interface';
export * from './skill.constants';
export * from './skill.errors';
export * from './skill.logger';
export * from './skill.validator';
export * from './skill.registry';
export * from './skill.executor';
export * from './skill.engine';
export * from './skills.routes';

// Register all skills
const initializeSkills = () => {
  skillRegistry.register(new EpicSkill());
  skillRegistry.register(new StorySkill());
  skillRegistry.register(new TaskSkill());
  skillRegistry.register(new BugSkill());
  skillRegistry.register(new FeatureSkill());
  skillRegistry.register(new ChecklistSkill());
  skillRegistry.register(new AcceptanceSkill());

  skillRegistry.register(new RewriteSkill());
  skillRegistry.register(new ImproveSkill());
  skillRegistry.register(new SummarizeSkill());
  skillRegistry.register(new ExplainSkill());
  skillRegistry.register(new GrammarSkill());
  skillRegistry.register(new TitleSkill());

  skillRegistry.register(new StorypointSkill());
  skillRegistry.register(new EstimateSkill());
};

initializeSkills();
