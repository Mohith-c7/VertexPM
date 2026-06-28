import { AssigneeRecommendationSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class AssigneeRecommender {
  async recommend(context: any) {
    return intelligenceExecutor.execute('Recommend assignee', AssigneeRecommendationSchema, context);
  }
}
