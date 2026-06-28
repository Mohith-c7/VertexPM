import React from 'react';
import { Sparkles, Code, FileText, Zap } from 'lucide-react';

interface AiWelcomeScreenProps {
  onActionSelect?: (action: string) => void;
}

export const AiWelcomeScreen: React.FC<AiWelcomeScreenProps> = ({ onActionSelect }) => {
  const SUGGESTIONS = [
    { title: 'Explain codebase', description: 'Get a high-level overview of the current project structure.', icon: Code, id: 'explain_codebase' },
    { title: 'Generate documentation', description: 'Write README or inline docs for your files.', icon: FileText, id: 'gen_docs' },
    { title: 'Optimize performance', description: 'Identify bottlenecks in your components.', icon: Zap, id: 'optimize' },
  ];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
        <Sparkles className="h-8 w-8" />
      </div>
      
      <h1 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        Welcome to Vertex AI
      </h1>
      <p className="mb-8 max-w-md text-sm text-gray-500 dark:text-gray-400">
        I'm your intelligent coding assistant. Ask me anything about your project, or try one of the suggestions below to get started.
      </p>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
        {SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onActionSelect?.(item.id)}
              className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 text-center transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-600"
            >
              <div className="rounded-full bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:group-hover:bg-blue-900/40">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
