import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const BoardHealth: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <LayoutDashboard className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Board Health</h3>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Workflow is flowing smoothly. No major bottlenecks in current columns.</p>
    </div>
  );
};
