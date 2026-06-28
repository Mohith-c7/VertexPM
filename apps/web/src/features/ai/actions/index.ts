export type AiActionType = 
  | 'generate-workitem'
  | 'rewrite-description'
  | 'summarize'
  | 'estimate'
  | 'checklist'
  | 'acceptance'
  | 'explain'
  | 'improve';

export interface AiActionRequest {
  action: AiActionType;
  context: string;
  options?: Record<string, any>;
}

export interface AiActionResponse {
  result: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
}
