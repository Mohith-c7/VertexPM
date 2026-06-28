'use client';

import React, { useEffect } from 'react';
import { useAutomationBuilder } from '../../hooks/use-automation-builder';
import { CreateAutomationRuleDto, AutomationRule } from '../../types';
import { TriggerSelector } from '../trigger-selector';
import { TriggerCard } from '../trigger-card';
import { ConditionBuilder } from '../condition-builder';
import { ActionBuilder } from '../action-builder';
import { AutomationTemplateGallery } from '../automation-template';
import { ArrowLeft, ArrowRight, Save, X, Eye } from 'lucide-react';
import { validateAutomationRule, ValidationError, getFieldError } from '../../validation';

interface RuleBuilderProps {
  initialRule?: AutomationRule;
  onSave: (data: CreateAutomationRuleDto) => Promise<unknown>;
  onCancel: () => void;
  onStepChange?: (step: number) => void;
}

export function RuleBuilder({ initialRule, onSave, onCancel, onStepChange }: RuleBuilderProps) {
  const {
    state,
    canProceed,
    setStep,
    nextStep,
    prevStep,
    setName,
    setDescription,
    setStatus,
    setTriggerType,
    updateTriggerConfig,
    addConditionGroup,
    removeConditionGroup,
    updateGroupLogic,
    addCondition,
    removeCondition,
    updateCondition,
    addAction,
    removeAction,
    updateAction,
    updateActionConfig,
    applyTemplate,
    clearTemplate,
  } = useAutomationBuilder(
    initialRule
      ? {
          name: initialRule.name,
          description: initialRule.description || '',
          status: initialRule.status,
          triggerType: initialRule.triggerType,
          triggerConfig: initialRule.triggerConfig,
          conditionGroups: initialRule.conditionGroups,
          actions: initialRule.actions,
          step: 2, // Start directly at trigger step for editing
        }
      : undefined
  );

  const [validationErrors, setValidationErrors] = React.useState<ValidationError[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  // Synchronize step index with parent
  useEffect(() => {
    if (onStepChange) {
      onStepChange(state.step);
    }
  }, [state.step, onStepChange]);

  // Validate on name change at step 5
  useEffect(() => {
    if (state.step === 5) {
      const errs = validateAutomationRule(state as CreateAutomationRuleDto);
      setValidationErrors(errs);
    }
  }, [state.name, state.actions, state.triggerType, state.step]);

  const handleSave = async () => {
    const errs = validateAutomationRule(state as CreateAutomationRuleDto);
    setValidationErrors(errs);

    if (errs.length > 0) return;

    try {
      setIsSaving(true);
      await onSave({
        name: state.name,
        description: state.description,
        status: state.status,
        triggerType: state.triggerType as string as any,
        triggerConfig: state.triggerConfig,
        conditionGroups: state.conditionGroups,
        actions: state.actions,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const getStepTitle = () => {
    switch (state.step) {
      case 1:
        return 'Choose a template or start from scratch';
      case 2:
        return 'Configure Trigger';
      case 3:
        return 'Define Conditions (Optional)';
      case 4:
        return 'Configure Actions';
      case 5:
        return 'Summary & Save';
      default:
        return '';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        height: '100%',
        minHeight: 500,
        justifyContent: 'space-between',
      }}
    >
      {/* Scrollable Step Content Container */}
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            {getStepTitle()}
          </h3>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>
            Step {state.step} of 5
          </p>
        </div>

        {/* Dynamic Step Views */}
        {state.step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <AutomationTemplateGallery
              onSelect={(tplId) => {
                applyTemplate(tplId);
                nextStep();
              }}
              selectedTemplateId={state.selectedTemplateId}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '12px 0',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', width: '100%', height: 1, background: 'rgba(255, 255, 255, 0.06)' }} />
              <span
                style={{
                  position: 'relative',
                  background: '#0f172a',
                  padding: '0 16px',
                  color: '#475569',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                clearTemplate();
                nextStep();
              }}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = '#6366f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              Start from Scratch (Blank Canvas)
            </button>
          </div>
        )}

        {state.step === 2 && (
          <div>
            {!state.triggerType ? (
              <TriggerSelector selectedType={state.triggerType} onSelect={setTriggerType} />
            ) : (
              <TriggerCard
                type={state.triggerType}
                config={state.triggerConfig}
                onChange={updateTriggerConfig}
                onClear={() => setTriggerType('')}
              />
            )}
          </div>
        )}

        {state.step === 3 && (
          <ConditionBuilder
            groups={state.conditionGroups}
            onAddGroup={addConditionGroup}
            onRemoveGroup={removeConditionGroup}
            onUpdateGroupLogic={updateGroupLogic}
            onAddCondition={addCondition}
            onRemoveCondition={removeCondition}
            onUpdateCondition={updateCondition}
          />
        )}

        {state.step === 4 && (
          <ActionBuilder
            actions={state.actions}
            onAddAction={addAction}
            onRemoveAction={removeAction}
            onUpdateAction={updateAction}
            onUpdateActionConfig={updateActionConfig}
          />
        )}

        {state.step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Save details form */}
            <div
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="rule-name" style={{ fontSize: 13, fontWeight: 500, color: '#cbd5e1' }}>
                  Rule Name *
                </label>
                <input
                  id="rule-name"
                  type="text"
                  placeholder="e.g. Auto Assign Bugs to On-Call Lead"
                  value={state.name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={!!getFieldError(validationErrors, 'name')}
                  aria-describedby="rule-name-error"
                  style={{
                    background: '#0f172a',
                    border: `1px solid ${getFieldError(validationErrors, 'name') ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: 10,
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />
                {getFieldError(validationErrors, 'name') && (
                  <span id="rule-name-error" style={{ fontSize: 12, color: '#ef4444' }}>
                    {getFieldError(validationErrors, 'name')}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="rule-desc" style={{ fontSize: 13, fontWeight: 500, color: '#cbd5e1' }}>
                  Description (Optional)
                </label>
                <textarea
                  id="rule-desc"
                  rows={3}
                  placeholder="Describe what this rule does and why it was created..."
                  value={state.description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 10,
                    padding: '10px 12px',
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Enable toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Enable Rule Immediately</span>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0 0' }}>
                    Turn this rule active. It will start running as soon as you save.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus(state.status === 'active' ? 'disabled' : 'active')}
                  aria-checked={state.status === 'active'}
                  role="switch"
                  aria-label="Enable rule immediately toggle"
                  style={{
                    width: 50,
                    height: 26,
                    borderRadius: 15,
                    background: state.status === 'active' ? '#6366f1' : '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      left: state.status === 'active' ? 26 : 4,
                      transition: 'left 0.2s ease',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Validation errors banner */}
            {validationErrors.length > 0 && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 12,
                  padding: 16,
                  color: '#ef4444',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                  Please resolve the following errors:
                </span>
                <ul style={{ fontSize: 13, margin: 0, paddingLeft: 20 }}>
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 10,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <X size={15} />
          Cancel
        </button>

        <div style={{ display: 'flex', gap: 12 }}>
          {state.step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#cbd5e1',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={15} />
              Back
            </button>
          )}

          {state.step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 10,
                background: canProceed ? '#6366f1' : '#1e293b',
                color: canProceed ? '#fff' : '#475569',
                fontWeight: 600,
                fontSize: 13,
                border: 'none',
                cursor: canProceed ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
            >
              Next
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || validationErrors.length > 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                border: 'none',
                cursor: isSaving || validationErrors.length > 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Save size={15} />
              {isSaving ? 'Saving...' : 'Save Rule'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
