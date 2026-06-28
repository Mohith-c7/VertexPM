import React from 'react';
import { Activity } from 'lucide-react';

interface TokenUsageUIProps {
  used: number;
  limit: number;
}

export const TokenUsageUI: React.FC<TokenUsageUIProps> = ({ used, limit }) => {
  const percentage = Math.min(100, Math.round((used / limit) * 100));
  
  let colorClass = 'bg-green-500';
  if (percentage > 85) colorClass = 'bg-red-500';
  else if (percentage > 65) colorClass = 'bg-yellow-500';

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
          <Activity className="h-3.5 w-3.5" />
          Token Usage
        </div>
        <div className="text-xs font-semibold text-gray-900 dark:text-gray-100">
          {used.toLocaleString()} <span className="font-normal text-gray-500">/ {limit.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
