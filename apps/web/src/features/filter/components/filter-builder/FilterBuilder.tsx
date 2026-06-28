import React from 'react';
import { FilterGroupType } from '../../types';
import { FilterGroup } from '../filter-group/FilterGroup';
import { useFilter } from '../../hooks/use-filter';

interface FilterBuilderProps {
  initialFilter?: FilterGroupType;
  onChange?: (filter: FilterGroupType) => void;
}

export const FilterBuilder: React.FC<FilterBuilderProps> = ({ initialFilter, onChange }) => {
  const {
    filterState,
    updateLogicalOperator,
    addRule,
    addGroup,
    removeRuleOrGroup,
    updateRule,
  } = useFilter(initialFilter);

  // Sync to parent if needed
  React.useEffect(() => {
    if (onChange) {
      onChange(filterState);
    }
  }, [filterState, onChange]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-4 w-full max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Filter Builder</h3>
        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-md">
          {filterState.rules.length} Items
        </span>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <FilterGroup
          group={filterState}
          isRoot={true}
          onUpdateLogicalOperator={updateLogicalOperator}
          onAddRule={addRule}
          onAddGroup={addGroup}
          onRemove={removeRuleOrGroup}
          onUpdateRule={updateRule}
        />
      </div>
    </div>
  );
};
