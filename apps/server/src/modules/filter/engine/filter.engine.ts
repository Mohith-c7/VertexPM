import { FilterQuery, SortCondition } from '@vertexpm/validation';
import { PrismaQueryBuilder } from './prisma.builder.js';
import { SortEngine } from '../sorting/sort.engine.js';
import { PaginationEngine } from '../pagination/pagination.engine.js';

export class FilterEngine {
  static buildQuery(query: FilterQuery) {
    const where = PrismaQueryBuilder.buildWhereClause(query.filter);
    const orderBy = SortEngine.buildOrderByClause(query.sort);
    const pagination = PaginationEngine.buildPagination(query.page, query.pageSize);

    return {
      where,
      orderBy,
      ...pagination
    };
  }
}
