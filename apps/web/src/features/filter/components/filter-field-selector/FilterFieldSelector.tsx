import React from 'react';
import { AVAILABLE_FIELDS } from '../../constants';

interface FilterFieldSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterFieldSelector: React.FC<FilterFieldSelectorProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
    >
      {AVAILABLE_FIELDS.map((field) => (
        <option key={field.id} value={field.id}>
          {field.label}
        </option>
      ))}
    </select>
  );
};
