import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAiAction } from '../hooks/use-ai-action';
import { AiActionType } from '../actions';

interface AiActionButtonProps {
  action: AiActionType;
  context: string;
  label: string;
  onSuccess: (result: string) => void;
  className?: string;
}

export const AiActionButton: React.FC<AiActionButtonProps> = ({
  action,
  context,
  label,
  onSuccess,
  className = ""
}) => {
  const { execute, isLoading } = useAiAction();

  const handleClick = async () => {
    const res = await execute({ action, context });
    if (res?.result) {
      onSuccess(res.result);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors shadow-sm disabled:opacity-50 ${className}`}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      <span>{label}</span>
    </button>
  );
};
