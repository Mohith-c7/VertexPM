'use client';

import React, { useState } from 'react';
import { useReminders } from '../../hooks/use-reminders';
import { CreateReminderDto, Reminder } from '../../types';
import { validateReminder, ValidationError, getFieldError } from '../../validation';
import { formatDateTime } from '../../utils';
import { Bell, Plus, Trash2, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { REMINDER_TYPE_OPTIONS, ENTITY_TYPE_OPTIONS } from '../../constants';

export function ReminderManager() {
  const {
    reminders,
    upcomingReminders,
    overdueReminders,
    completedReminders,
    isLoading,
    error: apiError,
    savingId,
    createReminder,
    deleteReminder,
  } = useReminders();

  // Create form state
  const [entityType, setEntityType] = useState('WORK_ITEM');
  const [entityId, setEntityId] = useState('');
  const [type, setType] = useState('CUSTOM');
  const [message, setMessage] = useState('');
  const [remindAt, setRemindAt] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Selected tab for list grouping
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'OVERDUE' | 'COMPLETED'>('UPCOMING');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: CreateReminderDto = {
      entityType,
      entityId,
      type: type as any,
      message,
      remindAt,
    };

    const errs = validateReminder(data);
    setValidationErrors(errs);

    if (errs.length > 0) return;

    const created = await createReminder(data);
    if (created) {
      // Clear form
      setEntityId('');
      setMessage('');
      setRemindAt('');
      setValidationErrors([]);
    }
  };

  const getRemindersList = () => {
    switch (activeTab) {
      case 'UPCOMING':
        return upcomingReminders;
      case 'OVERDUE':
        return overdueReminders;
      case 'COMPLETED':
        return completedReminders;
      default:
        return [];
    }
  };

  const currentList = getRemindersList();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: 24,
        alignItems: 'flex-start',
      }}
      className="max-md:grid-cols-1"
    >
      {/* Left panel: Create Form */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} color="#6366f1" />
          Create Reminder
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
          Schedule a push reminder tied to a work item, project, or workspace entity.
        </p>

        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Entity Type selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="reminder-entity-type" style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
              ENTITY TYPE
            </label>
            <select
              id="reminder-entity-type"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                padding: '8px 10px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
              }}
            >
              {ENTITY_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Entity ID text input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="reminder-entity-id" style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
              ENTITY ID *
            </label>
            <input
              id="reminder-entity-id"
              type="text"
              placeholder="e.g. task-123, proj-45"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              aria-invalid={!!getFieldError(validationErrors, 'entityId')}
              style={{
                background: '#0f172a',
                border: `1px solid ${getFieldError(validationErrors, 'entityId') ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 8,
                padding: '8px 10px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
              }}
            />
            {getFieldError(validationErrors, 'entityId') && (
              <span style={{ fontSize: 11, color: '#ef4444' }}>{getFieldError(validationErrors, 'entityId')}</span>
            )}
          </div>

          {/* Reminder Type Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="reminder-type" style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
              REMINDER TYPE
            </label>
            <select
              id="reminder-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                padding: '8px 10px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
              }}
            >
              {REMINDER_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Message input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="reminder-message" style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
              MESSAGE (OPTIONAL)
            </label>
            <input
              id="reminder-message"
              type="text"
              placeholder="e.g. Finish reviewing dashboard PR"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                padding: '8px 10px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          {/* Remind At datetime */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="reminder-remind-at" style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>
              REMIND AT (DATETIME) *
            </label>
            <input
              id="reminder-remind-at"
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              aria-invalid={!!getFieldError(validationErrors, 'remindAt')}
              style={{
                background: '#0f172a',
                border: `1px solid ${getFieldError(validationErrors, 'remindAt') ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 8,
                padding: '8px 10px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
              }}
            />
            {getFieldError(validationErrors, 'remindAt') && (
              <span style={{ fontSize: 11, color: '#ef4444' }}>{getFieldError(validationErrors, 'remindAt')}</span>
            )}
          </div>

          {/* Form validation alerts */}
          {apiError && (
            <div style={{ fontSize: 12, color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: 8, borderRadius: 6 }}>
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={savingId === 'new'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              border: 'none',
              cursor: savingId === 'new' ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.25)',
              marginTop: 6,
            }}
          >
            <Plus size={14} />
            {savingId === 'new' ? 'Creating...' : 'Create Reminder'}
          </button>
        </form>
      </div>

      {/* Right panel: Grouped Lists */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: 2,
            gap: 12,
          }}
        >
          {([
            { id: 'UPCOMING', label: 'Upcoming', count: upcomingReminders.length, icon: Clock, color: '#6366f1' },
            { id: 'OVERDUE', label: 'Overdue', count: overdueReminders.length, icon: AlertTriangle, color: '#ef4444' },
            { id: 'COMPLETED', label: 'Completed', count: completedReminders.length, icon: CheckCircle, color: '#10b981' },
          ] as const).map((tab) => {
            const isSelected = activeTab === tab.id;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                aria-label={`Show ${tab.label} reminders`}
                aria-pressed={isSelected}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  border: 'none',
                  background: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                  color: isSelected ? '#fff' : '#64748b',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderBottom: isSelected ? `2px solid ${tab.color}` : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  transition: 'all 0.15s ease',
                }}
              >
                <TabIcon size={14} color={isSelected ? tab.color : '#64748b'} />
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    background: isSelected ? `${tab.color}25` : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#fff' : '#64748b',
                    padding: '1px 6px',
                    borderRadius: 10,
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Reminders list area */}
        {isLoading ? (
          <div style={{ padding: '40px 0', textContent: 'center', color: '#64748b', textAlign: 'center' } as React.CSSProperties}>
            Loading reminders list...
          </div>
        ) : currentList.length === 0 ? (
          <div
            style={{
              border: '1px dashed rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 48,
              textAlign: 'center',
              color: '#64748b',
            }}
          >
            <Calendar size={28} style={{ display: 'block', margin: '0 auto 10px auto', color: '#475569' }} />
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', margin: '0 0 4px 0' }}>
              No {activeTab.toLowerCase()} reminders
            </h4>
            <p style={{ fontSize: 13, margin: 0 }}>
              Use the form on the left to schedule a new reminder.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentList.map((rem) => {
              const isDeleting = savingId === rem.id;

              return (
                <div
                  key={rem.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: isDeleting ? 0.6 : 1,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                      {rem.message || 'Push reminder scheduled'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#a5b4fc',
                          background: 'rgba(99, 102, 241, 0.1)',
                          padding: '1px 6px',
                          borderRadius: 4,
                        }}
                      >
                        {rem.entityType}: {rem.entityId}
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>
                        Remind at: {formatDateTime(rem.remindAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Mark Complete / Delete */}
                  {rem.status !== 'COMPLETED' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      {/* Mark Complete button (calls delete under the hood since API is delete only) */}
                      <button
                        onClick={() => deleteReminder(rem.id)}
                        disabled={isDeleting}
                        title="Mark complete / Clear reminder"
                        aria-label="Mark complete"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: 'none',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircle size={14} />
                      </button>

                      {/* Cancel / Delete */}
                      <button
                        onClick={() => deleteReminder(rem.id)}
                        disabled={isDeleting}
                        title="Delete reminder"
                        aria-label="Delete reminder"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
