export class IntelligenceRegistry {
  private analyzers = new Map<string, any>();
  
  registerAnalyzer(name: string, analyzer: any) {
    this.analyzers.set(name, analyzer);
  }

  getAnalyzer(name: string) {
    return this.analyzers.get(name);
  }
}
export const intelligenceRegistry = new IntelligenceRegistry();
