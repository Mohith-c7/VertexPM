// Let's reuse workflow optimization schema or a specific bottleneck one. Using workflow optimization for now.
import { WorkflowOptimizationSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class BottleneckAnalyzer {
  async analyze(context: any) {
    return intelligenceExecutor.execute('Analyze bottlenecks', WorkflowOptimizationSchema, context);
  }
}
