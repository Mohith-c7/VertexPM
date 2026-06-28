'use client';

import React from 'react';
import { TRIGGER_DEFINITIONS } from '../../constants';
import { TriggerConfig, TriggerType } from '../../types';
import { HelpCircle } from 'lucide-react';

interface TriggerCardProps {
  type: TriggerType;
  config: TriggerConfig;
  onChange: (key: string, value: unknown) => void;
  onClear: () => void;
}

export function TriggerCard({ type, config, onChange, onClear }: TriggerCardProps) {
  const def = TRIGGER_DEFINITIONS.find((t) => t.type === type);
  if (!def) return null;

  const Icon = def.icon;

  const isSchedule = type === 'SCHEDULE';
  const isWorkItem = type.startsWith('WORKITEM_');

  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${def.color}18`,
              border: `1px solid ${def.color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} color={def.color} />
          </div>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
              Trigger: {def.label}
            </h4>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0 0' }}>
              {def.description}
            </p>
          </div>
        </div>

        <button
          onClick={onClear}
          type="button"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#6366f1',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Change Trigger
        </button>
      </div>

      {/* Config Form */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h5 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', margin: 0, letterSpacing: '0.02em' }}>
          CONFIGURATION
        </h5>

        {isSchedule && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label
              htmlFor="cronExpression"
              style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Cron Expression
              <span title="Standard 5-field cron: minute hour day-of-month month day-of-week">
                <HelpCircle size={14} color="#64748b" />
              </span>
            </label>
            <input
              id="cronExpression"
              type="text"
              placeholder="e.g. 0 9 * * 1-5 (Mon-Fri at 9:00 AM)"
              value={config.cronExpression ?? ''}
              onChange={(e) => onChange('cronExpression', e.target.value)}
              aria-label="Cron Expression for schedule trigger"
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                padding: '10px 12px',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              Use <code style={{ color: '#a5b4fc', background: 'rgba(255,255,255,0.04)', padding: '2px 4px', borderRadius: 4 }}>*/5 * * * *</code> for every 5 minutes, or <code style={{ color: '#a5b4fc', background: 'rgba(255,255,255,0.04)', padding: '2px 4px', borderRadius: 4 }}>0 0 * * *</code> for daily at midnight.
            </p>
          </div>
        )}

        {isWorkItem && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="max-sm:grid-cols-1">
            {/* Project scope */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="projectId" style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>
                Project Scope (Optional)
              </label>
              <select
                id="projectId"
                value={config.projectId ?? ''}
                onChange={(e) => onChange('projectId', e.target.value || undefined)}
                aria-label="Filter trigger by project"
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="">All Projects</option>
                <option value="proj-1">VertexPM Sprint Board</option>
                <option value="proj-2">Enterprise Client Portal</option>
                <option value="proj-3">Design System Components</option>
              </select>
            </div>

            {/* Entity Type scope */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="entityType" style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>
                Work Item Type (Optional)
              </label>
              <select
                id="entityType"
                value={config.entityType ?? ''}
                onChange={(e) => onChange('entityType', e.target.value || undefined)}
                aria-label="Filter trigger by item type"
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                }}
              >
                <option value="">All Types</option>
                <option value="TASK">Task</option>
                <option value="BUG">Bug</option>
                <option value="STORY">Story</option>
                <option value="EPIC">Epic</option>
              </select>
            </div>
          </div>
        )}

        {!isSchedule && !isWorkItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label htmlFor="generalProject" style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>
              Project Scope (Optional)
            </label>
            <select
              id="generalProject"
              value={config.projectId ?? ''}
              onChange={(e) => onChange('projectId', e.target.value || undefined)}
              aria-label="Filter trigger by project scope"
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                padding: '10px 12px',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                width: '100%',
              }}
            >
              <option value="">All Projects</option>
              <option value="proj-1">VertexPM Sprint Board</option>
              <option value="proj-2">Enterprise Client Portal</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
