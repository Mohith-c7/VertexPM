export class AIUtils {
  static formatDuration(ms: number): string {
    return `${(ms / 1000).toFixed(2)}s`;
  }

  static estimateTokens(text: string): number {
    // Rough estimation: 1 token ~= 4 chars
    return Math.ceil(text.length / 4);
  }
}
