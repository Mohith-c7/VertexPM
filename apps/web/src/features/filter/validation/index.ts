import { z } from 'zod';

const logicalOperatorSchema = z.enum(['AND', 'OR']);
const filterOperatorSchema = z.enum([
  'eq', 'neq', 'in', 'notIn', 'gt', 'gte', 'lt', 'lte', 'contains', 'notContains', 'isNull', 'isNotNull'
]);

// Base rule schema
const baseRuleSchema = z.object({
  id: z.string().min(1),
  field: z.string().min(1),
  operator: filterOperatorSchema,
  value: z.any(),
});

// Recursive group schema
export type FilterGroupZodType = {
  id: string;
  logicalOperator: 'AND' | 'OR';
  rules: (z.infer<typeof baseRuleSchema> | FilterGroupZodType)[];
};

export const filterGroupSchema: z.ZodType<FilterGroupZodType> = z.lazy(() => 
  z.object({
    id: z.string().min(1),
    logicalOperator: logicalOperatorSchema,
    rules: z.array(z.union([baseRuleSchema, filterGroupSchema])).min(1, 'Group must have at least one rule'),
  })
);

export const validateFilterGroup = (data: unknown) => {
  return filterGroupSchema.safeParse(data);
};

export const savedFilterDtoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  description: z.string().max(200).optional(),
  filter: filterGroupSchema,
  isDefault: z.boolean().optional(),
});
