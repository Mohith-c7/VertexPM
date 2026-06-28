'use client';

import React from 'react';
import { AiDashboard } from '../../../../../../../features/ai/insights/components/ai-dashboard';

export default function AiInsightsPage({ params }: { params: { projectId: string; workspaceId: string } }) {
  // Using a mock project ID if params isn't available right away during static rendering
  const projectId = params?.projectId || 'default-project';

  return (
    <div className="p-6 bg-zinc-50/50 dark:bg-black min-h-screen">
      <AiDashboard projectId={projectId} />
    </div>
  );
}
