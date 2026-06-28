'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExecutionLog, ExecutionHistoryFilters, PaginatedExecutionHistory, ExecutionStatus } from '../types';
import { automationService } from '../services/automation.service';

const DEFAULT_FILTERS: ExecutionHistoryFilters = {
  status: 'ALL',
  page: 1,
  limit: 20,
};

export function useJobHistory(initialFilters?: Partial<ExecutionHistoryFilters>) {
  const [history, setHistory] = useState<PaginatedExecutionHistory>({
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<ExecutionHistoryFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = useCallback(async (f?: ExecutionHistoryFilters) => {
    const activeFilters = f ?? filters;
    try {
      setIsLoading(true);
      setError(null);
      const data = await automationService.getHistory(activeFilters);
      setHistory(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load execution history';
      setError(msg);
      setHistory({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const updateFilters = useCallback((updates: Partial<ExecutionHistoryFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates, page: 1 };
      fetchHistory(next);
      return next;
    });
  }, [fetchHistory]);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => {
      const next = { ...prev, page };
      fetchHistory(next);
      return next;
    });
  }, [fetchHistory]);

  const setStatusFilter = useCallback((status: ExecutionStatus | 'ALL') => {
    updateFilters({ status });
  }, [updateFilters]);

  const setDateRange = useCallback((dateFrom?: string, dateTo?: string) => {
    updateFilters({ dateFrom, dateTo });
  }, [updateFilters]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return {
    history,
    logs: history.data,
    filters,
    isLoading,
    error,
    expandedId,
    fetchHistory,
    updateFilters,
    setPage,
    setStatusFilter,
    setDateRange,
    toggleExpanded,
  };
}
