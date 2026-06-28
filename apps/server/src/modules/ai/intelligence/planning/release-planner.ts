import { ReleasePlanSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class ReleasePlanner {
  async plan(context: any) {
    return intelligenceExecutor.execute('Plan release', ReleasePlanSchema, context);
  }
}
