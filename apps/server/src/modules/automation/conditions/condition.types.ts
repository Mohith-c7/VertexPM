import { ConditionType } from "../types";

export interface ConditionContext {
  entityId: string;
  entityType: string;
  workspaceId: string;
  projectId?: string;
  boardId?: string;
  actorId?: string;
  event: any;
}

export interface ConditionHandler {
  type: ConditionType;
  evaluate: (context: ConditionContext, config: any) => boolean | Promise<boolean>;
}
