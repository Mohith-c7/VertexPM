import { TriggerType } from "../types";

export interface TriggerContext {
  actorId?: string;
  workspaceId: string;
  projectId?: string;
  entityId: string;
  entityType: string;
  metadata?: any;
}

export interface TriggerHandler {
  type: TriggerType;
  matches: (event: any, ruleConfig?: any) => boolean | Promise<boolean>;
}
