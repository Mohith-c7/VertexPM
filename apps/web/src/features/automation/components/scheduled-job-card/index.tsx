'use client';

import React from 'react';
import { ScheduledJob } from '../../types';
import { JOB_STATUS_COLORS } from '../../constants';
import { formatDateTime, getStatusLabel } from '../../utils';
import { Clock, Play, AlertTriangle, CheckCircle, Ban, RefreshCw } from 'lucide-react';

interface ScheduledJobCardProps {
  job: ScheduledJob;
  onRun: (jobId: string) => Promise<unknown>;
  onCancel: (jobId: string) => Promise<unknown>;
  isProcessing: boolean;
}

export function ScheduledJobCard({ job, onRun, onCancel, isProcessing }: ScheduledJobCardProps) {
  const statusColor = JOB_STATUS_COLORS[job.status] ?? '#94a3b8';

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'DUE_DATE_REMINDER':
        return 'Due Date Checker';
      case 'OVERDUE_REMINDER':
        return 'Overdue Escalator';
      case 'CUSTOM_REMINDER':
        return 'Custom Scheduled Reminder';
      case 'RECURRING_AUTOMATION':
        return 'Recurring Automation Job';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={14} color="#f59e0b" />;
      case 'RUNNING':
        return <RefreshCw size={14} className="animate-spin" color="#3b82f6" />;
      case 'COMPLETED':
        return <CheckCircle size={14} color="#10b981" />;
      case 'FAILED':
        return <AlertTriangle size={14} color="#ef4444" />;
      case 'CANCELLED':
        return <Ban size={14} color="#6b7280" />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
      }}
    >
      {/* Top row: Type and Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>
            {getJobTypeLabel(job.type)}
          </h4>
          <span style={{ fontSize: 11, color: '#475569' }}>
            ID: <code style={{ color: '#94a3b8' }}>{job.id}</code>
          </span>
        </div>

        {/* Status badge */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 20,
            background: `${statusColor}18`,
            color: statusColor,
            border: `1px solid ${statusColor}30`,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {getStatusIcon(job.status)}
          {getStatusLabel(job.status)}
        </span>
      </div>

      {/* Info details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          fontSize: 12,
          color: '#94a3b8',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          paddingTop: 12,
        }}
      >
        <div>
          <span style={{ display: 'block', color: '#475569', marginBottom: 2 }}>LAST RUN</span>
          <span style={{ fontWeight: 600 }}>{job.lastRun ? formatDateTime(job.lastRun) : 'Never'}</span>
        </div>
        <div>
          <span style={{ display: 'block', color: '#475569', marginBottom: 2 }}>NEXT RUN</span>
          <span style={{ fontWeight: 600, color: '#3b82f6' }}>
            {job.nextRun ? formatDateTime(job.nextRun) : job.scheduledFor ? formatDateTime(job.scheduledFor) : 'N/A'}
          </span>
        </div>

        {job.retryCount !== undefined && job.retryCount > 0 && (
          <div style={{ gridColumn: 'span 2' }}>
            <span style={{ color: '#ef4444', fontWeight: 600 }}>
              Retried {job.retryCount} of {job.maxRetries ?? 3} times
            </span>
          </div>
        )}

        {job.errorMessage && (
          <div
            style={{
              gridColumn: 'span 2',
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.1)',
              borderRadius: 8,
              padding: 8,
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#ef4444',
            }}
          >
            {job.errorMessage}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          borderTop: '1px solid rgba(255,255,255,0.04)',
          paddingTop: 12,
          justifyContent: 'flex-end',
        }}
      >
        {/* Cancel Button */}
        {job.status === 'RUNNING' && (
          <button
            onClick={() => onCancel(job.id)}
            disabled={isProcessing}
            type="button"
            aria-label="Cancel running job"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 600,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Ban size={13} />
            Cancel Job
          </button>
        )}

        {/* Run Button */}
        {job.status !== 'RUNNING' && (
          <button
            onClick={() => onRun(job.id)}
            disabled={isProcessing}
            type="button"
            aria-label="Run job manually"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: 'none',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#a5b4fc',
              fontSize: 12,
              fontWeight: 600,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
            }}
          >
            <Play size={13} />
            Run Now
          </button>
        )}
      </div>
    </div>
  );
}
