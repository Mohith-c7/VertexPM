import { useAiInsights } from './use-ai-insights';

export const useAiHealth = (projectId: string) => {
  const { data, loading, error } = useAiInsights(projectId);
  return { 
    healthScore: data?.healthScore ?? 0, 
    status: data?.status ?? 'Unknown',
    loading, 
    error 
  };
};
