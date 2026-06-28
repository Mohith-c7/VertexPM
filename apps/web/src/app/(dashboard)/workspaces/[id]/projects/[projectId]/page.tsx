import React from 'react';
import { ProjectDashboard } from '@/features/projects/components/ProjectDashboard';
import Link from 'next/link';

interface ProjectDashboardPageProps {
  params: Promise<{ id: string; projectId: string }>;
}

export default async function ProjectDashboardPage({ params }: ProjectDashboardPageProps) {
  const { id, projectId } = await params;
  
  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-6 flex items-center text-sm text-slate-500">
        <Link href={`/workspaces/${id}/projects`} className="hover:text-slate-900">
          Projects
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">Project Dashboard</span>
      </div>
      <ProjectDashboard workspaceId={id} projectId={projectId} />
    </div>
  );
}
