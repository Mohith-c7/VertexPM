import { FilterGroupType, FilterRule } from '../types';

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const createEmptyRule = (fieldId: string = 'status'): FilterRule => {
  return {
    id: generateId(),
    field: fieldId,
    operator: 'eq',
    value: '',
  };
};

export const createEmptyGroup = (): FilterGroupType => {
  return {
    id: generateId(),
    logicalOperator: 'AND',
    rules: [createEmptyRule()],
  };
};

export const isFilterGroup = (node: FilterRule | FilterGroupType): node is FilterGroupType => {
  return (node as FilterGroupType).logicalOperator !== undefined;
};

export const serializeFilter = (group: FilterGroupType): any => {
  return {
    logicalOperator: group.logicalOperator,
    rules: group.rules.map(rule => {
      if (isFilterGroup(rule)) {
        return serializeFilter(rule);
      }
      return {
        field: rule.field,
        operator: rule.operator,
        value: rule.value,
      };
    }),
  };
};
