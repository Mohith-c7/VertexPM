'use client';

import React from 'react';
import { useJobHistory } from '../../hooks/use-job-history';
import { ExecutionLogDetail } from '../execution-log';
import { EXECUTION_STATUS_COLORS, TRIGGER_DEFINITIONS } from '../../constants';
import { getStatusLabel, formatDuration, formatDateTime } from '../../utils';
import { TableRowSkeleton } from '../automation-loading';
import { Calendar, Filter, ChevronDown, ChevronUp, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExecutionStatus } from '../../types';

export function ExecutionHistory() {
  const {
    history,
    logs,
    filters,
    isLoading,
    error,
    expandedId,
    setPage,
    setStatusFilter,
    setDateRange,
    toggleExpanded,
    fetchHistory,
  } = useJobHistory();

  const handleDateChange = (type: 'from' | 'to', value: string) => {
    const from = type === 'from' ? value : filters.dateFrom;
    const to = type === 'to' ? value : filters.dateTo;
    setDateRange(from, to);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            Execution History
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>
            Review detailed log history of triggered automation rules and job runs.
          </p>
        </div>

        <button
          onClick={() => fetchHistory()}
          type="button"
          aria-label="Refresh execution history"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            color: '#cbd5e1',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Filters bar */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {([
            { value: 'ALL', label: 'All Executions' },
            { value: 'SUCCESS', label: 'Success' },
            { value: 'FAILED', label: 'Failed' },
            { value: 'RETRYING', label: 'Retrying' },
          ] as const).map((opt) => {
            const isSelected = (filters.status ?? 'ALL') === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                type="button"
                aria-label={`Filter executions by status ${opt.label}`}
                aria-pressed={isSelected}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  background: isSelected ? '#6366f1' : 'transparent',
                  color: isSelected ? '#fff' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Date Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label htmlFor="dateFrom" style={{ fontSize: 12, color: '#64748b' }}>From</label>
            <input
              id="dateFrom"
              type="date"
              value={filters.dateFrom ?? ''}
              onChange={(e) => handleDateChange('from', e.target.value)}
              aria-label="Filter execution logs starting from date"
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                padding: '6px 10px',
                color: '#fff',
                fontSize: 12,
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <label htmlFor="dateTo" style={{ fontSize: 12, color: '#64748b' }}>To</label>
            <input
              id="dateTo"
              type="date"
              value={filters.dateTo ?? ''}
              onChange={(e) => handleDateChange('to', e.target.value)}
              aria-label="Filter execution logs up to date"
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                padding: '6px 10px',
                color: '#fff',
                fontSize: 12,
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>RULE NAME</th>
              <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>TRIGGER</th>
              <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>EXECUTED AT</th>
              <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>DURATION</th>
              <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>ACTIONS</th>
              <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>STATUS</th>
              <th style={{ width: 44 }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
                  <AlertCircle size={24} style={{ display: 'block', margin: '0 auto 8px auto', color: '#475569' }} />
                  <span style={{ fontSize: 14 }}>No executions found</span>
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const triggerDef = TRIGGER_DEFINITIONS.find((t) => t.type === log.triggerType);
                const statusColor = EXECUTION_STATUS_COLORS[log.status] ?? '#94a3b8';
                const isExpanded = expandedId === log.id;

                return (
                  <React.Fragment key={log.id}>
                    {/* Main Row */}
                    <tr
                      onClick={() => toggleExpanded(log.id)}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        background: isExpanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isExpanded ? 'rgba(255, 255, 255, 0.02)' : 'transparent';
                      }}
                    >
                      {/* Name */}
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                        {log.ruleName ?? 'Unnamed Rule'}
                      </td>

                      {/* Trigger badge */}
                      <td style={{ padding: '14px 16px' }}>
                        {triggerDef && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 500,
                              padding: '2px 6px',
                              borderRadius: 6,
                              background: `${triggerDef.color}15`,
                              color: triggerDef.color,
                            }}
                          >
                            {triggerDef.label}
                          </span>
                        )}
                      </td>

                      {/* Executed At */}
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8' }}>
                        {formatDateTime(log.startedAt)}
                      </td>

                      {/* Duration */}
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8' }}>
                        {formatDuration(log.duration)}
                      </td>

                      {/* Actions Count */}
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>
                        {log.actionsRun ?? 0}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 12,
                            background: `${statusColor}18`,
                            color: statusColor,
                          }}
                        >
                          {getStatusLabel(log.status)}
                        </span>
                      </td>

                      {/* Expand Chevron */}
                      <td style={{ padding: '14px 16px', color: '#475569', textAlign: 'center' }}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                    </tr>

                    {/* Collapsible Details Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} style={{ padding: '12px 16px', background: 'rgba(0, 0, 0, 0.15)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <ExecutionLogDetail log={log} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        {history.totalPages > 1 && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.01)',
            }}
          >
            <span style={{ fontSize: 12, color: '#64748b' }}>
              Showing {logs.length} of {history.total} executions
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => setPage(history.page - 1)}
                disabled={history.page <= 1}
                aria-label="Previous page"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  color: history.page <= 1 ? '#475569' : '#cbd5e1',
                  cursor: history.page <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: 12,
                }}
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                Page {history.page} of {history.totalPages}
              </span>

              <button
                onClick={() => setPage(history.page + 1)}
                disabled={history.page >= history.totalPages}
                aria-label="Next page"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  color: history.page >= history.totalPages ? '#475569' : '#cbd5e1',
                  cursor: history.page >= history.totalPages ? 'not-allowed' : 'pointer',
                  fontSize: 12,
                }}
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
