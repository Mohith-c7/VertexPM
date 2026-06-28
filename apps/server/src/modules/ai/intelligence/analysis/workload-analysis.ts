import { WorkloadAnalysisSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class WorkloadAnalyzer {
  async analyze(context: any) {
    return intelligenceExecutor.execute('Analyze workload', WorkloadAnalysisSchema, context);
  }
}
