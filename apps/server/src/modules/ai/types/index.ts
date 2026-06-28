export interface AIProviderConfig {
  provider: 'gemini' | 'openrouter';
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIResponse<T = any> {
  content: T;
  usage: TokenUsage;
  provider: string;
  model: string;
}

export interface PromptTemplate {
  id: string;
  version?: string;
  template: string;
  description?: string;
  defaults?: Record<string, any>;
}

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}
