import { FilterField, FilterOperator } from '../types';

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  eq: 'is',
  neq: 'is not',
  in: 'is any of',
  notIn: 'is none of',
  gt: 'is greater than',
  gte: 'is greater than or equal to',
  lt: 'is less than',
  lte: 'is less than or equal to',
  contains: 'contains',
  notContains: 'does not contain',
  isNull: 'is empty',
  isNotNull: 'is not empty',
};

export const AVAILABLE_FIELDS: FilterField[] = [
  { id: 'status', label: 'Status', type: 'array', options: [
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Done', value: 'DONE' },
  ]},
  { id: 'priority', label: 'Priority', type: 'array', options: [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Urgent', value: 'URGENT' },
  ]},
  { id: 'assignee', label: 'Assignee', type: 'array', options: [
    { label: 'Unassigned', value: 'UNASSIGNED' },
    // more dynamically fetched options would be here
  ]},
  { id: 'dueDate', label: 'Due Date', type: 'date' },
  { id: 'createdAt', label: 'Created At', type: 'date' },
  { id: 'title', label: 'Title', type: 'string' },
  { id: 'description', label: 'Description', type: 'string' },
];

export const GET_OPERATORS_FOR_TYPE = (type: string): FilterOperator[] => {
  switch (type) {
    case 'string':
      return ['eq', 'neq', 'contains', 'notContains', 'isNull', 'isNotNull'];
    case 'number':
    case 'date':
      return ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'isNull', 'isNotNull'];
    case 'array':
      return ['in', 'notIn', 'isNull', 'isNotNull'];
    case 'boolean':
      return ['eq', 'neq'];
    default:
      return ['eq', 'neq'];
  }
};
