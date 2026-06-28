'use client';

import React, { useState } from 'react';
import { ExecutionLog } from '../../types';
import { EXECUTION_STATUS_COLORS, TRIGGER_DEFINITIONS } from '../../constants';
import { formatDateTime, formatDuration, getStatusLabel } from '../../utils';
import { Clock, AlertCircle, Play, ChevronDown, ChevronRight, CheckCircle, Zap } from 'lucide-react';

interface ExecutionLogProps {
  log: ExecutionLog;
}

export function ExecutionLogDetail({ log }: ExecutionLogProps) {
  const [jsonExpanded, setJsonExpanded] = useState(false);
  const triggerDef = TRIGGER_DEFINITIONS.find((t) => t.type === log.triggerType);
  const statusColor = EXECUTION_STATUS_COLORS[log.status] ?? '#94a3b8';

  return (
    <div
      style={{
        background: '#090d16',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        color: '#f8fafc',
      }}
    >
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            EXECUTION DETAILED LOG
          </span>
          <h4 style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0 0', color: '#e2e8f0' }}>
            {log.ruleName ?? 'Unnamed Rule'}
          </h4>
          <span style={{ fontSize: 12, color: '#64748b' }}>
            ID: <code style={{ color: '#a5b4fc' }}>{log.id}</code>
          </span>
        </div>

        {/* Status Badge */}
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
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {log.status === 'SUCCESS' ? (
            <CheckCircle size={13} color="#10b981" />
          ) : log.status === 'FAILED' ? (
            <AlertCircle size={13} color="#ef4444" />
          ) : (
            <Clock size={13} color="#f59e0b" />
          )}
          {getStatusLabel(log.status)}
        </span>
      </div>

      {/* Grid of stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          background: 'rgba(255,255,255,0.01)',
          padding: 12,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.03)',
        }}
      >
        <div>
          <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Triggered By</span>
          <span style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {triggerDef ? (
              <>
                {React.createElement(triggerDef.icon, { size: 13, color: triggerDef.color })}
                {triggerDef.label}
              </>
            ) : (
              <>
                <Zap size={13} color="#6366f1" />
                {log.triggerType}
              </>
            )}
          </span>
        </div>

        <div>
          <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Started At</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{formatDateTime(log.startedAt)}</span>
        </div>

        {log.completedAt && (
          <div>
            <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Completed At</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{formatDateTime(log.completedAt)}</span>
          </div>
        )}

        <div>
          <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Duration</span>
          <span style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} color="#64748b" />
            {formatDuration(log.duration)}
          </span>
        </div>

        <div>
          <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Actions Run</span>
          <span style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Play size={12} color="#10b981" />
            {log.actionsRun ?? 0}
          </span>
        </div>

        {log.retryCount !== undefined && log.retryCount > 0 && (
          <div>
            <span style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Retries</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b' }}>{log.retryCount} times</span>
          </div>
        )}
      </div>

      {/* Error Details alert */}
      {log.errorMessage && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 8,
            padding: 12,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fca5a5', display: 'block' }}>
              Execution Error
            </span>
            <p style={{ fontSize: 13, color: '#ef4444', margin: '4px 0 0 0', fontFamily: 'monospace' }}>
              {log.errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Collapsible Metadata Explorer */}
      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <div>
          <button
            onClick={() => setJsonExpanded((p) => !p)}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            {jsonExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span>Raw Context Metadata ({Object.keys(log.metadata).length} keys)</span>
          </button>

          {jsonExpanded && (
            <pre
              style={{
                marginTop: 10,
                background: '#04060b',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8,
                padding: 12,
                fontSize: 11,
                fontFamily: 'monospace',
                overflowX: 'auto',
                color: '#34d399',
                maxHeight: 250,
                margin: '10px 0 0 0',
              }}
            >
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
