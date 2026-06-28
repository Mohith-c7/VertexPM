import React from 'react';
import { FilterRule, FilterOperator } from '../../types';
import { FilterFieldSelector } from '../filter-field-selector/FilterFieldSelector';
import { FilterOperatorSelector } from '../filter-operator-selector/FilterOperatorSelector';
import { FilterValueInput } from '../filter-value-input/FilterValueInput';
import { X } from 'lucide-react';

interface FilterRowProps {
  rule: FilterRule;
  onUpdate: (updates: Partial<FilterRule>) => void;
  onRemove: () => void;
}

export const FilterRow: React.FC<FilterRowProps> = ({ rule, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center gap-2 group p-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md transition-colors">
      <FilterFieldSelector
        value={rule.field}
        onChange={(field) => onUpdate({ field, value: '' })} // Reset value on field change
      />
      <FilterOperatorSelector
        fieldId={rule.field}
        value={rule.operator}
        onChange={(operator) => onUpdate({ operator })}
      />
      <FilterValueInput
        fieldId={rule.field}
        operator={rule.operator}
        value={rule.value}
        onChange={(value) => onUpdate({ value })}
      />
      <button
        onClick={onRemove}
        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
        aria-label="Remove rule"
      >
        <X size={16} />
      </button>
    </div>
  );
};
