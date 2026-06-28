import { useState, useEffect } from 'react';
import { fetchSearchResults } from '../services/search-api';
import { SearchResponse } from '../types';
import { SEARCH_DEBOUNCE_MS } from '../constants';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse>({ data: [], meta: { total: 0, took: 0 } });
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ data: [], meta: { total: 0, took: 0 } });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchSearchResults(debouncedQuery);
        if (isMounted) {
          setResults(response);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    debouncedQuery,
  };
};
