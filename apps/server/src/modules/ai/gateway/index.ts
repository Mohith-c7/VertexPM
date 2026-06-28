import { generateText, streamText } from 'ai';
import { getProviderModel } from '../providers';
import { RetryStrategy } from '../retry';
import { UsageTracker } from '../usage';
import { AIProviderConfig, AIResponse } from '../types';
import { AI_CONFIG } from '../config';
import { promptEngine } from '../prompts';

export class AIGateway {
  static async generate(
    promptId: string,
    variables: Record<string, any> = {},
    config?: Partial<AIProviderConfig>
  ): Promise<AIResponse<string>> {
    const providerStr = config?.provider || AI_CONFIG.defaultProvider;
    const modelStr = config?.modelId || AI_CONFIG.defaultModel;
    const model = getProviderModel(providerStr, modelStr);
    
    const prompt = promptEngine.build(promptId, variables);

    return RetryStrategy.execute(async () => {
      const { text, usage } = await generateText({
        model,
        prompt,
        temperature: config?.temperature,
        topP: config?.topP,
      });

      const anyUsage = usage as any;
      const tokenUsage = {
        promptTokens: anyUsage.promptTokens || 0,
        completionTokens: anyUsage.completionTokens || 0,
        totalTokens: anyUsage.totalTokens || 0,
      };

      UsageTracker.track(providerStr, modelStr, tokenUsage);

      return {
        content: text,
        usage: tokenUsage,
        provider: providerStr,
        model: modelStr,
      };
    });
  }

  static async generateStream(
    promptId: string,
    variables: Record<string, any> = {},
    config?: Partial<AIProviderConfig>
  ) {
    const providerStr = config?.provider || AI_CONFIG.defaultProvider;
    const modelStr = config?.modelId || AI_CONFIG.defaultModel;
    const model = getProviderModel(providerStr, modelStr);
    
    const prompt = promptEngine.build(promptId, variables);

    const result = await streamText({
      model,
      prompt,
      temperature: config?.temperature,
      topP: config?.topP,
      onFinish: (event) => {
        const anyUsage = event.usage as any;
        const tokenUsage = {
          promptTokens: anyUsage.promptTokens || 0,
          completionTokens: anyUsage.completionTokens || 0,
          totalTokens: anyUsage.totalTokens || 0,
        };
        UsageTracker.track(providerStr, modelStr, tokenUsage);
      },
    });

    return result.toTextStreamResponse();
  }

  static async generateDirect(
    prompt: string,
    config?: Partial<AIProviderConfig>
  ): Promise<AIResponse<string>> {
    const providerStr = config?.provider || AI_CONFIG.defaultProvider;
    const modelStr = config?.modelId || AI_CONFIG.defaultModel;
    const model = getProviderModel(providerStr, modelStr);

    return RetryStrategy.execute(async () => {
      const { text, usage } = await generateText({
        model,
        prompt,
        temperature: config?.temperature,
        topP: config?.topP,
      });

      const anyUsage = usage as any;
      const tokenUsage = {
        promptTokens: anyUsage.promptTokens || 0,
        completionTokens: anyUsage.completionTokens || 0,
        totalTokens: anyUsage.totalTokens || 0,
      };

      UsageTracker.track(providerStr, modelStr, tokenUsage);

      return {
        content: text,
        usage: tokenUsage,
        provider: providerStr,
        model: modelStr,
      };
    });
  }
}
