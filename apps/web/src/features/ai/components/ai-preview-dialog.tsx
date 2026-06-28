import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Check, X, RefreshCw } from 'lucide-react';

interface AiPreviewDialogProps {
  originalText: string;
  suggestedText: string;
  isOpen: boolean;
  onApply: (text: string) => void;
  onDiscard: () => void;
  onRegenerate: () => void;
  isLoading?: boolean;
}

export const AiPreviewDialog: React.FC<AiPreviewDialogProps> = ({
  originalText,
  suggestedText,
  isOpen,
  onApply,
  onDiscard,
  onRegenerate,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
              <Sparkles size={18} />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">AI Suggestion</h2>
          </div>
          <button onClick={onDiscard} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="animate-spin text-purple-600" size={32} />
              <p className="text-slate-500 font-medium animate-pulse">Generating perfect suggestion...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original</div>
                <div className="bg-white p-4 rounded-lg border border-red-100 text-sm text-slate-600 min-h-[200px] whitespace-pre-wrap opacity-70">
                  {originalText || "No original content."}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                  <span className="text-green-600"><Check size={14}/></span>
                  <span className="text-green-600">Suggested</span>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200 text-sm text-slate-800 min-h-[200px] whitespace-pre-wrap shadow-sm ring-1 ring-green-50">
                  {suggestedText}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <Button 
            variant="outline" 
            onClick={onRegenerate} 
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>Regenerate</span>
          </Button>
          <div className="space-x-3 flex items-center">
            <Button variant="ghost" onClick={onDiscard} disabled={isLoading}>
              Discard
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2 shadow-md shadow-purple-500/20" 
              onClick={() => onApply(suggestedText)}
              disabled={isLoading || !suggestedText}
            >
              <Check size={16} />
              <span>Apply Changes</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
