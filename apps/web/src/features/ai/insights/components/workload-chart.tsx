import React from 'react';
import { Users } from 'lucide-react';

interface Props {
  workload: { frontend: number; backend: number; design: number };
}

export const WorkloadChart: React.FC<Props> = ({ workload }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Team Workload</h3>
      </div>
      <div className="space-y-4">
        {Object.entries(workload).map(([team, value]) => (
          <div key={team}>
            <div className="flex justify-between text-sm mb-1">
              <span className="capitalize text-zinc-600 dark:text-zinc-300">{team}</span>
              <span className="text-zinc-500">{value}%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${value > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min(value, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
