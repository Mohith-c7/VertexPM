import { BacklogAnalysisSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class BacklogAnalyzer {
  async analyze(context: any) {
    return intelligenceExecutor.execute('Analyze backlog', BacklogAnalysisSchema, context);
  }
}
