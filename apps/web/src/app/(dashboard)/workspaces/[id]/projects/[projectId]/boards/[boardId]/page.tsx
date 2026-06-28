import React from 'react';
import { BoardDetail } from '@/features/boards/components/BoardDetail';
import Link from 'next/link';

interface BoardPageProps {
  params: Promise<{ id: string; projectId: string; boardId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id, projectId, boardId } = await params;
  
  return (
    <div className="p-8 h-full flex flex-col w-full">
      <div className="mb-4 flex items-center text-sm text-slate-500">
        <Link href={`/workspaces/${id}/projects`} className="hover:text-slate-900">
          Projects
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/workspaces/${id}/projects/${projectId}`} className="hover:text-slate-900">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">Board</span>
      </div>
      <BoardDetail workspaceId={id} projectId={projectId} boardId={boardId} />
    </div>
  );
}
