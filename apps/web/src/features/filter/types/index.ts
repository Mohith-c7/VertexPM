export type LogicalOperator = 'AND' | 'OR';

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'in'
  | 'notIn'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'notContains'
  | 'isNull'
  | 'isNotNull';

export type FilterFieldType = 'string' | 'number' | 'date' | 'boolean' | 'array';

export interface FilterField {
  id: string;
  label: string;
  type: FilterFieldType;
  options?: { label: string; value: string | number }[]; // For select/multiselect
}

export interface FilterRule {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface FilterGroupType {
  id: string;
  logicalOperator: LogicalOperator;
  rules: (FilterRule | FilterGroupType)[];
}

export interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  filter: FilterGroupType;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FilterQueryDto {
  filter: FilterGroupType;
  sort?: { field: string; direction: 'asc' | 'desc' }[];
  pagination?: { page: number; limit: number };
}
