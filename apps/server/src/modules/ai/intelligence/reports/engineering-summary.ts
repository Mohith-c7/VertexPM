import { EngineeringSummarySchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class EngineeringSummaryReport {
  async generate(context: any) {
    return intelligenceExecutor.execute('Generate engineering summary', EngineeringSummarySchema, context);
  }
}
