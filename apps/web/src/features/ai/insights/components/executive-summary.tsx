import React from 'react';
import { Briefcase } from 'lucide-react';

interface Props {
  summary: string;
}

export const ExecutiveSummary: React.FC<Props> = ({ summary }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 col-span-full">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-6 h-6 text-indigo-500" />
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Executive Summary</h2>
      </div>
      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
        {summary}
      </p>
    </div>
  );
};
