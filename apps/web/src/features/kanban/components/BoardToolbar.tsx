import React from 'react';
import { Search, Filter, Plus, ListFilter, SlidersHorizontal } from 'lucide-react';

export const BoardToolbar: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search work items..."
            className="pl-9 pr-4 py-1.5 w-[240px] md:w-[320px] text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
          />
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <Filter className="w-4 h-4" />
          Filters
        </button>
        
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <ListFilter className="w-4 h-4" />
          Group By
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <SlidersHorizontal className="w-4 h-4" />
          Display
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950">
          <Plus className="w-4 h-4" />
          New Issue
        </button>
      </div>
    </div>
  );
};
