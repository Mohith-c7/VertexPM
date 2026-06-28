import { DeadlinePredictionSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class DeadlinePredictor {
  async predict(context: any) {
    return intelligenceExecutor.execute('Predict deadline', DeadlinePredictionSchema, context);
  }
}
