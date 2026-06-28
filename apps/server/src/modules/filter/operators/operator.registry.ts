import { IOperatorHandler } from '../types/filter.types.js';

export class OperatorRegistry {
  private static handlers: Map<string, IOperatorHandler> = new Map();

  static register(operator: string, handler: IOperatorHandler) {
    this.handlers.set(operator, handler);
  }

  static getHandler(operator: string): IOperatorHandler {
    const handler = this.handlers.get(operator);
    if (!handler) {
      throw new Error(`Unsupported filter operator: ${operator}`);
    }
    return handler;
  }
}
