import React from 'react';
import { X, Sparkles } from 'lucide-react';

export const AiSidePanel = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl border-l border-slate-200 flex flex-col z-40 transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={18} />
          <h3 className="font-semibold text-slate-800">AI Assistant</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
        {children}
      </div>
    </div>
  );
};
