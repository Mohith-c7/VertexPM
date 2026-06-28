import React from 'react';
import { ProjectList } from '@/features/projects/components/ProjectList';

interface ProjectsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { id } = await params;
  
  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-6 flex items-center text-sm text-slate-500">
        <span>Workspace</span>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">Projects</span>
      </div>
      <ProjectList workspaceId={id} />
    </div>
  );
}
