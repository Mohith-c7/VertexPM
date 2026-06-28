import React from 'react';
import { SavedFilter } from '../../types';
import { LayoutGrid, MoreHorizontal, Settings } from 'lucide-react';

interface SavedViewCardProps {
  view: SavedFilter;
  isActive: boolean;
  onClick: (view: SavedFilter) => void;
}

export const SavedViewCard: React.FC<SavedViewCardProps> = ({ view, isActive, onClick }) => {
  return (
    <div
      onClick={() => onClick(view)}
      className={`relative group p-4 rounded-xl border transition-all cursor-pointer ${
        isActive
          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm ring-1 ring-blue-500/50'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
          <LayoutGrid size={18} />
        </div>
        <button 
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity rounded"
          onClick={(e) => {
            e.stopPropagation();
            // action
          }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      <h3 className={`font-semibold mb-1 truncate ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-slate-800 dark:text-slate-200'}`}>
        {view.name}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
        {view.description || 'No description provided for this view.'}
      </p>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          {view.filter.rules.length} Rules
        </div>
        {view.isDefault && (
          <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
            DEFAULT
          </span>
        )}
      </div>
    </div>
  );
};
