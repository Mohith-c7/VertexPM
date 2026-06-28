import React from 'react';
import { AVAILABLE_FIELDS } from '../../constants';

interface FilterValueInputProps {
  fieldId: string;
  operator: string;
  value: any;
  onChange: (value: any) => void;
}

export const FilterValueInput: React.FC<FilterValueInputProps> = ({ fieldId, operator, value, onChange }) => {
  const field = AVAILABLE_FIELDS.find(f => f.id === fieldId);

  if (operator === 'isNull' || operator === 'isNotNull') {
    return null;
  }

  const baseClassName = "h-8 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400";

  if (!field) {
    return <input type="text" className={baseClassName} value={value || ''} onChange={e => onChange(e.target.value)} />;
  }

  if (field.type === 'array' && field.options) {
    // For 'in' and 'notIn', we'd ideally have a multi-select, but we can do a simple select for now or a comma-separated fallback.
    // For simplicity, building a native multi-select or single select based on operator
    if (operator === 'in' || operator === 'notIn') {
      return (
        <div className="flex gap-1 flex-wrap items-center">
          <select
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                const current = Array.isArray(value) ? value : [];
                if (!current.includes(val)) {
                  onChange([...current, val]);
                }
              }
            }}
            className={baseClassName}
          >
            <option value="">Select option...</option>
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {Array.isArray(value) && value.map(v => (
            <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              {field.options?.find(o => o.value === v)?.label || v}
              <button
                type="button"
                onClick={() => onChange(value.filter((i: any) => i !== v))}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      );
    }

    return (
      <select value={value || ''} onChange={e => onChange(e.target.value)} className={baseClassName}>
        <option value="">Select...</option>
        {field.options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'date') {
    return (
      <input
        type="date"
        className={baseClassName}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <input
        type="number"
        className={baseClassName}
        value={value || ''}
        onChange={e => onChange(Number(e.target.value))}
      />
    );
  }

  if (field.type === 'boolean') {
    return (
      <select value={value !== undefined ? String(value) : ''} onChange={e => onChange(e.target.value === 'true')} className={baseClassName}>
        <option value="">Select...</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  return (
    <input
      type="text"
      placeholder="Type a value..."
      className={baseClassName}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  );
};
