import { DependencyAnalysisSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class DependencyAnalyzer {
  async analyze(context: any) {
    return intelligenceExecutor.execute('Analyze dependencies', DependencyAnalysisSchema, context);
  }
}
