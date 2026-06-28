"use client";

import React, { useState, useEffect } from 'react';
import { Dependency } from '../types';
import { workItemsApi } from '../services/api';
import { Link2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DependenciesPanel = ({ workItemId }: { workItemId: string }) => {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workItemsApi.getDependencies(workItemId)
      .then(data => setDependencies(data))
      .catch(err => {
        console.error(err);
        setDependencies([
          {
            id: 'd1',
            sourceId: workItemId,
            targetId: 'TASK-122',
            type: 'blocks',
            targetWorkItem: {
              id: 'TASK-122',
              title: 'Setup Database Schema for Users',
              description: '',
              type: 'Task',
              priority: 'High',
              status: 'Done',
              reporterId: 'u1',
              labels: [],
              createdAt: '',
              updatedAt: ''
            }
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, [workItemId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Linked Issues</h3>
        <Button variant="ghost" size="sm" className="h-7 text-blue-600">
          <Plus className="w-4 h-4 mr-1" /> Add Link
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Loading links...</div>
      ) : dependencies.length === 0 ? (
        <div className="text-sm text-slate-500 italic">No linked issues.</div>
      ) : (
        <div className="space-y-3">
          {dependencies.map(dep => (
            <div key={dep.id} className="flex flex-col border border-slate-200 rounded-md p-3 hover:border-slate-300 transition-colors bg-white">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {dep.type.replace(/_/g, ' ')}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {dep.targetWorkItem?.id}
                  </span>
                  <span className="text-sm text-slate-700 font-medium">
                    {dep.targetWorkItem?.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    dep.targetWorkItem?.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {dep.targetWorkItem?.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
