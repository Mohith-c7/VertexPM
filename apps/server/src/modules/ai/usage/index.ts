import { TokenUsage } from '../types';

export class UsageTracker {
  static track(provider: string, model: string, usage: TokenUsage) {
    // In a real application, this would save to a database or send to a metrics service
    console.log(`[AI Usage] ${provider} / ${model}:`, usage);
  }
}
