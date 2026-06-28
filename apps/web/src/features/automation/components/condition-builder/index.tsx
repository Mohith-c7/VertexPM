'use client';

import React from 'react';
import { ConditionGroup, ConditionField, ConditionOperator } from '../../types';
import { FIELD_DEFINITIONS, OPERATOR_LABELS, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../constants';
import { Plus, Trash2, GitBranch, ArrowRight, CornerDownRight } from 'lucide-react';

interface ConditionBuilderProps {
  groups: ConditionGroup[];
  onAddGroup: () => void;
  onRemoveGroup: (groupId: string) => void;
  onUpdateGroupLogic: (groupId: string, logic: 'AND' | 'OR') => void;
  onAddCondition: (groupId: string) => void;
  onRemoveCondition: (groupId: string, conditionId: string) => void;
  onUpdateCondition: (
    groupId: string,
    conditionId: string,
    updates: Partial<ConditionGroup['conditions'][0]>
  ) => void;
}

export function ConditionBuilder({
  groups,
  onAddGroup,
  onRemoveGroup,
  onUpdateGroupLogic,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
}: ConditionBuilderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
            Conditions
          </h4>
          <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0 0' }}>
            Optional conditions that must be met for actions to run.
          </p>
        </div>

        {groups.length === 0 && (
          <button
            onClick={onAddGroup}
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
            Add Condition Group
          </button>
        )}
      </div>

      {groups.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groups.map((group, groupIdx) => (
            <div
              key={group.id}
              style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 16,
                padding: 18,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {/* Group Header: LOGIC toggle & Remove Group */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <GitBranch size={13} />
                    Group {groupIdx + 1} Logic:
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      background: '#0f172a',
                      borderRadius: 8,
                      padding: 2,
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {(['AND', 'OR'] as const).map((op) => {
                      const active = group.logic === op;
                      return (
                        <button
                          key={op}
                          type="button"
                          onClick={() => onUpdateGroupLogic(group.id, op)}
                          aria-label={`Set group logic to ${op}`}
                          aria-pressed={active}
                          style={{
                            padding: '3px 10px',
                            borderRadius: 6,
                            border: 'none',
                            background: active ? '#6366f1' : 'transparent',
                            color: active ? '#fff' : '#64748b',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {op}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => onRemoveGroup(group.id)}
                  type="button"
                  aria-label="Remove condition group"
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
                  Delete Group
                </button>
              </div>

              {/* Conditions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {group.conditions.map((condition) => {
                  const fieldDef = FIELD_DEFINITIONS.find((f) => f.field === condition.field);
                  const allowedOperators = fieldDef?.operators ?? [];
                  const valueType = fieldDef?.valueType ?? 'text';

                  return (
                    <div
                      key={condition.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        flexWrap: 'wrap',
                      }}
                    >
                      <CornerDownRight size={14} color="#475569" style={{ flexShrink: 0 }} />

                      {/* Field Dropdown */}
                      <select
                        value={condition.field}
                        onChange={(e) => {
                          const newField = e.target.value as ConditionField;
                          const newDef = FIELD_DEFINITIONS.find((f) => f.field === newField);
                          const firstOp = newDef?.operators[0] ?? '';
                          onUpdateCondition(group.id, condition.id, {
                            field: newField,
                            operator: firstOp,
                            value: '',
                          });
                        }}
                        aria-label="Select condition field"
                        style={{
                          background: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 8,
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: 13,
                          outline: 'none',
                          flex: 1,
                          minWidth: 120,
                        }}
                      >
                        <option value="" disabled>Select Field...</option>
                        {FIELD_DEFINITIONS.map((f) => (
                          <option key={f.field} value={f.field}>{f.label}</option>
                        ))}
                      </select>

                      {/* Operator Dropdown */}
                      <select
                        value={condition.operator}
                        disabled={!condition.field}
                        onChange={(e) =>
                          onUpdateCondition(group.id, condition.id, {
                            operator: e.target.value as ConditionOperator,
                          })
                        }
                        aria-label="Select condition operator"
                        style={{
                          background: '#0f172a',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: 8,
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: 13,
                          outline: 'none',
                          flex: 1,
                          minWidth: 120,
                        }}
                      >
                        <option value="" disabled>Select Operator...</option>
                        {allowedOperators.map((op) => (
                          <option key={op} value={op}>
                            {OPERATOR_LABELS[op] ?? op}
                          </option>
                        ))}
                      </select>

                      {/* Value Input */}
                      {condition.field && !['is_empty', 'is_not_empty'].includes(condition.operator) && (
                        <div style={{ flex: 2, minWidth: 160 }}>
                          {valueType === 'select' ? (
                            <select
                              value={condition.value as string}
                              onChange={(e) =>
                                onUpdateCondition(group.id, condition.id, { value: e.target.value })
                              }
                              aria-label="Select condition value"
                              style={{
                                width: '100%',
                                background: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#fff',
                                fontSize: 13,
                                outline: 'none',
                              }}
                            >
                              <option value="" disabled>Select Value...</option>
                              {(condition.field === 'status' ? STATUS_OPTIONS : PRIORITY_OPTIONS).map(
                                (opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                )
                              )}
                            </select>
                          ) : valueType === 'number' ? (
                            <input
                              type="number"
                              placeholder="Enter value"
                              value={condition.value as string}
                              onChange={(e) =>
                                onUpdateCondition(group.id, condition.id, { value: e.target.value })
                              }
                              aria-label="Enter numerical value"
                              style={{
                                width: '100%',
                                background: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#fff',
                                fontSize: 13,
                                outline: 'none',
                              }}
                            />
                          ) : valueType === 'date' ? (
                            <input
                              type="date"
                              value={condition.value as string}
                              onChange={(e) =>
                                onUpdateCondition(group.id, condition.id, { value: e.target.value })
                              }
                              aria-label="Select date value"
                              style={{
                                width: '100%',
                                background: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#fff',
                                fontSize: 13,
                                outline: 'none',
                              }}
                            />
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter criteria..."
                              value={condition.value as string}
                              onChange={(e) =>
                                onUpdateCondition(group.id, condition.id, { value: e.target.value })
                              }
                              aria-label="Enter text criteria"
                              style={{
                                width: '100%',
                                background: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#fff',
                                fontSize: 13,
                                outline: 'none',
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Remove Condition Row */}
                      <button
                        onClick={() => onRemoveCondition(group.id, condition.id)}
                        type="button"
                        aria-label="Remove condition row"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: 'none',
                          background: 'rgba(255,255,255,0.04)',
                          color: '#64748b',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#64748b';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add condition button inside group */}
              <button
                onClick={() => onAddCondition(group.id)}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  alignSelf: 'flex-start',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#8b5cf6',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                <Plus size={12} />
                Add Row Criteria
              </button>
            </div>
          ))}

          {/* Add Group button at bottom */}
          <button
            onClick={onAddGroup}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'center',
              padding: '12px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              color: '#94a3b8',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
            }}
          >
            <Plus size={14} />
            Add Another Condition Group
          </button>
        </div>
      )}
    </div>
  );
}
