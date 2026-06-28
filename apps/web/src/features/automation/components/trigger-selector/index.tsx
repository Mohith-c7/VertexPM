'use client';

import React from 'react';
import { TRIGGER_DEFINITIONS, TRIGGER_CATEGORIES } from '../../constants';
import { TriggerType } from '../../types';
import { Zap } from 'lucide-react';

interface TriggerSelectorProps {
  selectedType: TriggerType | '';
  onSelect: (type: TriggerType) => void;
}

export function TriggerSelector({ selectedType, onSelect }: TriggerSelectorProps) {
  // Group by category
  const groupedDefinitions = React.useMemo(() => {
    const groups: Record<string, typeof TRIGGER_DEFINITIONS> = {};
    TRIGGER_DEFINITIONS.forEach((def) => {
      if (!groups[def.category]) {
        groups[def.category] = [];
      }
      groups[def.category].push(def);
    });
    return groups;
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {TRIGGER_CATEGORIES.map((category) => {
        const definitions = groupedDefinitions[category] || [];
        if (definitions.length === 0) return null;

        return (
          <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h4
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              {category}
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 12,
              }}
            >
              {definitions.map((def) => {
                const isSelected = selectedType === def.type;
                const Icon = def.icon;

                return (
                  <button
                    key={def.type}
                    onClick={() => onSelect(def.type)}
                    type="button"
                    aria-label={`Select trigger: ${def.label}. ${def.description}`}
                    aria-pressed={isSelected}
                    style={{
                      background: isSelected
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected
                        ? '1px solid #6366f1'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 12,
                      padding: 16,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      }
                    }}
                    onFocus={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = '#6366f1';
                    }}
                    onBlur={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : `${def.color}15`,
                        border: `1px solid ${isSelected ? '#6366f1' : def.color}25`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color={isSelected ? '#a5b4fc' : def.color} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isSelected ? '#a5b4fc' : '#e2e8f0',
                        }}
                      >
                        {def.label}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#64748b',
                          lineHeight: 1.4,
                        }}
                      >
                        {def.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
