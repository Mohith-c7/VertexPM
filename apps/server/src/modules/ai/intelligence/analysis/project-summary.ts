import { ProjectSummarySchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class ProjectSummaryAnalyzer {
  async analyze(context: any) {
    return intelligenceExecutor.execute('Summarize project', ProjectSummarySchema, context);
  }
}
