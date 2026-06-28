import React, { useState } from 'react';
import { useAiAction } from '../hooks/use-ai-action';
import { AiActionMenu } from './ai-action-menu';
import { AiPreviewDialog } from './ai-preview-dialog';
import { Sparkles } from 'lucide-react';

interface AiInlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AiInlineEditor: React.FC<AiInlineEditorProps> = ({
  value,
  onChange,
  placeholder = "Write something...",
  className = ""
}) => {
  const { execute, isLoading, result, setResult } = useAiAction();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [lastAction, setLastAction] = useState<any>(null);

  const handleAction = async (actionId: string) => {
    setLastAction(actionId);
    setIsPreviewOpen(true);
    await execute({
      action: actionId as any,
      context: value
    });
  };

  const handleApply = (newText: string) => {
    onChange(newText);
    setIsPreviewOpen(false);
    setResult(null);
  };

  return (
    <div className="relative group">
      <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <AiActionMenu 
          onActionSelect={handleAction}
          trigger={
            <button type="button" className="flex items-center justify-center p-1.5 bg-white border border-purple-200 text-purple-600 rounded-full shadow-md hover:bg-purple-50 hover:scale-105 transition-all">
              <Sparkles size={16} />
            </button>
          }
        />
      </div>
      
      <textarea
        className={`w-full min-h-[200px] p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 bg-white shadow-sm resize-y ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      <AiPreviewDialog 
        isOpen={isPreviewOpen}
        isLoading={isLoading}
        originalText={value}
        suggestedText={result?.result || ""}
        onApply={handleApply}
        onDiscard={() => {
          setIsPreviewOpen(false);
          setResult(null);
        }}
        onRegenerate={() => handleAction(lastAction)}
      />
    </div>
  );
};
