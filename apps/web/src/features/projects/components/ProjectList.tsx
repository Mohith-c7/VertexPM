"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, FolderKanban, MoreVertical, Trash2 } from 'lucide-react';
import { Project } from '../types';
import { projectService } from '../services';

interface ProjectListProps {
  workspaceId: string;
}

export function ProjectList({ workspaceId }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Replace with actual API call later, using mock for UI dev
        // const data = await projectService.getProjects(workspaceId);
        
        // Mock data for UI development
        const mockData: Project[] = [
          { id: '1', name: 'Website Redesign', description: 'Revamping the main corporate site.', workspaceId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: '2', name: 'Mobile App', description: 'React Native app for users.', workspaceId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setProjects(mockData);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
          <div className="h-10 w-32 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-lg border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-100 flex flex-col items-center justify-center">
        <p className="font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm underline hover:text-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your workspace projects.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <FolderKanban className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900 mb-1">No projects yet</h3>
          <p className="text-sm text-slate-500 text-center max-w-sm mb-4">
            Get started by creating a new project to organize your team's work.
          </p>
          <button className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/workspaces/${workspaceId}/projects/${project.id}`}
              className="group block p-5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                </div>
                <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              {project.description && (
                <p className="text-sm text-slate-500 line-clamp-2 mt-2">
                  {project.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
