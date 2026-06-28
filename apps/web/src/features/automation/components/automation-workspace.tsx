'use client';

import React, { useState } from 'react';
import { useAutomation } from '../hooks/use-automation';
import { AutomationDashboard } from './automation-dashboard';
import { AutomationList } from './automation-list';
import { AutomationBuilder } from './automation-builder';
import { ReminderManager } from './reminder-manager';
import { SchedulerDashboard } from './scheduler-dashboard';
import { ExecutionHistory } from './execution-history';
import { AutomationRule, CreateAutomationRuleDto } from '../types';
import { Zap, LayoutDashboard, Sliders, Clock, History, Bell, Plus, ArrowLeft } from 'lucide-react';

export function AutomationWorkspace() {
  const {
    rules,
    isLoading,
    savingId,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    fetchRules,
  } = useAutomation();

  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'scheduler' | 'history' | 'reminders'>('overview');
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleSaveRule = async (dto: CreateAutomationRuleDto) => {
    if (editingRule) {
      await updateRule(editingRule.id, dto);
      setEditingRule(null);
    } else {
      await createRule(dto);
      setIsCreating(false);
    }
    fetchRules();
  };

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setIsCreating(true);
    setActiveTab('rules');
  };

  const handleCancelBuilder = () => {
    setIsCreating(false);
    setEditingRule(null);
    setSelectedTemplateId(null);
  };

  const isWizardOpen = isCreating || editingRule !== null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: 16,
        padding: 24,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        minHeight: '100%',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Workspace Header */}
      {!isWizardOpen && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={22} color="#6366f1" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Automation Experience
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>
                Configure, trigger, and monitor automated work item actions and scheduled schedules.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <Plus size={16} />
            Create Rule
          </button>
        </div>
      )}

      {/* Main layout toggling between Wizard and Tab Dashboard */}
      {isWizardOpen ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleCancelBuilder}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                padding: '4px 8px',
              }}
            >
              <ArrowLeft size={14} />
              Back to Workspace
            </button>
            <span style={{ color: '#475569', fontSize: 13 }}>|</span>
            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
              {editingRule ? `Editing: ${editingRule.name}` : 'New Automation Rule'}
            </span>
          </div>

          <AutomationBuilder
            initialRule={editingRule || undefined}
            onSave={handleSaveRule}
            onCancel={handleCancelBuilder}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Navigation Bar tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              gap: 16,
              overflowX: 'auto',
              paddingBottom: 2,
            }}
          >
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'rules', label: 'Rules List', icon: Sliders },
              { id: 'scheduler', label: 'Job Scheduler', icon: Clock },
              { id: 'reminders', label: 'Reminders', icon: Bell },
              { id: 'history', label: 'Execution Logs', icon: History },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  type="button"
                  aria-label={`Open tab: ${tab.label}`}
                  aria-pressed={isSelected}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    border: 'none',
                    background: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                    color: isSelected ? '#a5b4fc' : '#64748b',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    borderBottom: isSelected ? '2px solid #6366f1' : '2px solid transparent',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.color = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.color = '#64748b';
                  }}
                >
                  <TabIcon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel contents */}
          <div style={{ minHeight: 400 }}>
            {activeTab === 'overview' && (
              <AutomationDashboard
                onNavigate={setActiveTab}
                onUseTemplate={handleUseTemplate}
              />
            )}

            {activeTab === 'rules' && (
              <AutomationList
                rules={rules}
                isLoading={isLoading}
                onToggle={toggleRule}
                onDelete={deleteRule}
                onEdit={setEditingRule}
                onCreateNew={() => setIsCreating(true)}
                savingId={savingId}
              />
            )}

            {activeTab === 'scheduler' && <SchedulerDashboard />}

            {activeTab === 'reminders' && <ReminderManager />}

            {activeTab === 'history' && <ExecutionHistory />}
          </div>
        </div>
      )}
    </div>
  );
}
