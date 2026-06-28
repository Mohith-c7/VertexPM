'use client';

import React from 'react';
import { AutomationRule } from '../../types';
import { TRIGGER_DEFINITIONS, ACTION_DEFINITIONS } from '../../constants';
import { AutomationStatusBadge } from '../automation-status';
import { formatRelativeTime } from '../../utils';
import { MoreHorizontal, Play, Pause, Trash2, Edit, Zap } from 'lucide-react';

interface AutomationCardProps {
  rule: AutomationRule;
  onToggle: (id: string, enable: boolean) => void;
  onDelete: (id: string) => void;
  onEdit?: (rule: AutomationRule) => void;
  isSaving?: boolean;
}

export function AutomationCard({
  rule,
  onToggle,
  onDelete,
  onEdit,
  isSaving,
}: AutomationCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const triggerDef = TRIGGER_DEFINITIONS.find((t) => t.type === rule.triggerType);
  const TriggerIcon = triggerDef?.icon ?? Zap;

  const actionTypes = rule.actions?.map((a) =>
    ACTION_DEFINITIONS.find((d) => d.type === a.type)
  ).filter(Boolean);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        position: 'relative',
        transition: 'all 0.2s ease',
        opacity: isSaving ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99, 102, 241, 0.3)';
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
      }}
    >
      {/* Trigger Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${triggerDef?.color ?? '#6366f1'}20`,
          border: `1px solid ${triggerDef?.color ?? '#6366f1'}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <TriggerIcon size={20} color={triggerDef?.color ?? '#6366f1'} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#e2e8f0',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {rule.name}
          </h3>
          <AutomationStatusBadge status={rule.status} size="sm" />
        </div>

        {rule.description && (
          <p
            style={{
              fontSize: 13,
              color: '#64748b',
              margin: '0 0 10px 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {rule.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Trigger badge */}
          {triggerDef && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 8px',
                borderRadius: 8,
                background: `${triggerDef.color}18`,
                color: triggerDef.color,
                border: `1px solid ${triggerDef.color}25`,
              }}
            >
              {triggerDef.label}
            </span>
          )}

          {/* Action badges (max 3) */}
          {actionTypes.slice(0, 3).map((actionDef, i) =>
            actionDef ? (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: 8,
                  background: `${actionDef.color}18`,
                  color: actionDef.color,
                  border: `1px solid ${actionDef.color}25`,
                }}
              >
                {actionDef.label}
              </span>
            ) : null
          )}

          {actionTypes.length > 3 && (
            <span style={{ fontSize: 11, color: '#64748b' }}>
              +{actionTypes.length - 3} more
            </span>
          )}

          {/* Stats */}
          {rule.executionCount !== undefined && rule.executionCount > 0 && (
            <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>
              {rule.executionCount} runs
            </span>
          )}
          {rule.lastExecutedAt && (
            <span style={{ fontSize: 11, color: '#475569' }}>
              Last run {formatRelativeTime(rule.lastExecutedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* Toggle enable/disable */}
        <button
          onClick={() => onToggle(rule.id, rule.status !== 'active')}
          disabled={isSaving}
          title={rule.status === 'active' ? 'Disable rule' : 'Enable rule'}
          aria-label={rule.status === 'active' ? 'Disable rule' : 'Enable rule'}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: 'none',
            background: rule.status === 'active'
              ? 'rgba(16, 185, 129, 0.12)'
              : 'rgba(255,255,255,0.06)',
            color: rule.status === 'active' ? '#10b981' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          {rule.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Edit */}
        {onEdit && (
          <button
            onClick={() => onEdit(rule)}
            title="Edit rule"
            aria-label="Edit rule"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'rgba(255,255,255,0.06)',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Edit size={14} />
          </button>
        )}

        {/* Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="More options"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'rgba(255,255,255,0.06)',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <>
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 10,
                }}
                onClick={() => setMenuOpen(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 36,
                  zIndex: 20,
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: 6,
                  minWidth: 140,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}
              >
                <button
                  onClick={() => { onDelete(rule.id); setMenuOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <Trash2 size={13} />
                  Delete Rule
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
