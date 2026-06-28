import { useState, useEffect } from 'react';
import { aiInsightsService, AiIntelligenceData } from '../services/ai-insights.service';

export const useAiInsights = (projectId: string) => {
  const [data, setData] = useState<AiIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await aiInsightsService.getAiIntelligence(projectId);
        if (mounted) setData(res);
      } catch (err: any) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (projectId) {
      fetchData();
    }
    return () => { mounted = false; };
  }, [projectId]);

  return { data, loading, error };
};
