import { useAiInsights } from './use-ai-insights';

export const useAiRisk = (projectId: string) => {
  const { data, loading, error } = useAiInsights(projectId);
  return { 
    risks: data?.risks ?? [], 
    recommendations: data?.recommendations.filter(r => r.type === 'risk') ?? [],
    loading, 
    error 
  };
};
