import { Activity } from 'lucide-react';
import React from 'react';

interface Props {
  score: number;
  status: string;
}

export const HealthScore: React.FC<Props> = ({ score, status }) => {
  const getColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-2">
        <Activity className={`w-5 h-5 ${getColor()}`} />
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Project Health</h3>
      </div>
      <div className={`text-4xl font-bold ${getColor()}`}>{score}</div>
      <div className="text-sm mt-1 font-medium text-zinc-600 dark:text-zinc-300">{status}</div>
    </div>
  );
};
