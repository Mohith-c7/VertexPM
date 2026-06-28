'use client';

import React from 'react';
import { Zap } from 'lucide-react';

// ─── Skeleton Shapes ──────────────────────────────────────────────────────────

const Skeleton = ({
  width,
  height = 16,
  borderRadius = 8,
  style,
}: {
  width?: string | number;
  height?: number;
  borderRadius?: number;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      width: width ?? '100%',
      height,
      borderRadius,
      background: 'linear-gradient(90deg, #1e293b 25%, #243045 50%, #1e293b 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonShimmer 1.5s ease-in-out infinite',
      ...style,
    }}
  />
);

// ─── Stats Card Skeleton ──────────────────────────────────────────────────────

export function StatsCardSkeleton() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Skeleton width={80} height={13} />
        <Skeleton width={36} height={36} borderRadius={10} />
      </div>
      <Skeleton width={60} height={32} />
      <Skeleton width={100} height={12} />
    </div>
  );
}

// ─── Automation Card Skeleton ─────────────────────────────────────────────────

export function AutomationCardSkeleton() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Skeleton width={40} height={40} borderRadius={12} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton width={160} height={14} />
            <Skeleton width={100} height={11} />
          </div>
        </div>
        <Skeleton width={60} height={22} borderRadius={20} />
      </div>
      <Skeleton width="70%" height={12} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Skeleton width={80} height={24} borderRadius={12} />
        <Skeleton width={80} height={24} borderRadius={12} />
      </div>
    </div>
  );
}

// ─── Table Row Skeleton ───────────────────────────────────────────────────────

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <Skeleton width={i === 0 ? '80%' : '60%'} height={13} />
        </td>
      ))}
    </tr>
  );
}

// ─── Automation List Skeleton ─────────────────────────────────────────────────

export function AutomationListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <AutomationCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Dashboard Skeleton ───────────────────────────────────────────────────────

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)}
      </div>
      <AutomationListSkeleton count={3} />
    </div>
  );
}

// ─── Full Page Loading ────────────────────────────────────────────────────────

export function AutomationPageLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 16,
        color: '#94a3b8',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
      `}</style>
      <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
        <Zap size={32} color="#6366f1" />
      </div>
      <p style={{ fontSize: 14, color: '#64748b' }}>Loading automation...</p>
    </div>
  );
}
