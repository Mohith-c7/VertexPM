import React, { useState } from 'react';
import { Search, ChevronRight, FileText, Code, PenTool, LayoutTemplate } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Prompts', icon: LayoutTemplate },
  { id: 'code', name: 'Coding', icon: Code },
  { id: 'writing', name: 'Writing', icon: PenTool },
  { id: 'analysis', name: 'Analysis', icon: FileText },
];

const PROMPTS = [
  { id: 1, title: 'Refactor Component', category: 'code', description: 'Refactor the given React component for better performance.' },
  { id: 2, title: 'Write Tests', category: 'code', description: 'Generate comprehensive unit tests using Jest and React Testing Library.' },
  { id: 3, title: 'Summarize Meeting', category: 'writing', description: 'Summarize meeting notes into actionable bullet points.' },
  { id: 4, title: 'Analyze Data', category: 'analysis', description: 'Analyze the provided dataset and identify key trends.' },
];

export const PromptLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filteredPrompts = PROMPTS.filter(
    (p) => (activeCategory === 'all' || p.category === activeCategory) && p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[600px] w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <h2 className="mb-4 text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">Prompt Library</h2>
        <nav className="space-y-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredPrompts.map((prompt) => (
              <button
                key={prompt.id}
                className="group flex flex-col items-start gap-2 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
              >
                <div className="flex w-full items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{prompt.title}</h3>
                  <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{prompt.description}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  {CATEGORIES.find((c) => c.id === prompt.category)?.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
