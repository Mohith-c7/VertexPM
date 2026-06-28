import React from 'react';
import { SearchResponse, SearchResult } from '../../types';
import { SearchCategory } from '../search-category/search-category';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResponse;
  query: string;
  isLoading: boolean;
  selectedIndex: number;
  onSelect: (result: SearchResult) => void;
  onItemMouseEnter: (index: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading,
  selectedIndex,
  onSelect,
  onItemMouseEnter,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin mb-3 text-zinc-400" />
        <p className="text-sm">Searching...</p>
      </div>
    );
  }

  const isEmpty = results.data.length === 0 || results.data.every(c => c.results.length === 0);

  if (query && isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
        <p className="text-sm">No results found for "{query}"</p>
        <p className="text-xs text-zinc-500 mt-1">Try searching for something else</p>
      </div>
    );
  }

  let globalStartIndex = 0;

  return (
    <div className="px-2 py-4">
      {results.data.map((category) => {
        const categoryStartIndex = globalStartIndex;
        globalStartIndex += category.results.length;
        
        return (
          <SearchCategory
            key={category.id}
            category={category}
            query={query}
            selectedIndex={selectedIndex}
            globalStartIndex={categoryStartIndex}
            onSelect={onSelect}
            onItemMouseEnter={onItemMouseEnter}
          />
        );
      })}
    </div>
  );
};
