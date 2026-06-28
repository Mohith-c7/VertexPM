import React from 'react';
import { Command, PenTool, FileText, Code2, Sparkles } from 'lucide-react';

export interface SlashCommand {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const COMMANDS: SlashCommand[] = [
  { id: 'summarize', name: '/summarize', description: 'Summarize the selected text or file.', icon: FileText },
  { id: 'explain', name: '/explain', description: 'Explain this code snippet in plain English.', icon: Code2 },
  { id: 'rewrite', name: '/rewrite', description: 'Rewrite this content for better clarity.', icon: PenTool },
  { id: 'optimize', name: '/optimize', description: 'Suggest performance optimizations.', icon: Sparkles },
];

interface SlashCommandPaletteProps {
  isVisible: boolean;
  filterText: string;
  onSelect: (commandId: string) => void;
  position?: { top: number; left: number };
}

export const SlashCommandPalette: React.FC<SlashCommandPaletteProps> = ({ isVisible, filterText, onSelect, position }) => {
  if (!isVisible) return null;

  const normalizedFilter = filterText.toLowerCase().replace('/', '');
  const filteredCommands = COMMANDS.filter(cmd => cmd.id.includes(normalizedFilter) || cmd.name.includes(normalizedFilter));

  if (filteredCommands.length === 0) return null;

  return (
    <div
      style={position ? { position: 'absolute', top: position.top, left: position.left } : {}}
      className="z-50 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="px-3 pb-2 pt-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Quick Actions</p>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {filteredCommands.map((cmd) => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.id}
              onClick={() => onSelect(cmd.id)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900 dark:text-gray-100">{cmd.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{cmd.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
