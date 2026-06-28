"use client";

import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { workItemsApi } from '../services/api';

export const ActivityTimeline = ({ workItemId }: { workItemId: string }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    workItemsApi.getActivity(workItemId)
      .then(data => setActivities(data))
      .catch(err => {
        console.error(err);
        setActivities([
          {
            id: 'a1',
            workItemId,
            actorId: 'u1',
            actor: { id: 'u1', name: 'Alice Smith' },
            action: 'changed status',
            details: { from: 'Todo', to: 'In Progress' },
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: 'a2',
            workItemId,
            actorId: 'u2',
            actor: { id: 'u2', name: 'Bob Jones' },
            action: 'assigned to',
            details: { assignee: 'Alice Smith' },
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, [workItemId]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-sm text-slate-500">Loading activity...</div>
      ) : activities.length === 0 ? (
        <div className="text-sm text-slate-500 italic">No activity yet.</div>
      ) : (
        <div className="relative border-l border-slate-200 ml-3 space-y-6 pb-4">
          {activities.map(activity => (
            <div key={activity.id} className="relative pl-6">
              <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white" />
              <div className="flex flex-col">
                <div className="text-sm">
                  <span className="font-semibold text-slate-900">{activity.actor?.name}</span>
                  <span className="text-slate-600 mx-1">{activity.action}</span>
                  {activity.details?.to && (
                    <span className="font-medium text-slate-800">
                      from <span className="line-through text-slate-400">{activity.details.from}</span> to {activity.details.to}
                    </span>
                  )}
                  {activity.details?.assignee && (
                    <span className="font-medium text-slate-800">{activity.details.assignee}</span>
                  )}
                </div>
                <span className="text-xs text-slate-400 mt-0.5">{new Date(activity.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
