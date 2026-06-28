export class StreamingUtils {
  static async *transformStream(stream: AsyncIterable<any>) {
    for await (const chunk of stream) {
      if (chunk.type === 'text-delta') {
        yield chunk.textDelta;
      }
      // Note: Full standard streaming logic could be expanded here.
    }
  }
}
