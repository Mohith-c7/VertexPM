import { ActionType } from "../types";

export interface ActionContext {
  entityId: string;
  entityType: string;
  workspaceId: string;
  projectId?: string;
  boardId?: string;
  actorId?: string;
  event: any;
}

export interface ActionHandler {
  type: ActionType;
  execute: (context: ActionContext, config: any) => Promise<void>;
}
