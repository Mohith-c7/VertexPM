'use client';

import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConflictBannerProps {
  hasConflict: boolean;
  onResolveClient: () => void;
  onResolveServer: () => void;
  serverUserName?: string; // name of the user who made the conflicting change
}

export function ConflictBanner({ 
  hasConflict, 
  onResolveClient, 
  onResolveServer,
  serverUserName = 'Someone else' 
}: ConflictBannerProps) {
  if (!hasConflict) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-amber-900">Edit Conflict</h4>
          <p className="text-xs text-amber-700 mt-0.5">
            {serverUserName} modified this item while you were editing. Which version would you like to keep?
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <button
          onClick={onResolveServer}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Discard mine
        </button>
        <button
          onClick={onResolveClient}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors shadow-sm"
        >
          <Check className="w-3.5 h-3.5" />
          Keep mine
        </button>
      </div>
    </div>
  );
}
