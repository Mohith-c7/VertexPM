import React from 'react';
import { Plus, X, Sparkles } from 'lucide-react';

interface AiSuggestionCardProps {
  title: string;
  description: string;
  type?: string;
  onAccept: () => void;
  onReject: () => void;
}

export const AiSuggestionCard: React.FC<AiSuggestionCardProps> = ({
  title,
  description,
  type = 'Story',
  onAccept,
  onReject
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple-500" />
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">{type}</span>
        </div>
        <button onClick={onReject} className="text-slate-400 hover:text-slate-600">
          <X size={16} />
        </button>
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{description}</p>
      <div className="flex justify-end">
        <button 
          onClick={onAccept}
          className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded shadow-sm transition-colors"
        >
          <Plus size={14} />
          Add to Board
        </button>
      </div>
    </div>
  );
};
