import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  trend: 'up' | 'down' | 'stable';
  value: number;
}

export const ProductivityPanel: React.FC<Props> = ({ trend, value }) => {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const color = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-zinc-500';

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Productivity Trend</h3>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">{value}%</span>
        <span className={`text-sm mb-1 ${color}`}>{trend === 'up' ? 'Increase' : trend === 'down' ? 'Decrease' : 'Stable'}</span>
      </div>
    </div>
  );
};
