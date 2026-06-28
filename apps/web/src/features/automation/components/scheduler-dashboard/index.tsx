'use client';

import React from 'react';
import { useScheduler } from '../../hooks/use-scheduler';
import { ScheduledJobCard } from '../scheduled-job-card';
import { Clock, RefreshCw, AlertCircle, ShieldCheck, Heart, Zap } from 'lucide-react';

export function SchedulerDashboard() {
  // Automatically refreshes every 30 seconds
  const {
    jobs,
    pendingJobs,
    runningJobs,
    failedJobs,
    isLoading,
    error,
    runningJobId,
    fetchJobs,
    runJob,
    cancelJob,
  } = useScheduler(30000);

  const getSchedulerHealth = () => {
    if (failedJobs.length > 0) return { label: 'System Warnings', color: '#f59e0b', text: 'Some jobs failed to execute. Review logs.' };
    return { label: 'Healthy', color: '#10b981', text: 'All jobs running normally. Next scheduled runs are pending.' };
  };

  const health = getSchedulerHealth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header bar with Health Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            Job Scheduler Dashboard
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>
            Monitor and run scheduled automation background jobs in real-time.
          </p>
        </div>

        {/* Health status badge */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: health.color,
              boxShadow: `0 0 10px ${health.color}`,
            }}
          />
          <div>
            <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>SCHEDULER STATUS</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{health.label}</span>
          </div>
        </div>
      </div>

      {/* Quick stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="max-md:grid-columns-2 max-sm:grid-cols-1">
        {[
          { label: 'Total Jobs', count: jobs.length, color: '#6366f1', icon: Zap },
          { label: 'Pending Jobs', count: pendingJobs.length, color: '#f59e0b', icon: Clock },
          { label: 'Running Jobs', count: runningJobs.length, color: '#3b82f6', icon: RefreshCw },
          { label: 'Failed Jobs', count: failedJobs.length, color: '#ef4444', icon: AlertCircle },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{stat.label}</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc' }}>{stat.count}</span>
              </div>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduler description and health details */}
      <div
        style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: 12,
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <ShieldCheck size={20} color="#6366f1" />
        <p style={{ fontSize: 13, color: '#a5b4fc', margin: 0 }}>
          {health.text} The scheduler automatically refreshes state every 30 seconds to fetch job metrics.
        </p>
      </div>

      {/* Jobs list grid */}
      {isLoading ? (
        <div style={{ padding: '40px 0', textContent: 'center', color: '#64748b', textAlign: 'center' } as React.CSSProperties}>
          <RefreshCw size={24} className="animate-spin" style={{ display: 'block', margin: '0 auto 10px auto' }} />
          Loading scheduled jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div
          style={{
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 48,
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          <Clock size={32} style={{ display: 'block', margin: '0 auto 12px auto', color: '#475569' }} />
          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', margin: '0 0 6px 0' }}>No Scheduled Jobs</h4>
          <p style={{ fontSize: 13, margin: 0 }}>
            Scheduled background jobs will appear here once scheduler triggers are active.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {jobs.map((job) => (
            <ScheduledJobCard
              key={job.id}
              job={job}
              onRun={runJob}
              onCancel={cancelJob}
              isProcessing={runningJobId === job.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
