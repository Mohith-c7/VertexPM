export class IntelligenceLogger {
  log(action: string, metadata: any) {
    console.log(`[INTELLIGENCE] ${action}`, JSON.stringify(metadata));
  }
  error(action: string, error: any) {
    console.error(`[INTELLIGENCE_ERROR] ${action}`, error);
  }
}
export const intelligenceLogger = new IntelligenceLogger();
