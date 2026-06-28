import { useState, useEffect } from 'react';
import { SearchHistoryItem } from '../types';
import { SEARCH_HISTORY_KEY, MAX_SEARCH_HISTORY } from '../constants';

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load search history', e);
    }
  }, []);

  const addHistoryItem = (query: string) => {
    if (!query.trim()) return;
    
    setHistory(prev => {
      const newId = Date.now().toString();
      // Remove existing item with same query to move it to top
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      const pinned = prev.filter(item => item.pinned);
      const unpinned = filtered.filter(item => !item.pinned);
      
      const newItem: SearchHistoryItem = {
        id: newId,
        query,
        timestamp: Date.now(),
        pinned: false,
      };

      const newHistory = [...pinned, newItem, ...unpinned].slice(0, MAX_SEARCH_HISTORY);
      
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save search history', e);
      }
      
      return newHistory;
    });
  };

  const togglePin = (id: string) => {
    setHistory(prev => {
      const newHistory = prev.map(item => 
        item.id === id ? { ...item, pinned: !item.pinned } : item
      );
      
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save search history', e);
      }
      
      return newHistory;
    });
  };

  const removeItem = (id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save search history', e);
      }
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory(prev => {
      const pinnedOnly = prev.filter(item => item.pinned);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(pinnedOnly));
      } catch (e) {
        console.error('Failed to save search history', e);
      }
      return pinnedOnly;
    });
  };

  return {
    history,
    addHistoryItem,
    togglePin,
    removeItem,
    clearHistory
  };
};
