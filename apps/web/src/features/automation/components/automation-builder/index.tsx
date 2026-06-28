'use client';

import React, { useState } from 'react';
import { BUILDER_STEPS } from '../../constants';
import { RuleBuilder } from '../rule-builder';
import { AutomationRule, CreateAutomationRuleDto } from '../../types';
import { Zap, Sparkles, Sliders, Play, Settings, Check } from 'lucide-react';

interface AutomationBuilderProps {
  initialRule?: AutomationRule;
  onSave: (data: CreateAutomationRuleDto) => Promise<unknown>;
  onCancel: () => void;
}

const STEP_ICONS = [Sparkles, Zap, Sliders, Play, Settings];
const STEP_COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899'];

export function AutomationBuilder({ initialRule, onSave, onCancel }: AutomationBuilderProps) {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div
      style={{
        display: 'flex',
        background: '#090d16',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        minHeight: 650,
      }}
      className="max-md:flex-col max-md:fixed max-md:inset-0 max-md:z-50 max-md:rounded-none"
    >
      {/* Dark Sidebar progress indicator */}
      <div
        style={{
          width: 280,
          background: '#04060b',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
        className="max-md:w-full max-md:border-r-0 max-md:border-b max-md:p-16 max-md:flex-row max-md:overflow-x-auto max-md:gap-16 max-md:align-center"
      >
        <div className="max-md:hidden">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '0.02em' }}>
            RULE WIZARD
          </h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0 0' }}>
            Follow the steps to automate tasks
          </p>
        </div>

        {/* Vertical Step Progress List */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
          className="max-md:flex-row max-md:w-full max-md:justify-between max-md:gap-8"
        >
          {BUILDER_STEPS.map((s, idx) => {
            const IconComponent = STEP_ICONS[idx];
            const color = STEP_COLORS[idx];
            const isCompleted = activeStep > s.step;
            const isActive = activeStep === s.step;

            return (
              <div
                key={s.step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: isActive || isCompleted ? 1 : 0.4,
                  transition: 'opacity 0.2s ease',
                }}
                className="max-md:flex-col max-md:align-center max-md:gap-4 max-md:flex-1"
              >
                {/* Step Circle Icon */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: isActive
                      ? `${color}18`
                      : isCompleted
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isActive
                      ? `2px solid ${color}`
                      : isCompleted
                      ? '2px solid #10b981'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? color : isCompleted ? '#10b981' : '#64748b',
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 15px ${color}30` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCompleted ? <Check size={16} /> : <IconComponent size={15} />}
                </div>

                {/* Step Label & Desc */}
                <div className="max-md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isActive ? '#f8fafc' : isCompleted ? '#e2e8f0' : '#64748b',
                    }}
                  >
                    {s.label}
                  </span>
                  <span style={{ fontSize: 11, color: '#475569', lineHeight: 1.2 }}>
                    {s.description}
                  </span>
                </div>
                {/* Responsive Label */}
                <span
                  style={{ display: 'none', fontSize: 10, fontWeight: 700, color: isActive ? color : '#64748b' }}
                  className="max-md:block"
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps Editor Area */}
      <div
        style={{
          flex: 1,
          padding: '32px 40px',
          background: '#090d16',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        className="max-md:p-20 max-md:overflow-y-auto"
      >
        <div style={{ height: '100%' }}>
          <RuleBuilder
            initialRule={initialRule}
            onSave={onSave}
            onCancel={onCancel}
            onStepChange={setActiveStep}
          />
        </div>
      </div>
    </div>
  );
}
