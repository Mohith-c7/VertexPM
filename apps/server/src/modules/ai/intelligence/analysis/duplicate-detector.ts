import { DuplicateDetectionSchema } from '@vertexpm/validation';
import { intelligenceExecutor } from '../intelligence.executor';

export class DuplicateDetector {
  async detect(context: any) {
    return intelligenceExecutor.execute('Detect duplicates', DuplicateDetectionSchema, context);
  }
}
