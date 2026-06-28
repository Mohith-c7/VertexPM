import { ZodError } from "zod";
import { automationLogger } from "../logger/index.js";

export class RetryPolicy {
  calculateBackoff(retryCount: number): number {
    // 0 -> 1s, 1 -> 2s, 2 -> 4s
    return Math.pow(2, retryCount) * 1000;
  }

  shouldRetry(error: any): boolean {
    if (error instanceof ZodError) {
      return false;
    }
    if (error.name === "ZodError" || error.name === "AutomationValidationError") {
      return false;
    }
    if (error.code === "AUTOMATION_VALIDATION_ERROR" || error.statusCode === 400) {
      return false;
    }
    return true;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    onRetry: (error: any, nextDelayMs: number, currentAttempt: number) => void,
    maxRetries = 3
  ): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt > maxRetries || !this.shouldRetry(error)) {
          throw error;
        }

        const delay = this.calculateBackoff(attempt - 1);
        onRetry(error, delay, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}

export const retryPolicy = new RetryPolicy();
