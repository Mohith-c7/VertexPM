import React from 'react';
import { FilterGroupType, LogicalOperator } from '../../types';
import { isFilterGroup } from '../../utils';
import { FilterRow } from '../filter-row/FilterRow';
import { Plus, FolderPlus, Trash2 } from 'lucide-react';

interface FilterGroupProps {
  group: FilterGroupType;
  isRoot?: boolean;
  onUpdateLogicalOperator: (id: string, op: LogicalOperator) => void;
  onAddRule: (groupId: string) => void;
  onAddGroup: (groupId: string) => void;
  onRemove: (id: string) => void;
  onUpdateRule: (ruleId: string, updates: any) => void;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  group,
  isRoot = false,
  onUpdateLogicalOperator,
  onAddRule,
  onAddGroup,
  onRemove,
  onUpdateRule,
}) => {
  return (
    <div className={`flex flex-col gap-3 p-4 rounded-xl border ${isRoot ? 'border-transparent bg-transparent p-0' : 'border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 shadow-sm backdrop-blur-sm'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
            {(['AND', 'OR'] as LogicalOperator[]).map((op) => (
              <button
                key={op}
                onClick={() => onUpdateLogicalOperator(group.id, op)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  group.logicalOperator === op
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
          {!isRoot && (
            <span className="text-xs font-medium text-slate-400">
              Group logic
            </span>
          )}
        </div>
        {!isRoot && (
          <button
            onClick={() => onRemove(group.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
            title="Remove Group"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className={`flex flex-col gap-2 ${isRoot ? '' : 'pl-4 border-l-2 border-slate-100 dark:border-slate-800'}`}>
        {group.rules.map((ruleOrGroup) => (
          <div key={ruleOrGroup.id}>
            {isFilterGroup(ruleOrGroup) ? (
              <FilterGroup
                group={ruleOrGroup}
                onUpdateLogicalOperator={onUpdateLogicalOperator}
                onAddRule={onAddRule}
                onAddGroup={onAddGroup}
                onRemove={onRemove}
                onUpdateRule={onUpdateRule}
              />
            ) : (
              <FilterRow
                rule={ruleOrGroup}
                onUpdate={(updates) => onUpdateRule(ruleOrGroup.id, updates)}
                onRemove={() => onRemove(ruleOrGroup.id)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onAddRule(group.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
        >
          <Plus size={16} />
          Add Rule
        </button>
        <button
          onClick={() => onAddGroup(group.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
        >
          <FolderPlus size={16} />
          Add Group
        </button>
      </div>
    </div>
  );
};
