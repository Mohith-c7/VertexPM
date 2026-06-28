import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-4 dark:border-gray-900 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Vertex AI Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Online and ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                Hi! How can I help you today? Ask me about your projects, code, or documentation.
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-4 dark:border-gray-900">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-12 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-500"
              />
              <button
                disabled={!query.trim()}
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="h-6 w-6 transition-transform group-hover:rotate-90" /> : <Bot className="h-6 w-6 transition-transform group-hover:scale-110" />}
      </button>
    </div>
  );
};
