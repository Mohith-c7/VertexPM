import React from 'react';
import { SavedFilter } from '../../types';
import { Bookmark, Clock, Trash2, CheckCircle2 } from 'lucide-react';

interface SavedFilterListProps {
  filters: SavedFilter[];
  activeFilterId?: string;
  onSelect: (filter: SavedFilter) => void;
  onDelete?: (id: string) => void;
}

export const SavedFilterList: React.FC<SavedFilterListProps> = ({ filters, activeFilterId, onSelect, onDelete }) => {
  if (!filters || filters.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No saved filters yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {filters.map(filter => (
        <div 
          key={filter.id}
          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
            activeFilterId === filter.id 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
          onClick={() => onSelect(filter)}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 ${activeFilterId === filter.id ? 'text-blue-500' : 'text-slate-400'}`}>
              {activeFilterId === filter.id ? <CheckCircle2 size={18} /> : <Bookmark size={18} />}
            </div>
            <div>
              <h4 className={`text-sm font-semibold ${activeFilterId === filter.id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                {filter.name}
              </h4>
              {filter.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{filter.description}</p>
              )}
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1.5 font-medium uppercase tracking-wider">
                <Clock size={10} />
                <span>Updated {new Date(filter.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(filter.id);
              }}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
