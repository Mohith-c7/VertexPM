'use client';

import React from 'react';
import { PresenceUser } from '../../services/realtime/types';

interface AvatarGroupProps {
  users: PresenceUser[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({ users, max = 4, size = 'md' }: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remaining = Math.max(0, users.length - max);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
  };

  return (
    <div className="flex items-center -space-x-2">
      {displayUsers.map((user) => (
        <div key={user.id} className="relative group">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className={`rounded-full border-2 border-white object-cover ${sizeClasses[size]}`}
            />
          ) : (
            <div
              className={`rounded-full border-2 border-white bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium ${sizeClasses[size]}`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
              statusColors[user.status]
            }`}
          />

          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10 pointer-events-none shadow-sm">
            {user.name}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
          </div>
        </div>
      ))}
      
      {remaining > 0 && (
        <div
          className={`rounded-full border-2 border-white bg-slate-50 text-slate-600 flex items-center justify-center font-medium shadow-sm z-10 ${sizeClasses[size]}`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
