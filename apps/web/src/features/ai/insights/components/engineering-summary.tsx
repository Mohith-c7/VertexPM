import React from 'react';
import { Settings } from 'lucide-react';

interface Props {
  summary: string;
}

export const EngineeringSummary: React.FC<Props> = ({ summary }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-zinc-500" />
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Engineering Health</h3>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{summary || "Codebase is stable with standard technical debt."}</p>
    </div>
  );
};
