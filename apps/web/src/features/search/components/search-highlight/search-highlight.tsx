import React from 'react';

interface SearchHighlightProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

export const SearchHighlight: React.FC<SearchHighlightProps> = ({ 
  text, 
  query, 
  className = '', 
  highlightClassName = 'bg-blue-500/20 text-blue-400 font-medium rounded-sm px-0.5' 
}) => {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className={`bg-transparent ${highlightClassName}`}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};
