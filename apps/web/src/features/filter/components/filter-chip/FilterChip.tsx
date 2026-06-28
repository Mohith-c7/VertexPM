import React from 'react';
import { FilterRule } from '../../types';
import { AVAILABLE_FIELDS, OPERATOR_LABELS } from '../../constants';
import { X } from 'lucide-react';

interface FilterChipProps {
  rule: FilterRule;
  onRemove: (id: string) => void;
  onClick?: (id: string) => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ rule, onRemove, onClick }) => {
  const field = AVAILABLE_FIELDS.find(f => f.id === rule.field);
  const fieldLabel = field?.label || rule.field;
  const operatorLabel = OPERATOR_LABELS[rule.operator] || rule.operator;
  
  let displayValue = String(rule.value);
  if (field?.type === 'array' && Array.isArray(rule.value)) {
    displayValue = rule.value.map(v => field.options?.find(o => o.value === v)?.label || v).join(', ');
  } else if (field?.type === 'array' && field.options) {
    displayValue = field.options.find(o => o.value === rule.value)?.label || displayValue;
  }

  if (rule.operator === 'isNull' || rule.operator === 'isNotNull') {
    displayValue = '';
  }

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full text-sm group cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
      onClick={() => onClick && onClick(rule.id)}
    >
      <span className="font-medium text-slate-700 dark:text-slate-300">{fieldLabel}</span>
      <span className="text-slate-400 dark:text-slate-500 text-xs">{operatorLabel}</span>
      {displayValue && (
        <span className="font-semibold text-blue-600 dark:text-blue-400 max-w-[150px] truncate">
          {displayValue}
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(rule.id);
        }}
        className="ml-1 p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};
