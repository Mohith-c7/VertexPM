import { useState, useCallback } from 'react';
import { FilterGroupType, FilterRule, LogicalOperator } from '../types';
import { createEmptyGroup, createEmptyRule, generateId, isFilterGroup } from '../utils';

export const useFilter = (initialState?: FilterGroupType) => {
  const [filterState, setFilterState] = useState<FilterGroupType>(
    initialState || createEmptyGroup()
  );

  const updateNode = useCallback((
    currentGroup: FilterGroupType,
    targetId: string,
    updater: (node: FilterRule | FilterGroupType) => FilterRule | FilterGroupType | null
  ): FilterGroupType => {
    if (currentGroup.id === targetId) {
      const updated = updater(currentGroup);
      return updated ? (updated as FilterGroupType) : currentGroup;
    }

    const newRules = currentGroup.rules.map(rule => {
      if (rule.id === targetId) {
        const updated = updater(rule);
        return updated;
      }
      if (isFilterGroup(rule)) {
        return updateNode(rule, targetId, updater);
      }
      return rule;
    }).filter(Boolean) as (FilterRule | FilterGroupType)[];

    return { ...currentGroup, rules: newRules };
  }, []);

  const addRule = useCallback((groupId: string) => {
    setFilterState(prev => updateNode(prev, groupId, (node) => {
      if (isFilterGroup(node)) {
        return { ...node, rules: [...node.rules, createEmptyRule()] };
      }
      return node;
    }));
  }, [updateNode]);

  const addGroup = useCallback((groupId: string) => {
    setFilterState(prev => updateNode(prev, groupId, (node) => {
      if (isFilterGroup(node)) {
        return { ...node, rules: [...node.rules, createEmptyGroup()] };
      }
      return node;
    }));
  }, [updateNode]);

  const removeRuleOrGroup = useCallback((idToRemove: string) => {
    setFilterState(prev => {
      const newRules = prev.rules.map(rule => {
        if (rule.id === idToRemove) return null;
        if (isFilterGroup(rule)) {
          // If the group has this child, we could handle it via updateNode,
          // but to make it simple at root level:
          return rule;
        }
        return rule;
      }).filter(Boolean) as (FilterRule | FilterGroupType)[];
      
      // We must handle recursive removal.
      // Easiest is to use updateNode and return null, but updateNode expects to replace the node itself,
      // which we handled in `newRules.filter(Boolean)` for children inside `updateNode`
      return prev;
    });
    
    // Better implementation of remove:
    const removeRecursive = (group: FilterGroupType, targetId: string): FilterGroupType => {
      return {
        ...group,
        rules: group.rules
          .filter(r => r.id !== targetId)
          .map(r => (isFilterGroup(r) ? removeRecursive(r, targetId) : r))
      };
    };
    
    setFilterState(prev => removeRecursive(prev, idToRemove));
    
  }, []);

  const updateRule = useCallback((ruleId: string, updates: Partial<FilterRule>) => {
    setFilterState(prev => updateNode(prev, ruleId, (node) => {
      if (!isFilterGroup(node)) {
        return { ...node, ...updates };
      }
      return node;
    }));
  }, [updateNode]);

  const updateLogicalOperator = useCallback((groupId: string, logicalOperator: LogicalOperator) => {
    setFilterState(prev => updateNode(prev, groupId, (node) => {
      if (isFilterGroup(node)) {
        return { ...node, logicalOperator };
      }
      return node;
    }));
  }, [updateNode]);

  return {
    filterState,
    setFilterState,
    addRule,
    addGroup,
    removeRuleOrGroup,
    updateRule,
    updateLogicalOperator,
  };
};
