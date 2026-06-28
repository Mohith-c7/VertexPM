import { SortCondition } from '@vertexpm/validation';

export class SortEngine {
  static buildOrderByClause(sort?: SortCondition[]): Record<string, 'asc' | 'desc'>[] {
    if (!sort || sort.length === 0) return [];
    
    return sort.map(s => ({
      [s.field]: s.direction
    }));
  }
}
