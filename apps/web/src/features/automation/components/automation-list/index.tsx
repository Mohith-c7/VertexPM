'use client';

import React, { useState, useMemo } from 'react';
import { AutomationRule } from '../../types';
import { AutomationCard } from '../automation-card';
import { AutomationFilter } from '../automation-filter';
import { AutomationEmpty } from '../automation-empty';
import { AutomationListSkeleton } from '../automation-loading';
import { Plus } from 'lucide-react';

interface AutomationListProps {
  rules: AutomationRule[];
  isLoading: boolean;
  onToggle: (id: string, enable: boolean) => void;
  onDelete: (id: string) => void;
  onEdit?: (rule: AutomationRule) => void;
  onCreateNew?: () => void;
  savingId?: string | null;
}

export function AutomationList({
  rules,
  isLoading,
  onToggle,
  onDelete,
  onEdit,
  onCreateNew,
  savingId,
}: AutomationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Compute stats
  const activeCount = useMemo(() => rules.filter((r) => r.status === 'active').length, [rules]);
  const disabledCount = useMemo(() => rules.filter((r) => r.status === 'disabled').length, [rules]);
  const draftCount = useMemo(() => rules.filter((r) => r.status === 'draft').length, [rules]);
  const totalCount = rules.length;

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      // Search match
      const nameMatch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rule.description && rule.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status match
      const statusMatch = selectedStatus === 'all' || rule.status === selectedStatus;

      // Category match
      let categoryMatch = true;
      if (selectedCategory !== 'all') {
        const triggerCategory = getTriggerCategory(rule.triggerType);
        categoryMatch = triggerCategory === selectedCategory;
      }

      return nameMatch && statusMatch && categoryMatch;
    });
  }, [rules, searchQuery, selectedStatus, selectedCategory]);

  function getTriggerCategory(type: string): string {
    switch (type) {
      case 'WORKITEM_CREATED':
      case 'WORKITEM_UPDATED':
      case 'WORKITEM_ASSIGNED':
      case 'WORKITEM_COMPLETED':
        return 'Work Items';
      case 'COMMENT_ADDED':
        return 'Communication';
      case 'DUE_DATE_REACHED':
      case 'REMINDER_TIME':
      case 'SCHEDULE':
        return 'Scheduling';
      default:
        return 'Other';
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: 24,
        alignItems: 'flex-start',
      }}
      className="max-md:grid-cols-1"
    >
      {/* Filters Sidebar */}
      <AutomationFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        activeCount={activeCount}
        disabledCount={disabledCount}
        draftCount={draftCount}
        totalCount={totalCount}
      />

      {/* Rules Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Rules ({filteredRules.length})
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>
              Create and manage automated actions triggered by workspace events.
            </p>
          </div>

          {onCreateNew && (
            <button
              onClick={onCreateNew}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
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
              New Rule
            </button>
          )}
        </div>

        {isLoading ? (
          <AutomationListSkeleton count={4} />
        ) : filteredRules.length === 0 ? (
          <AutomationEmpty
            title={rules.length === 0 ? 'No automation rules' : 'No matching rules'}
            description={
              rules.length === 0
                ? "Automations help save time by performing repetitive tasks for you. Let's create your first rule!"
                : 'Try adjusting your search query or filter options to find what you are looking for.'
            }
            action={
              rules.length === 0 && onCreateNew
                ? { label: 'Create First Rule', onClick: onCreateNew }
                : undefined
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredRules.map((rule) => (
              <AutomationCard
                key={rule.id}
                rule={rule}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                isSaving={savingId === rule.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
