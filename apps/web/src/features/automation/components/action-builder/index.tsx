'use client';

import React from 'react';
import { AutomationAction, ActionType } from '../../types';
import { ACTION_DEFINITIONS, STATUS_OPTIONS, PRIORITY_OPTIONS, REMINDER_TYPE_OPTIONS } from '../../constants';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

interface ActionBuilderProps {
  actions: AutomationAction[];
  onAddAction: () => void;
  onRemoveAction: (actionId: string) => void;
  onUpdateAction: (actionId: string, updates: Partial<AutomationAction>) => void;
  onUpdateActionConfig: (actionId: string, key: string, value: unknown) => void;
}

export function ActionBuilder({
  actions,
  onAddAction,
  onRemoveAction,
  onUpdateAction,
  onUpdateActionConfig,
}: ActionBuilderProps) {
  // Move action in order (visual reorder implementation)
  const moveAction = (index: number, direction: 'up' | 'down') => {
    const nextIdx = direction === 'up' ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= actions.length) return;

    const list = [...actions];
    const temp = list[index];
    list[index] = list[nextIdx];
    list[nextIdx] = temp;

    // Update their order and re-save
    list.forEach((item, idx) => {
      onUpdateAction(item.id, { order: idx + 1 });
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
            Actions
          </h4>
          <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0 0' }}>
            Configure one or more actions to execute when the trigger fires.
          </p>
        </div>

        <button
          onClick={onAddAction}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 8,
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: '#a5b4fc',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus size={14} />
          Add Action
        </button>
      </div>

      {actions.length === 0 ? (
        <div
          onClick={onAddAction}
          style={{
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            padding: '40px 20px',
            textAlign: 'center',
            color: '#64748b',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.01)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
          }}
        >
          <p style={{ fontSize: 14, margin: '0 0 8px 0', fontWeight: 600, color: '#94a3b8' }}>
            No actions defined
          </p>
          <p style={{ fontSize: 13, margin: 0 }}>
            Click here or use the &quot;Add Action&quot; button to define what happens.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {actions.map((action, index) => {
            const selectedDef = ACTION_DEFINITIONS.find((d) => d.type === action.type);
            const Icon = selectedDef?.icon;

            return (
              <div
                key={action.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 16,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {/* Action Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: '#475569' }}>
                      <GripVertical size={16} />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#94a3b8',
                        padding: '2px 6px',
                        borderRadius: 6,
                      }}
                    >
                      ACTION #{action.order}
                    </span>

                    {/* Order buttons (visual reordering) */}
                    <div style={{ display: 'flex', gap: 2 }}>
                      <button
                        type="button"
                        onClick={() => moveAction(index, 'up')}
                        disabled={index === 0}
                        aria-label="Move action up"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: index === 0 ? '#334155' : '#64748b',
                          cursor: index === 0 ? 'not-allowed' : 'pointer',
                          padding: 2,
                        }}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveAction(index, 'down')}
                        disabled={index === actions.length - 1}
                        aria-label="Move action down"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: index === actions.length - 1 ? '#334155' : '#64748b',
                          cursor: index === actions.length - 1 ? 'not-allowed' : 'pointer',
                          padding: 2,
                        }}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveAction(action.id)}
                    type="button"
                    aria-label={`Remove action ${action.order}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12,
                      color: '#ef4444',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                    Remove Action
                  </button>
                </div>

                {/* Select Action Type Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label htmlFor={`action-type-${action.id}`} style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                    ACTION TYPE
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: 8,
                    }}
                  >
                    {ACTION_DEFINITIONS.map((def) => {
                      const isSelected = action.type === def.type;
                      const DefIcon = def.icon;

                      return (
                        <button
                          key={def.type}
                          type="button"
                          onClick={() => {
                            onUpdateAction(action.id, { type: def.type, config: {} });
                          }}
                          aria-label={`Select action type: ${def.label}`}
                          aria-pressed={isSelected}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            borderRadius: 10,
                            background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                            color: isSelected ? '#a5b4fc' : '#94a3b8',
                            fontSize: 13,
                            fontWeight: isSelected ? 600 : 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <DefIcon size={14} color={isSelected ? '#a5b4fc' : def.color} />
                          {def.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Configuration Form */}
                {action.type && (
                  <div
                    style={{
                      background: '#0f172a',
                      borderRadius: 12,
                      padding: 16,
                      border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      Configuration Form
                    </span>

                    {action.type === 'CREATE_NOTIFICATION' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label htmlFor={`title-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                            Notification Title
                          </label>
                          <input
                            id={`title-${action.id}`}
                            type="text"
                            placeholder="e.g. Work item created"
                            value={action.config.title as string ?? ''}
                            onChange={(e) => onUpdateActionConfig(action.id, 'title', e.target.value)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: '#fff',
                              fontSize: 13,
                              outline: 'none',
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label htmlFor={`msg-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                            Message Template
                          </label>
                          <textarea
                            id={`msg-${action.id}`}
                            rows={3}
                            placeholder="e.g. A new task has been created. Click to view."
                            value={action.config.message as string ?? ''}
                            onChange={(e) => onUpdateActionConfig(action.id, 'message', e.target.value)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: '#fff',
                              fontSize: 13,
                              outline: 'none',
                              resize: 'vertical',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {action.type === 'ASSIGN_USER' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label htmlFor={`assignee-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                          Assignee
                        </label>
                        <select
                          id={`assignee-${action.id}`}
                          value={action.config.userId as string ?? ''}
                          onChange={(e) => onUpdateActionConfig(action.id, 'userId', e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: '#fff',
                            fontSize: 13,
                            outline: 'none',
                          }}
                        >
                          <option value="" disabled>Select User...</option>
                          <option value="user-1">Mohith (Product Owner)</option>
                          <option value="user-2">Anusha (Tech Lead)</option>
                          <option value="user-3">Rahul (Fullstack Engineer)</option>
                          <option value="user-4">Sarah (UI/UX Designer)</option>
                        </select>
                      </div>
                    )}

                    {action.type === 'CHANGE_STATUS' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label htmlFor={`status-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                          New Status
                        </label>
                        <select
                          id={`status-${action.id}`}
                          value={action.config.status as string ?? ''}
                          onChange={(e) => onUpdateActionConfig(action.id, 'status', e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: '#fff',
                            fontSize: 13,
                            outline: 'none',
                          }}
                        >
                          <option value="" disabled>Select Status...</option>
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {action.type === 'CHANGE_PRIORITY' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label htmlFor={`priority-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                          New Priority
                        </label>
                        <select
                          id={`priority-${action.id}`}
                          value={action.config.priority as string ?? ''}
                          onChange={(e) => onUpdateActionConfig(action.id, 'priority', e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: '#fff',
                            fontSize: 13,
                            outline: 'none',
                          }}
                        >
                          <option value="" disabled>Select Priority...</option>
                          {PRIORITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {action.type === 'ADD_LABEL' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label htmlFor={`label-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                          Label to Add
                        </label>
                        <input
                          id={`label-${action.id}`}
                          type="text"
                          placeholder="e.g. bug, high-priority"
                          value={action.config.label as string ?? ''}
                          onChange={(e) => onUpdateActionConfig(action.id, 'label', e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: '#fff',
                            fontSize: 13,
                            outline: 'none',
                          }}
                        />
                      </div>
                    )}

                    {action.type === 'SCHEDULE_REMINDER' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="max-sm:grid-cols-1">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label htmlFor={`rem-type-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                            Reminder Type
                          </label>
                          <select
                            id={`rem-type-${action.id}`}
                            value={action.config.reminderType as string ?? ''}
                            onChange={(e) => onUpdateActionConfig(action.id, 'reminderType', e.target.value)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: '#fff',
                              fontSize: 13,
                              outline: 'none',
                            }}
                          >
                            <option value="" disabled>Select Type...</option>
                            {REMINDER_TYPE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label htmlFor={`rem-at-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                            Remind At (Datetime)
                          </label>
                          <input
                            id={`rem-at-${action.id}`}
                            type="datetime-local"
                            value={action.config.remindAt as string ?? ''}
                            onChange={(e) => onUpdateActionConfig(action.id, 'remindAt', e.target.value)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: '#fff',
                              fontSize: 13,
                              outline: 'none',
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }} className="max-sm:col-span-1">
                          <label htmlFor={`rem-msg-${action.id}`} style={{ fontSize: 12, color: '#cbd5e1' }}>
                            Reminder Message
                          </label>
                          <input
                            id={`rem-msg-${action.id}`}
                            type="text"
                            placeholder="Reminder details..."
                            value={action.config.message as string ?? ''}
                            onChange={(e) => onUpdateActionConfig(action.id, 'message', e.target.value)}
                            style={{
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 8,
                              padding: '8px 12px',
                              color: '#fff',
                              fontSize: 13,
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
