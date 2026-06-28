import React from 'react';
import { Timer } from 'lucide-react';

interface Props {
  health: { completionRate: number; scopeCreep: number };
}

export const SprintHealth: React.FC<Props> = ({ health }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Sprint Health</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{health.completionRate}%</div>
          <div className="text-xs text-zinc-500 mt-1">Completion Rate</div>
        </div>
        <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
          <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{health.scopeCreep}%</div>
          <div className="text-xs text-zinc-500 mt-1">Scope Creep</div>
        </div>
      </div>
    </div>
  );
};
