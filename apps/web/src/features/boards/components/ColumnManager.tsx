"use client";
import React, { useState } from 'react';
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react';
import { Column } from '../types';

interface ColumnManagerProps {
  columns: Column[];
  onAddColumn: (name: string) => void;
  onUpdateColumn: (id: string, name: string) => void;
  onDeleteColumn: (id: string) => void;
}

export function ColumnManager({ columns, onAddColumn, onUpdateColumn, onDeleteColumn }: ColumnManagerProps) {
  const [newColumnName, setNewColumnName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnName.trim()) {
      onAddColumn(newColumnName.trim());
      setNewColumnName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 items-start">
      {columns.map((column) => (
        <div key={column.id} className="w-80 flex-shrink-0 bg-slate-50/80 rounded-lg border border-slate-200 flex flex-col max-h-full">
          <div className="p-3 flex justify-between items-center border-b border-slate-200/50 group cursor-grab">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-medium text-sm text-slate-700">{column.name}</h3>
              <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full font-medium">
                0
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/50">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-2 flex-grow overflow-y-auto min-h-[150px]">
            {/* Task Cards would go here in the future */}
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic py-8 border-2 border-dashed border-slate-200 rounded">
              Drop tasks here
            </div>
          </div>
          
          <div className="p-2 border-t border-slate-200/50">
            <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 w-full p-2 rounded transition-colors font-medium">
              <Plus className="w-4 h-4" />
              Add issue
            </button>
          </div>
        </div>
      ))}

      {isAdding ? (
        <div className="w-80 flex-shrink-0 bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
          <form onSubmit={handleAddSubmit}>
            <input
              type="text"
              autoFocus
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
              placeholder="Column name"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-slate-900 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-slate-800"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-80 flex-shrink-0 flex items-center gap-2 text-slate-500 bg-slate-50/50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-lg p-3 transition-colors text-sm font-medium justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Column
        </button>
      )}
    </div>
  );
}
