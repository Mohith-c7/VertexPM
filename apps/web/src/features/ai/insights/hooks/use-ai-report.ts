import { useAiInsights } from './use-ai-insights';

export const useAiReport = (projectId: string) => {
  const { data, loading, error } = useAiInsights(projectId);
  return { 
    summary: data?.summary ?? '', 
    fullData: data,
    loading, 
    error 
  };
};
