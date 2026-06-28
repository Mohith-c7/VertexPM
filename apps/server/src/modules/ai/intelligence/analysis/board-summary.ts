import { BoardSummarySchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class BoardSummaryAnalyzer {
  async analyze(context: any) {
    return intelligenceExecutor.execute('Summarize board', BoardSummarySchema, context);
  }
}
