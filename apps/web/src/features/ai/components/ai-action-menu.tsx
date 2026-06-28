import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Wand2, AlignLeft, CheckSquare, Zap, X } from 'lucide-react';
import { AiActionType } from '../actions';

interface AiActionMenuProps {
  onActionSelect: (action: AiActionType) => void;
  trigger?: React.ReactNode;
}

export const AiActionMenu: React.FC<AiActionMenuProps> = ({ onActionSelect, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions: { id: AiActionType; label: string; icon: React.ReactNode }[] = [
    { id: 'improve', label: 'Improve writing', icon: <Wand2 size={16} /> },
    { id: 'rewrite-description', label: 'Rewrite description', icon: <AlignLeft size={16} /> },
    { id: 'summarize', label: 'Summarize', icon: <AlignLeft size={16} /> },
    { id: 'checklist', label: 'Extract checklist', icon: <CheckSquare size={16} /> },
    { id: 'acceptance', label: 'Write acceptance criteria', icon: <CheckSquare size={16} /> },
    { id: 'estimate', label: 'Estimate effort', icon: <Zap size={16} /> },
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button type="button" className="flex items-center space-x-1 text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-purple-200 shadow-sm">
            <Sparkles size={16} />
            <span>AI Actions</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-1 flex justify-between items-center">
              <span>Ask AI</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
            {actions.map((action) => (
              <button
                key={action.id}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center space-x-2 transition-colors"
                role="menuitem"
                onClick={() => {
                  onActionSelect(action.id);
                  setIsOpen(false);
                }}
              >
                <span className="text-purple-500">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
