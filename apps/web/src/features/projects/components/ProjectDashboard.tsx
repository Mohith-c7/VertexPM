"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, LayoutTemplate, MoreHorizontal } from 'lucide-react';
import { Board } from '../../boards/types';
import { Project } from '../types';

interface ProjectDashboardProps {
  workspaceId: string;
  projectId: string;
}

export function ProjectDashboard({ workspaceId, projectId }: ProjectDashboardProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock data
        setProject({
          id: projectId,
          name: 'Website Redesign',
          description: 'Revamping the main corporate site.',
          workspaceId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        setBoards([
          { id: 'b1', name: 'Design Board', projectId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: 'b2', name: 'Engineering', projectId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        ]);
        
        setTimeout(() => setLoading(false), 800);
      } catch (err) {
        setError('Failed to load project details');
        setLoading(false);
      }
    };
    fetchData();
  }, [workspaceId, projectId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-1/3 bg-slate-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-lg border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        {error || 'Project not found'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
        {project.description && (
          <p className="text-sm text-slate-500 mt-1">{project.description}</p>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-slate-900">Boards</h2>
        <button className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" />
          New Board
        </button>
      </div>

      {boards.length === 0 ? (
        <div className="py-12 bg-slate-50 rounded-lg border border-slate-200 border-dashed text-center">
          <LayoutTemplate className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-slate-900">No boards created</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">Create a board to start tracking issues.</p>
          <button className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50">
            <Plus className="w-4 h-4" />
            Create Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <Link 
              key={board.id} 
              href={`/workspaces/${workspaceId}/projects/${projectId}/boards/${board.id}`}
              className="group block p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {board.name}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
