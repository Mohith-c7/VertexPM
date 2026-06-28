'use client';

import React from 'react';
import { TRIGGER_CATEGORIES } from '../../constants';
import { Search, Filter, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface AutomationFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  activeCount: number;
  disabledCount: number;
  draftCount: number;
  totalCount: number;
}

export function AutomationFilter({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  activeCount,
  disabledCount,
  draftCount,
  totalCount,
}: AutomationFilterProps) {
  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
      }}
    >
      {/* Search Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label
          htmlFor="filter-search"
          style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.02em' }}
        >
          SEARCH RULES
        </label>
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            color="#64748b"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            id="filter-search"
            type="text"
            placeholder="Search rules..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search automation rules"
            style={{
              width: '100%',
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 10,
              padding: '10px 12px 10px 38px',
              color: '#fff',
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
        </div>
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.02em' }}>
          STATUS
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'all', label: 'All Rules', count: totalCount, icon: Filter, color: '#94a3b8' },
            { id: 'active', label: 'Active', count: activeCount, icon: CheckCircle2, color: '#10b981' },
            { id: 'disabled', label: 'Disabled', count: disabledCount, icon: Circle, color: '#64748b' },
            { id: 'draft', label: 'Draft', count: draftCount, icon: AlertCircle, color: '#f59e0b' },
          ].map((status) => {
            const isSelected = selectedStatus === status.id;
            const Icon = status.icon;
            return (
              <button
                key={status.id}
                onClick={() => onStatusChange(status.id)}
                aria-label={`Filter by status: ${status.label}`}
                aria-pressed={isSelected}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isSelected ? '#a5b4fc' : '#94a3b8',
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={15} color={isSelected ? '#6366f1' : status.color} />
                  <span>{status.label}</span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    color: isSelected ? '#a5b4fc' : '#64748b',
                    padding: '2px 6px',
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  {status.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trigger Category Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.02em' }}>
          TRIGGER CATEGORY
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => onCategoryChange('all')}
            aria-label="Filter by all categories"
            aria-pressed={selectedCategory === 'all'}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: 10,
              border: 'none',
              background: selectedCategory === 'all' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: selectedCategory === 'all' ? '#a5b4fc' : '#94a3b8',
              fontSize: 13,
              fontWeight: selectedCategory === 'all' ? 600 : 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            All Categories
          </button>
          {TRIGGER_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                aria-label={`Filter by category: ${category}`}
                aria-pressed={isSelected}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: 'none',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isSelected ? '#a5b4fc' : '#94a3b8',
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
