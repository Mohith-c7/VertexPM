import { FilterQuery, FilterGroup, FilterCondition, SortCondition } from '@vertexpm/validation';

export interface IFilterEngine {
  buildWhereClause(filter?: FilterGroup): Record<string, any>;
  buildOrderByClause(sort?: SortCondition[]): Record<string, 'asc' | 'desc'>[];
}

export interface IOperatorHandler {
  build(field: string, value: any): Record<string, any>;
}
