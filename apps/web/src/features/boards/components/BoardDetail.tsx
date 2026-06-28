"use client";
import React, { useEffect, useState } from 'react';
import { Settings, Filter, Users } from 'lucide-react';
import { Board, Column } from '../types';
import { ColumnManager } from './ColumnManager';

interface BoardDetailProps {
  workspaceId: string;
  projectId: string;
  boardId: string;
}

export function BoardDetail({ workspaceId, projectId, boardId }: BoardDetailProps) {
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock data
        setBoard({
          id: boardId,
          name: 'Design Board',
          projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        setColumns([
          { id: 'c1', name: 'Todo', order: 1, boardId },
          { id: 'c2', name: 'In Progress', order: 2, boardId },
          { id: 'c3', name: 'Done', order: 3, boardId }
        ]);
        
        setTimeout(() => setLoading(false), 800);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId, projectId, boardId]);

  const handleAddColumn = (name: string) => {
    const newCol: Column = {
      id: `c${Date.now()}`,
      name,
      order: columns.length + 1,
      boardId
    };
    setColumns([...columns, newCol]);
  };

  const handleUpdateColumn = (id: string, name: string) => {
    setColumns(columns.map(col => col.id === id ? { ...col, name } : col));
  };

  const handleDeleteColumn = (id: string) => {
    setColumns(columns.filter(col => col.id !== id));
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded mb-6" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-80 h-96 bg-slate-100 animate-pulse rounded-lg border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!board) {
    return <div className="p-4 bg-red-50 text-red-600 rounded">Board not found</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">{board.name}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 border-l border-slate-300 pl-4">
            <button className="flex items-center gap-1.5 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded shadow-sm">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1.5 rounded shadow-sm">
              <Users className="w-3.5 h-3.5" />
              Assignees
            </button>
          </div>
        </div>
        
        <button className="text-slate-500 hover:bg-slate-100 p-2 rounded transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto min-h-0">
        <ColumnManager 
          columns={columns}
          onAddColumn={handleAddColumn}
          onUpdateColumn={handleUpdateColumn}
          onDeleteColumn={handleDeleteColumn}
        />
      </div>
    </div>
  );
}
