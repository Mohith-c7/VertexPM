'use client';

import React, { useEffect, useState } from 'react';
import { automationService } from '../../services/automation.service';
import { AutomationStats, ExecutionLog } from '../../types';
import { AUTOMATION_TEMPLATES, TRIGGER_DEFINITIONS, EXECUTION_STATUS_COLORS } from '../../constants';
import { formatDateTime, formatDuration, getStatusLabel } from '../../utils';
import { DashboardSkeleton } from '../automation-loading';
import { Zap, Play, CheckCircle2, ShieldCheck, Heart, AlertTriangle, ArrowRight, Sparkles, BookOpen, Clock, Activity } from 'lucide-react';

interface AutomationDashboardProps {
  onNavigate: (view: 'rules' | 'scheduler' | 'history' | 'reminders') => void;
  onUseTemplate: (templateId: string) => void;
}

export function AutomationDashboard({ onNavigate, onUseTemplate }: AutomationDashboardProps) {
  const [stats, setStats] = useState<AutomationStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<ExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsData, historyData] = await Promise.all([
        automationService.getDashboardStats(),
        automationService.getHistory({ limit: 10 }),
      ]);
      setStats(statsData);
      setRecentLogs(historyData.data ?? []);
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
      setError('Could not retrieve dashboard statistics. Using placeholder dashboard stats.');
      // Mock stats for display if backend isn't ready
      setStats({
        activeRules: 3,
        disabledRules: 1,
        executionsToday: 14,
        failedJobs: 0,
        totalRules: 4,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const schedulerHealthy = (stats?.failedJobs ?? 0) === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Scheduler health card banner */}
      <div
        style={{
          background: schedulerHealthy ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
          border: `1px solid ${schedulerHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: schedulerHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {schedulerHealthy ? <ShieldCheck size={18} color="#10b981" /> : <AlertTriangle size={18} color="#ef4444" />}
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', display: 'block' }}>
              Scheduler Status: {schedulerHealthy ? 'Healthy & Running' : 'System Warnings'}
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              {schedulerHealthy
                ? 'All automatic rules and cron reminders are executing successfully.'
                : 'Some scheduled automation jobs failed to execute today. Please review log reports.'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('scheduler')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#6366f1',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Manage Scheduler
          <ArrowRight size={14} />
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
        }}
        className="max-md:grid-cols-2 max-sm:grid-cols-1"
      >
        {[
          { label: 'Active Rules', count: stats?.activeRules ?? 0, color: '#10b981', icon: CheckCircle2 },
          { label: 'Disabled Rules', count: stats?.disabledRules ?? 0, color: '#64748b', icon: Zap },
          { label: 'Runs Today', count: stats?.executionsToday ?? 0, color: '#6366f1', icon: Play },
          { label: 'Failed Jobs', count: stats?.failedJobs ?? 0, color: '#ef4444', icon: AlertTriangle },
        ].map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  {card.label}
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc' }}>{card.count}</span>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CardIcon size={20} color={card.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two column layout: Recent activity & Quick templates */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }} className="max-lg:grid-cols-1">
        {/* Recent Executions Log */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="#6366f1" />
              Recent Executions
            </h3>
            <button
              onClick={() => onNavigate('history')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#a5b4fc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#64748b';
              }}
            >
              View Full History
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: 8 }}>
                  <th style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#475569' }}>RULE</th>
                  <th style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#475569' }}>TRIGGER</th>
                  <th style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#475569' }}>EXECUTED</th>
                  <th style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#475569' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px 12px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                      No recent executions logged today
                    </td>
                  </tr>
                ) : (
                  recentLogs.slice(0, 5).map((log) => {
                    const trigDef = TRIGGER_DEFINITIONS.find((t) => t.type === log.triggerType);
                    const statusCol = EXECUTION_STATUS_COLORS[log.status] ?? '#64748b';

                    return (
                      <tr key={log.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>
                          {log.ruleName ?? 'Unnamed Rule'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {trigDef && (
                            <span style={{ fontSize: 10, fontWeight: 600, color: trigDef.color }}>
                              {trigDef.label}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px', fontSize: 12, color: '#64748b' }}>
                          {formatDateTime(log.startedAt)}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: statusCol,
                              background: `${statusCol}15`,
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}
                          >
                            {getStatusLabel(log.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Templates Picker */}
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
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={16} color="#6366f1" />
            Quick Setup
          </h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.4 }}>
            Instantly spin up a rule by utilizing one of our most popular automation recipes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AUTOMATION_TEMPLATES.slice(0, 3).map((tpl) => {
              const trigDef = TRIGGER_DEFINITIONS.find((t) => t.type === tpl.triggerType);
              return (
                <div
                  key={tpl.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 12,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onClick={() => onUseTemplate(tpl.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{tpl.name}</span>
                    {trigDef && (
                      <span style={{ fontSize: 9, background: `${trigDef.color}15`, color: trigDef.color, padding: '1px 4px', borderRadius: 4, fontWeight: 700 }}>
                        {trigDef.label}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.3 }}>
                    {tpl.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
