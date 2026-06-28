import React from 'react';
import { Loader2 } from 'lucide-react';

export const AiResultPanel = ({ content, isLoading }: { content: string, isLoading?: boolean }) => (
  <div className="bg-white p-4 rounded-lg border border-purple-200 text-sm text-slate-800 min-h-[200px] shadow-sm ring-1 ring-purple-50">
    {isLoading ? (
      <div className="flex flex-col items-center justify-center h-full space-y-3">
        <Loader2 className="animate-spin text-purple-600" size={24} />
        <span className="text-slate-500 animate-pulse">Generating...</span>
      </div>
    ) : (
      <div className="whitespace-pre-wrap">{content}</div>
    )}
  </div>
);
