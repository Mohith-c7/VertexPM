import { RiskAnalysisSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class RiskAnalyzer {
  async analyze(context: any) {
    return intelligenceExecutor.execute('Analyze risks', RiskAnalysisSchema, context);
  }
}
