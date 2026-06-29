import api from "../../../../services/api";

export interface InsightRecommendation {
  id: string;
  type: 'risk' | 'optimization' | 'info';
  title: string;
  description: string;
}

export interface Risk {
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface AiIntelligenceData {
  healthScore: number;
  status: 'Healthy' | 'At Risk' | 'Critical';
  summary: string;
  recommendations: InsightRecommendation[];
  sprintHealth: {
    completionRate: number;
    scopeCreep: number;
  };
  risks: Risk[];
  workload: {
    frontend: number;
    backend: number;
    design: number;
  };
  productivity: {
    trend: 'up' | 'down' | 'stable';
    value: number;
  };
  duplicates: number;
  dependencies: number;
}

export const aiInsightsService = {
  async getAiIntelligence(projectId: string): Promise<AiIntelligenceData> {
    const response = await api.get(`/ai/intelligence/${projectId}`);
    return response.data;
  }
};
