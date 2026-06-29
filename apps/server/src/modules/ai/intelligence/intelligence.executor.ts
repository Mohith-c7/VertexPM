import { generateObject } from 'ai';
import { z } from 'zod';
import { intelligenceLogger } from './intelligence.logger';
import { getProviderModel } from '../providers';
import { AI_CONFIG } from '../config';
import { RetryStrategy } from '../retry';
import { UsageTracker } from '../usage';

export class IntelligenceExecutor {
  async execute<T>(prompt: string, schema: z.ZodSchema<T>, context: any): Promise<T> {
    intelligenceLogger.log('Executing AI prompt', { prompt, context });
    
    const providerStr = AI_CONFIG.defaultProvider;
    const modelStr = AI_CONFIG.defaultModel;
    const model = getProviderModel(providerStr, modelStr);

    try {
      const result = await RetryStrategy.execute(async () => {
        const { object, usage } = await generateObject({
          model,
          schema,
          prompt,
        });

        if (usage) {
          const anyUsage = usage as any;
          const tokenUsage = {
            promptTokens: anyUsage.promptTokens || 0,
            completionTokens: anyUsage.completionTokens || 0,
            totalTokens: anyUsage.totalTokens || 0,
          };
          UsageTracker.track(providerStr, modelStr, tokenUsage);
        }

        return object;
      });

      return result;
    } catch (error: any) {
      intelligenceLogger.error('AI generateObject execution failed', error);
      throw error;
    }
  }
}

export const intelligenceExecutor = new IntelligenceExecutor();
