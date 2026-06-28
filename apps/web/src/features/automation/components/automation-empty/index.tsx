'use client';

import React from 'react';
import { Zap, Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AutomationEmpty({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        {icon ?? <Zap size={32} color="#6366f1" />}
      </div>
      <div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#e2e8f0',
            margin: '0 0 8px 0',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: '#64748b',
            maxWidth: 400,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            border: 'none',
            cursor: 'pointer',
            marginTop: 8,
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 6px 20px rgba(99, 102, 241, 0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 4px 15px rgba(99, 102, 241, 0.4)';
          }}
        >
          <Plus size={16} />
          {action.label}
        </button>
      )}
    </div>
  );
}

export function NoResultsEmpty() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '48px 24px',
        color: '#64748b',
        textAlign: 'center',
      }}
    >
      <Search size={28} color="#475569" />
      <p style={{ fontSize: 14, margin: 0, fontWeight: 500 }}>No results found</p>
      <p style={{ fontSize: 13, margin: 0 }}>Try adjusting your filters</p>
    </div>
  );
}
