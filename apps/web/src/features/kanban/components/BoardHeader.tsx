import React from 'react';
import { Star, MoreHorizontal, Link2 } from 'lucide-react';
import { Board } from '../../boards/types';

interface BoardHeaderProps {
  board?: Board;
  projectName?: string;
  isLoading?: boolean;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ board, projectName = 'Project', isLoading }) => {
  if (isLoading || !board) {
    return (
      <div className="flex items-center justify-between h-14 px-6 border-b border-slate-200 dark:border-slate-800 animate-pulse bg-white dark:bg-slate-950">
        <div className="flex items-center gap-4">
          <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="w-48 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="flex items-center gap-4">
        {/* Breadcrumb pseudo-component */}
        <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">{projectName}</span>
          <span className="mx-2 text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {board.name}
            <button className="text-slate-400 hover:text-yellow-500 transition-colors">
              <Star className="w-4 h-4" />
            </button>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {/* Mock avatars */}
          {['A', 'B', 'C'].map((initial, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-semibold text-indigo-700 dark:text-indigo-300 z-10">
              {initial}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400 z-0">
            +5
          </div>
        </div>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors">
          <Link2 className="w-4 h-4" />
          Share
        </button>
        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
