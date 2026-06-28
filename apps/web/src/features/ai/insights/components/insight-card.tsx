import React from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const InsightCard: React.FC<Props> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{title}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">{value}</h3>
          {trend && (
            <span className={`text-sm mb-1 font-medium ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
      </div>
      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
    </div>
  );
};
