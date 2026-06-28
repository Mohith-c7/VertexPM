import { z } from 'zod';
import { IntelligenceError } from './intelligence.errors';

export class IntelligenceValidator {
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new IntelligenceError(`Validation failed: ${result.error.message}`, 'VALIDATION_FAILED');
    }
    return result.data;
  }
}
