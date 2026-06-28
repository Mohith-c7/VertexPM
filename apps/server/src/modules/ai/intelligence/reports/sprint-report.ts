import { SprintReportSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class SprintReportGenerator {
  async generate(context: any) {
    return intelligenceExecutor.execute('Generate sprint report', SprintReportSchema, context);
  }
}
