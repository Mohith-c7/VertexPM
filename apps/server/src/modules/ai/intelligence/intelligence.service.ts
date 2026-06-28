import { intelligenceRegistry } from './intelligence.registry';

export class IntelligenceService {
  async runAnalysis(analyzerName: string, context: any) {
    const analyzer = intelligenceRegistry.getAnalyzer(analyzerName);
    if (!analyzer) throw new Error(`Analyzer ${analyzerName} not found`);
    return analyzer.analyze(context);
  }
}
export const intelligenceService = new IntelligenceService();
