export interface SkillContext {
  userId?: string;
  workspaceId?: string;
  projectId?: string;
  boardId?: string;
  [key: string]: any;
}

export interface SkillExecuteOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export interface AISkill<TInput = any, TOutput = any> {
  id: string;
  name: string;
  description: string;
  category: string;
  
  execute(
    input: TInput,
    context: SkillContext,
    options?: SkillExecuteOptions
  ): Promise<TOutput>;
}
