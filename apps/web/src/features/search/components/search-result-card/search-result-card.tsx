import React from 'react';
import { SearchResult } from '../../types';
import { SearchHighlight } from '../search-highlight/search-highlight';
import { FileText, CheckCircle2, User, Layout, ArrowRight, Link as LinkIcon } from 'lucide-react';

interface SearchResultCardProps {
  result: SearchResult;
  query: string;
  isSelected: boolean;
  onSelect: (result: SearchResult) => void;
  onMouseEnter: () => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  query,
  isSelected,
  onSelect,
  onMouseEnter,
}) => {
  const getIcon = () => {
    switch (result.type) {
      case 'issue':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'project':
        return <Layout className="w-4 h-4 text-indigo-500" />;
      case 'user':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'document':
      default:
        return <FileText className="w-4 h-4 text-zinc-400" />;
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + result.url);
    // In a real app, you might show a toast here
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      className={`group flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg transition-colors ${
        isSelected ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'
      }`}
      onClick={() => onSelect(result)}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-start gap-3 overflow-hidden flex-1">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium text-zinc-100 truncate">
            <SearchHighlight text={result.title} query={query} />
          </span>
          {result.description && (
            <span className="text-xs text-zinc-400 truncate mt-0.5">
              <SearchHighlight text={result.description} query={query} />
            </span>
          )}
        </div>
      </div>
      
      {isSelected && (
        <div className="flex-shrink-0 ml-4 hidden group-hover:flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors tooltip-trigger"
            title="Copy Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center text-xs text-zinc-500 gap-1 px-1.5 py-1 rounded bg-zinc-900 border border-zinc-700">
            <span>Enter to open</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
};
