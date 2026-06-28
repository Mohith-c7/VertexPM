import React from 'react';
import { useAiInsights } from '../hooks/use-ai-insights';
import { ProjectHealth } from './project-health';
import { SprintHealth } from './sprint-health';
import { WorkloadChart } from './workload-chart';
import { RiskPanel } from './risk-panel';
import { ExecutiveSummary } from './executive-summary';
import { RecommendationCenter } from './recommendation-center';
import { ProductivityPanel } from './productivity-panel';
import { DuplicatePanel } from './duplicate-panel';
import { DependencyPanel } from './dependency-panel';
import { BoardHealth } from './board-health';
import { EngineeringSummary } from './engineering-summary';
import { AiReportViewer } from './ai-report-viewer';
import { Loader2, Sparkles } from 'lucide-react';

interface Props {
  projectId: string;
}

export const AiDashboard: React.FC<Props> = ({ projectId }) => {
  const { data, loading, error } = useAiInsights(projectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-xl">
        Failed to load AI Insights.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            AI Insights Dashboard
          </h1>
          <p className="text-zinc-500 text-sm mt-1">High-level intelligence about your project's health and risks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProjectHealth score={data.healthScore} status={data.status} />
        <ProductivityPanel trend={data.productivity.trend} value={data.productivity.value} />
        <DuplicatePanel count={data.duplicates} />
        <DependencyPanel count={data.dependencies} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ExecutiveSummary summary={data.summary} />
          <RecommendationCenter recommendations={data.recommendations} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SprintHealth health={data.sprintHealth} />
            <BoardHealth />
          </div>
        </div>

        <div className="space-y-6">
          <WorkloadChart workload={data.workload} />
          <RiskPanel risks={data.risks} />
          <EngineeringSummary summary="All core services are operating normally. Some minor tech debt identified in the frontend repository." />
          <AiReportViewer summary={data.summary} />
        </div>
      </div>
    </div>
  );
};
