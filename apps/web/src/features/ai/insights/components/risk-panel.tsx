import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Risk } from '../services/ai-insights.service';

interface Props {
  risks: Risk[];
}

export const RiskPanel: React.FC<Props> = ({ risks }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Active Risks</h3>
      </div>
      <div className="space-y-3">
        {risks.map((risk, i) => (
          <div key={i} className="p-3 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">{risk.title}</span>
              <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider ${
                risk.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
              }`}>{risk.severity}</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{risk.description}</p>
          </div>
        ))}
        {risks.length === 0 && <p className="text-sm text-zinc-500">No active risks identified.</p>}
      </div>
    </div>
  );
};
