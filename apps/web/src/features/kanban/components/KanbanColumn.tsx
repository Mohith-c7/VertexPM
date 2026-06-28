import React from 'react';
import { Column, WorkItem } from '../../boards/types';
import { WorkItemCard } from './WorkItemCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  items: WorkItem[];
  onOpenWorkItem: (id: string) => void;
  isLoading?: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, items, onOpenWorkItem, isLoading }) => {
  return (
    <div className="flex flex-col w-[320px] min-w-[320px] bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl h-full backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between p-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {column.name}
          </h3>
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
            {items.length}
          </span>
        </div>
        <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 kanban-column-scroll">
        {isLoading ? (
          // Skeleton loader
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 animate-pulse h-28" />
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-sm">
            No items
          </div>
        ) : (
          items.map((item) => (
            <WorkItemCard key={item.id} item={item} onClick={onOpenWorkItem} />
          ))
        )}
      </div>
    </div>
  );
};
