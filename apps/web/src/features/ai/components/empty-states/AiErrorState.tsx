import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface AiErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const AiErrorState: React.FC<AiErrorStateProps> = ({ 
  message = "We encountered an issue while connecting to the AI service. Please try again.",
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Connection Error</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry Request
        </button>
      )}
    </div>
  );
};
