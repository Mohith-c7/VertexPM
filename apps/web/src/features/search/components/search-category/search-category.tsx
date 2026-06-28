import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SearchCategoryData, SearchResult } from '../../types';
import { SearchResultCard } from '../search-result-card/search-result-card';

interface SearchCategoryProps {
  category: SearchCategoryData;
  query: string;
  selectedIndex: number;
  globalStartIndex: number;
  onSelect: (result: SearchResult) => void;
  onItemMouseEnter: (globalIndex: number) => void;
}

export const SearchCategory: React.FC<SearchCategoryProps> = ({
  category,
  query,
  selectedIndex,
  globalStartIndex,
  onSelect,
  onItemMouseEnter,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (category.results.length === 0) return null;

  return (
    <div className="mb-4 last:mb-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center w-full px-2 py-1.5 mb-1 text-xs font-semibold tracking-wider text-zinc-400 hover:text-zinc-300 transition-colors"
      >
        <span className="flex-shrink-0 mr-1.5">
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
        <span className="uppercase">{category.label}</span>
        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-zinc-800 text-[10px]">
          {category.results.length}
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-1">
          {category.results.map((result, idx) => {
            const currentGlobalIndex = globalStartIndex + idx;
            return (
              <SearchResultCard
                key={result.id}
                result={result}
                query={query}
                isSelected={selectedIndex === currentGlobalIndex}
                onSelect={onSelect}
                onMouseEnter={() => onItemMouseEnter(currentGlobalIndex)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
