import { WorkflowOptimizationSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class WorkflowOptimizer {
  async optimize(context: any) {
    return intelligenceExecutor.execute('Optimize workflow', WorkflowOptimizationSchema, context);
  }
}
