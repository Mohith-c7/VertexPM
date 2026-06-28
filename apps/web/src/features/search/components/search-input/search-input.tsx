import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (val: string) => void;
  onClear: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onValueChange, onClear, className = '', ...props }, ref) => {
    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <Search className="absolute left-4 w-5 h-5 text-zinc-400" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full bg-transparent border-none outline-none py-4 pl-12 pr-12 text-zinc-100 placeholder:text-zinc-500 text-lg"
          placeholder="Search for issues, projects, users..."
          autoComplete="off"
          spellCheck="false"
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
