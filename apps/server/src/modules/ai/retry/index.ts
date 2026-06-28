import { RetryOptions } from '../types';
import { AI_CONFIG } from '../config';

export class RetryStrategy {
  static async execute<T>(
    operation: () => Promise<T>,
    options: RetryOptions = AI_CONFIG.retry
  ): Promise<T> {
    let attempt = 0;
    while (attempt < options.maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        attempt++;
        if (attempt >= options.maxRetries) {
          throw new Error(`Operation failed after ${attempt} retries: ${error.message}`);
        }
        
        // Exponential backoff
        const delay = Math.min(
          options.baseDelayMs * Math.pow(2, attempt - 1),
          options.maxDelayMs
        );
        
        // Add jitter
        const jitterDelay = delay + Math.random() * 200;
        
        await new Promise((resolve) => setTimeout(resolve, jitterDelay));
      }
    }
    throw new Error('Unexpected retry failure');
  }
}
