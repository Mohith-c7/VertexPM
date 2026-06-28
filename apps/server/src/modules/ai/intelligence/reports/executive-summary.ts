import { ExecutiveSummarySchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class ExecutiveSummaryReport {
  async generate(context: any) {
    return intelligenceExecutor.execute('Generate executive summary', ExecutiveSummarySchema, context);
  }
}
