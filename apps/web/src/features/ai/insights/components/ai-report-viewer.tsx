import React from 'react';
import { FileText } from 'lucide-react';

interface Props {
  summary: string;
}

export const AiReportViewer: React.FC<Props> = ({ summary }) => {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">Full AI Report</h3>
      </div>
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-sm text-zinc-600 dark:text-zinc-300">
        <p>{summary}</p>
        <button className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
          Download PDF Report
        </button>
      </div>
    </div>
  );
};
