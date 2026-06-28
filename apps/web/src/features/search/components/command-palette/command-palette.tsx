import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SearchOverlay } from '../search-overlay/search-overlay';
import { SearchInput } from '../search-input/search-input';
import { SearchResults } from '../search-results/search-results';
import { useSearch } from '../../hooks/use-search';
import { useSearchHistory } from '../../hooks/use-search-history';
import { handleKeyboardNavigation } from '../../utils/keyboard-navigation';
import { SearchResult } from '../../types';
import { Clock, Star, Trash2 } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { query, setQuery, results, isLoading, debouncedQuery } = useSearch();
  const { history, addHistoryItem, togglePin, removeItem, clearHistory } = useSearchHistory();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen, setQuery]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results, query]);

  const flatResults = useMemo(() => {
    return results.data.flatMap(category => category.results);
  }, [results]);

  const itemCount = query.trim() ? flatResults.length : history.length;

  const handleSelect = (result: SearchResult) => {
    addHistoryItem(query || result.title); // Store query or selected title
    onClose();
    // In a real app, this would route to the result.url
    console.log('Selected:', result);
  };

  const handleHistorySelect = (query: string) => {
    setQuery(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyboardNavigation(e, {
      itemCount,
      selectedIndex,
      onSelectIndex: setSelectedIndex,
      onEnter: (index) => {
        if (query.trim()) {
          const result = flatResults[index];
          if (result) handleSelect(result);
        } else {
          const item = history[index];
          if (item) handleHistorySelect(item.query);
        }
      },
      onEscape: onClose,
    });
  };

  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
          <p className="text-sm">No recent searches</p>
        </div>
      );
    }

    return (
      <div className="px-2 py-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Recent Searches</span>
          <button 
            onClick={clearHistory}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="space-y-1">
          {history.map((item, index) => (
            <div
              key={item.id}
              role="option"
              aria-selected={selectedIndex === index}
              className={`group flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg transition-colors ${
                selectedIndex === index ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'
              }`}
              onClick={() => handleHistorySelect(item.query)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-100">{item.query}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(item.id);
                  }}
                  className={`p-1.5 rounded-md transition-colors ${
                    item.pinned ? 'text-amber-400 opacity-100' : 'text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" fill={item.pinned ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="p-1.5 rounded-md text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SearchOverlay isOpen={isOpen} onClose={onClose}>
      <div 
        className="flex flex-col max-h-[70vh]"
        onKeyDown={handleKeyDown}
      >
        <div className="border-b border-zinc-800">
          <SearchInput
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            onClear={() => setQuery('')}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[300px]">
          {query.trim() ? (
            <SearchResults
              results={results}
              query={debouncedQuery}
              isLoading={isLoading}
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
              onItemMouseEnter={setSelectedIndex}
            />
          ) : (
            renderHistory()
          )}
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-t border-zinc-800 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-sans text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-sans text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-sans text-[10px]">Enter</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-sans text-[10px]">Esc</kbd>
              <span>to close</span>
            </span>
          </div>
        </div>
      </div>
    </SearchOverlay>
  );
};
