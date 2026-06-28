'use client';

import React from 'react';
import { AutomationStatus } from '../../types';

interface AutomationStatusBadgeProps {
  status: AutomationStatus | string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active: {
    label: 'Active',
    bg: 'rgba(16, 185, 129, 0.12)',
    text: '#10b981',
    dot: '#10b981',
  },
  disabled: {
    label: 'Disabled',
    bg: 'rgba(107, 114, 128, 0.12)',
    text: '#9ca3af',
    dot: '#9ca3af',
  },
  draft: {
    label: 'Draft',
    bg: 'rgba(245, 158, 11, 0.12)',
    text: '#f59e0b',
    dot: '#f59e0b',
  },
};

export function AutomationStatusBadge({ status, size = 'md' }: AutomationStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? 4 : 6,
        padding: isSmall ? '2px 8px' : '3px 10px',
        borderRadius: 20,
        backgroundColor: config.bg,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        color: config.text,
        letterSpacing: '0.02em',
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
      aria-label={`Status: ${config.label}`}
    >
      <span
        style={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: '50%',
          backgroundColor: config.dot,
          flexShrink: 0,
          boxShadow: `0 0 0 2px ${config.dot}30`,
        }}
      />
      {config.label}
    </span>
  );
}
