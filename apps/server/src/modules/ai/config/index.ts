import { AIProviderConfig, RetryOptions } from '../types';

export const AI_CONFIG = {
  defaultProvider: 'gemini' as const,
  defaultModel: 'gemini-2.5-flash',
  providers: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
    },
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY || '',
      baseUrl: 'https://openrouter.ai/api/v1',
    },
  },
  retry: {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
  } as RetryOptions,
};
