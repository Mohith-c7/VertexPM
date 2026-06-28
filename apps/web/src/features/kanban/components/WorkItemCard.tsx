import React from 'react';
import { MoreHorizontal, AlertCircle, CheckCircle2, Circle, Clock, CheckSquare, MessageSquare, AlertTriangle, ArrowUpCircle, ArrowDownCircle, AlertOctagon } from 'lucide-react';
import { WorkItem, WorkItemPriority, WorkItemType } from '../../boards/types';

interface WorkItemCardProps {
  item: WorkItem;
  onClick: (id: string) => void;
}

const getTypeIcon = (type: WorkItemType) => {
  switch (type) {
    case 'epic':
      return <AlertOctagon className="w-4 h-4 text-purple-500" />;
    case 'story':
      return <CheckSquare className="w-4 h-4 text-green-500" />;
    case 'task':
      return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    case 'bug':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Circle className="w-4 h-4 text-gray-400" />;
  }
};

const getPriorityIcon = (priority: WorkItemPriority) => {
  switch (priority) {
    case 'urgent':
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'high':
      return <ArrowUpCircle className="w-4 h-4 text-orange-500" />;
    case 'medium':
      return <ArrowUpCircle className="w-4 h-4 text-yellow-500 transform rotate-45" />;
    case 'low':
      return <ArrowDownCircle className="w-4 h-4 text-blue-400" />;
    default:
      return null;
  }
};

export const WorkItemCard: React.FC<WorkItemCardProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={() => onClick(item.id)}
      className="group relative flex flex-col gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
          {item.title}
        </span>
        <button
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-opacity"
          aria-label="Card actions"
          onClick={(e) => {
            e.stopPropagation();
            // Optional: dropdown menu action
          }}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {item.labels && item.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {item.labels.map((label) => (
            <span
              key={label.id}
              className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              style={{ borderColor: label.color ? `${label.color}40` : undefined, color: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {getTypeIcon(item.type)}
          {getPriorityIcon(item.priority)}
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {item.id.substring(0, 8)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {item.assignee ? (
            <div 
              className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-xs font-semibold text-indigo-700 dark:text-indigo-300 overflow-hidden ring-2 ring-white dark:ring-slate-900"
              title={item.assignee.name}
            >
              {item.assignee.avatarUrl ? (
                <img src={item.assignee.avatarUrl} alt={item.assignee.name} className="w-full h-full object-cover" />
              ) : (
                item.assignee.name.charAt(0).toUpperCase()
              )}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-500 transition-colors bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[10px] font-bold">+</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
