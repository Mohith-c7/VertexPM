import { z } from 'zod';

export const FilterOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'greater_than',
  'less_than',
  'greater_than_or_equals',
  'less_than_or_equals',
  'in',
  'not_in',
  'is_null',
  'is_not_null',
  'between',
  'not_between',
]);

export const FilterConditionSchema = z.object({
  field: z.string().min(1),
  operator: FilterOperatorSchema,
  value: z.any().optional(),
});

export const FilterGroupSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    logicalOperator: z.enum(['AND', 'OR']),
    conditions: z.array(z.union([FilterConditionSchema, FilterGroupSchema])).min(1),
  })
);

export const SortDirectionSchema = z.enum(['asc', 'desc']);

export const SortConditionSchema = z.object({
  field: z.string().min(1),
  direction: SortDirectionSchema,
});

export const FilterQuerySchema = z.object({
  filter: FilterGroupSchema.optional(),
  sort: z.array(SortConditionSchema).optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
});

export const SavedFilterSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  query: FilterQuerySchema,
  isPublic: z.boolean().default(false),
  entityType: z.string().min(1), // e.g., 'WorkItem', 'Project'
});

export const CreateSavedFilterDtoSchema = SavedFilterSchema;

export const UpdateSavedFilterDtoSchema = SavedFilterSchema.partial();

export type FilterOperator = z.infer<typeof FilterOperatorSchema>;
export type FilterCondition = z.infer<typeof FilterConditionSchema>;
export type FilterGroup = {
  logicalOperator: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];
};
export type SortDirection = z.infer<typeof SortDirectionSchema>;
export type SortCondition = z.infer<typeof SortConditionSchema>;
export type FilterQuery = {
  filter?: FilterGroup;
  sort?: SortCondition[];
  page?: number;
  pageSize?: number;
};
export type SavedFilter = z.infer<typeof SavedFilterSchema>;
export type CreateSavedFilterDto = z.infer<typeof CreateSavedFilterDtoSchema>;
export type UpdateSavedFilterDto = z.infer<typeof UpdateSavedFilterDtoSchema>;
