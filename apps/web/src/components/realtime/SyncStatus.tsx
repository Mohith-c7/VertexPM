'use client';

import React from 'react';
import { Cloud, CloudOff, RefreshCcw } from 'lucide-react';

export type SyncState = 'synced' | 'syncing' | 'offline' | 'error';

export function SyncStatus({ state }: { state: SyncState }) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/50 border border-slate-200/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
      {state === 'synced' && (
        <>
          <Cloud className="w-3.5 h-3.5 text-emerald-500" />
          <span>Saved to cloud</span>
        </>
      )}
      {state === 'syncing' && (
        <>
          <RefreshCcw className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {state === 'offline' && (
        <>
          <CloudOff className="w-3.5 h-3.5 text-slate-400" />
          <span>Offline</span>
        </>
      )}
      {state === 'error' && (
        <>
          <CloudOff className="w-3.5 h-3.5 text-red-500" />
          <span className="text-red-500">Sync failed</span>
        </>
      )}
    </div>
  );
}
