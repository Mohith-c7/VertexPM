import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { AI_CONFIG } from '../config';

// Initialize Google Provider
export const googleProvider = createGoogleGenerativeAI({
  apiKey: AI_CONFIG.providers.gemini.apiKey,
});

// Initialize OpenRouter Provider (using OpenAI API compatibility)
export const openRouterProvider = createOpenAI({
  apiKey: AI_CONFIG.providers.openrouter.apiKey,
  baseURL: AI_CONFIG.providers.openrouter.baseUrl,
});

export const getProviderModel = (provider: string, modelId: string) => {
  if (provider === 'gemini') {
    return googleProvider(modelId);
  } else if (provider === 'openrouter') {
    return openRouterProvider(modelId);
  }
  throw new Error(`Unsupported provider: ${provider}`);
};
