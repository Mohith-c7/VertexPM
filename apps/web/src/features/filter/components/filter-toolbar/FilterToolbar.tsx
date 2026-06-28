import React from 'react';
import { Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface FilterToolbarProps {
  onToggleFilterBuilder: () => void;
  isFilterBuilderOpen: boolean;
  activeFilterCount: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  onToggleFilterBuilder,
  isFilterBuilderOpen,
  activeFilterCount,
  sortField,
  sortDirection,
  onSortChange,
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFilterBuilder}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            isFilterBuilderOpen || activeFilterCount > 0
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          } border border-slate-200 dark:border-slate-700`}
        >
          <Filter size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 ml-1 text-xs text-white bg-blue-600 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-slate-400" />
          <select
            value={sortField || ''}
            onChange={(e) => onSortChange(e.target.value, sortDirection || 'desc')}
            className="h-8 pl-2 pr-6 py-1 bg-transparent border-none text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0 appearance-none font-medium cursor-pointer"
          >
            <option value="">Sort by...</option>
            <option value="createdAt">Created Date</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
          {sortField && (
            <button
              onClick={() => onSortChange(sortField, sortDirection === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded transition-colors text-xs font-bold uppercase"
            >
              {sortDirection}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 font-medium">
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="p-1.5 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="p-1.5 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
