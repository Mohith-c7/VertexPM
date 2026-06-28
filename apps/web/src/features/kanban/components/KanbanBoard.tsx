import React, { useEffect, useState } from 'react';
import { Board, Column, WorkItem } from '../../boards/types';
import { KanbanColumn } from './KanbanColumn';
import { boardService } from '../../boards/services';
import { BoardHeader } from './BoardHeader';
import { BoardToolbar } from './BoardToolbar';

interface KanbanBoardProps {
  boardId: string;
  projectId: string;
  workspaceId: string;
  onOpenWorkItem: (id: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId, projectId, workspaceId, onOpenWorkItem }) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchBoardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fetchedBoard, fetchedWorkItems] = await Promise.all([
          boardService.getBoard(workspaceId, projectId, boardId),
          boardService.getWorkItems(boardId).catch(() => []) // Fallback to empty array if not implemented yet
        ]);

        if (mounted) {
          setBoard(fetchedBoard);
          setWorkItems(fetchedWorkItems);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch board data:', err);
          setError('Failed to load board. Please try again later.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBoardData();

    return () => {
      mounted = false;
    };
  }, [boardId, projectId, workspaceId]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-lg m-6 border border-slate-200 dark:border-slate-800">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Error Loading Board</h3>
        <p className="text-slate-500 dark:text-slate-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Fallback columns if none exist
  const columns = board?.columns || [];

  return (
    <div className="flex flex-col h-full bg-slate-100/50 dark:bg-slate-950/50 overflow-hidden">
      <BoardHeader board={board || undefined} isLoading={isLoading} />
      <BoardToolbar />
      
      <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-board-scroll p-6">
        <div className="flex gap-6 h-full items-start w-max pb-4">
          {isLoading ? (
            // Skeleton columns
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`col-skeleton-${i}`} className="flex flex-col w-[320px] min-w-[320px] bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl h-full backdrop-blur-sm p-3">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-28 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))
          ) : columns.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-full min-w-[800px] border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No columns yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                Get started by creating your first column to track work items.
              </p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-medium">
                Add Column
              </button>
            </div>
          ) : (
            columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                items={workItems.filter(item => item.statusId === column.id)}
                onOpenWorkItem={onOpenWorkItem}
                isLoading={isLoading}
              />
            ))
          )}
          
          {!isLoading && columns.length > 0 && (
            <button className="flex flex-col items-center justify-center w-[320px] min-w-[320px] h-[120px] bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-100/80 dark:hover:bg-slate-900/60 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              <span className="text-2xl mb-1">+</span>
              <span className="font-medium text-sm">Add Column</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
