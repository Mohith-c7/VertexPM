import { SprintPlanSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class SprintPlanner {
  async plan(context: any) {
    return intelligenceExecutor.execute('Plan sprint', SprintPlanSchema, context);
  }
}
