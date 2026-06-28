import { PriorityRecommendationSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class PriorityRecommender {
  async recommend(context: any) {
    return intelligenceExecutor.execute('Recommend priority', PriorityRecommendationSchema, context);
  }
}
