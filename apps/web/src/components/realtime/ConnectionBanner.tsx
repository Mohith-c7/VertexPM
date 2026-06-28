'use client';

import React from 'react';
import { WifiOff, Loader2 } from 'lucide-react';
import { useRealtime } from '../../hooks/useRealtime';

export function ConnectionBanner() {
  const { connectionState } = useRealtime();

  if (connectionState === 'connected') return null;

  return (
    <div className="bg-red-500/10 border-b border-red-500/20 text-red-600 px-4 py-2 flex items-center justify-center text-sm font-medium animate-in slide-in-from-top-2">
      {connectionState === 'disconnected' || connectionState === 'error' ? (
        <>
          <WifiOff className="w-4 h-4 mr-2" />
          You are currently offline. Changes will be saved locally.
        </>
      ) : (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Reconnecting to server...
        </>
      )}
    </div>
  );
}
