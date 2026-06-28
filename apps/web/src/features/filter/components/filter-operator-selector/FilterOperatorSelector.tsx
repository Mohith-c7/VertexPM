import React from 'react';
import { AVAILABLE_FIELDS, GET_OPERATORS_FOR_TYPE, OPERATOR_LABELS } from '../../constants';
import { FilterOperator } from '../../types';

interface FilterOperatorSelectorProps {
  fieldId: string;
  value: FilterOperator;
  onChange: (value: FilterOperator) => void;
}

export const FilterOperatorSelector: React.FC<FilterOperatorSelectorProps> = ({ fieldId, value, onChange }) => {
  const field = AVAILABLE_FIELDS.find(f => f.id === fieldId);
  const operators = field ? GET_OPERATORS_FOR_TYPE(field.type) : [];

  // If current value is not in operators, default to first available
  React.useEffect(() => {
    if (operators.length > 0 && !operators.includes(value)) {
      onChange(operators[0]);
    }
  }, [fieldId, operators, value, onChange]);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FilterOperator)}
      className="h-8 px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none min-w-[120px]"
    >
      {operators.map((op) => (
        <option key={op} value={op}>
          {OPERATOR_LABELS[op]}
        </option>
      ))}
    </select>
  );
};
