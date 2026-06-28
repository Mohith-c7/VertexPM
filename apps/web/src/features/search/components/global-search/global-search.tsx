import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { CommandPalette } from '../command-palette/command-palette';

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(open => !open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200 rounded-md transition-all duration-200 w-64 shadow-sm"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search VertexPM...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-sans font-medium bg-zinc-900 border border-zinc-700 rounded text-zinc-400 shadow-sm">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
