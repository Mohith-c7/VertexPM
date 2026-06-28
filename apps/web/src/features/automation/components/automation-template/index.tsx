'use client';

import React from 'react';
import { AUTOMATION_TEMPLATES, TRIGGER_DEFINITIONS, ACTION_DEFINITIONS } from '../../constants';
import { HelpCircle, Zap, ArrowRight, BookOpen } from 'lucide-react';

interface AutomationTemplateProps {
  onSelect: (templateId: string) => void;
  selectedTemplateId: string | null;
}

export function AutomationTemplateGallery({ onSelect, selectedTemplateId }: AutomationTemplateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={18} color="#6366f1" />
          Start with a template
        </h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>
          Select a pre-configured automation template to speed up your setup, or start from scratch below.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {AUTOMATION_TEMPLATES.map((tpl) => {
          const triggerDef = TRIGGER_DEFINITIONS.find((t) => t.type === tpl.triggerType);
          const TriggerIcon = triggerDef?.icon ?? Zap;
          const isSelected = selectedTemplateId === tpl.id;

          return (
            <div
              key={tpl.id}
              style={{
                background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Trigger tag & category */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {triggerDef && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 6,
                        background: `${triggerDef.color}15`,
                        color: triggerDef.color,
                        border: `1px solid ${triggerDef.color}20`,
                      }}
                    >
                      {triggerDef.label}
                    </span>
                  )}
                  {tpl.category && (
                    <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
                      {tpl.category}
                    </span>
                  )}
                </div>

                {/* Name & description */}
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0, lineHeight: 1.4 }}>
                  {tpl.name}
                </h4>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {tpl.description}
                </p>
              </div>

              {/* Actions Preview Flow */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#475569', uppercase: true } as React.CSSProperties}>
                  FLOW PREVIEW
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: triggerDef?.color ?? '#6366f1',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '4px 8px',
                      borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <TriggerIcon size={12} />
                    <span>Trigger</span>
                  </div>

                  <ArrowRight size={10} color="#475569" />

                  {tpl.actions.map((act, index) => {
                    const actDef = ACTION_DEFINITIONS.find((d) => d.type === act.type);
                    const ActIcon = actDef?.icon ?? HelpCircle;
                    return (
                      <React.Fragment key={act.id}>
                        {index > 0 && <ArrowRight size={10} color="#475569" />}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            color: actDef?.color ?? '#94a3b8',
                            background: 'rgba(255,255,255,0.02)',
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <ActIcon size={12} />
                          <span>{actDef?.label ?? 'Action'}</span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Select Button */}
              <button
                type="button"
                onClick={() => onSelect(tpl.id)}
                aria-label={`Use template: ${tpl.name}`}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: 10,
                  border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : 'transparent',
                  color: isSelected ? '#fff' : '#cbd5e1',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  marginTop: 4,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }
                }}
              >
                {isSelected ? 'Selected' : 'Use Template'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
