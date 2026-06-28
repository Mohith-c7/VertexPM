'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import styles from './notification-search.module.css';

interface NotificationSearchProps {
  value: string;
  onChange: (search: string) => void;
  placeholder?: string;
}

export function NotificationSearch({
  value,
  onChange,
  placeholder = 'Search notifications...',
}: NotificationSearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(val);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={styles.searchWrapper}>
      <Search className={styles.searchIcon} aria-hidden="true" />
      <input
        type="text"
        value={localValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={styles.input}
        aria-label="Search notifications"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className={styles.clearBtn}
          aria-label="Clear search query"
        >
          <X className={styles.clearIcon} />
        </button>
      )}
    </div>
  );
}
