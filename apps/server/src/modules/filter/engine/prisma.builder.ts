import { FilterGroup, FilterCondition } from '@vertexpm/validation';
import { OperatorRegistry } from '../operators/index.js';

export class PrismaQueryBuilder {
  static buildWhereClause(filter?: FilterGroup | FilterCondition): Record<string, any> {
    if (!filter) return {};

    if ('logicalOperator' in filter) {
      // It's a FilterGroup
      const group = filter as FilterGroup;
      if (!group.conditions || group.conditions.length === 0) {
        return {};
      }

      const conditions = group.conditions.map(c => this.buildWhereClause(c));
      
      if (group.logicalOperator === 'AND') {
        return { AND: conditions };
      } else if (group.logicalOperator === 'OR') {
        return { OR: conditions };
      }
    } else {
      // It's a FilterCondition
      const condition = filter as FilterCondition;
      const handler = OperatorRegistry.getHandler(condition.operator);
      return handler.build(condition.field, condition.value);
    }

    return {};
  }
}
