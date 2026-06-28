import React from 'react';
import { Link } from 'lucide-react';

interface Props {
  count: number;
}

export const DependencyPanel: React.FC<Props> = ({ count }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Cross-Dependencies</h3>
        </div>
        <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{count}</span>
      </div>
      <p className="text-xs text-zinc-500 mt-2">Active blocking dependencies detected.</p>
    </div>
  );
};
