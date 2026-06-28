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
    // Simulated fetch to /api/ai/intelligence/{projectId}
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          healthScore: 87,
          status: 'Healthy',
          summary: 'Project is largely on track. Code velocity has increased by 12% this week. There is a potential bottleneck forming in the backend team due to recent scope changes.',
          recommendations: [
            { id: '1', type: 'risk', title: 'Backend Overallocation', description: 'Backend developers have 130% allocation for the current sprint.' },
            { id: '2', type: 'optimization', title: 'Stale Issues', description: '5 issues have been in "In Progress" for over 14 days.' },
            { id: '3', type: 'info', title: 'Good Velocity', description: 'Frontend team completed 15% more story points than average.' }
          ],
          sprintHealth: {
            completionRate: 88,
            scopeCreep: 8,
          },
          risks: [
            { title: 'API Gateway Delay', severity: 'high', description: 'Dependency on external vendor API is blocking 3 user stories.' },
            { title: 'QA Bottleneck', severity: 'medium', description: 'Testing phase is taking longer than estimated.' }
          ],
          workload: {
            frontend: 85,
            backend: 110,
            design: 60,
          },
          productivity: {
            trend: 'up',
            value: 12,
          },
          duplicates: 4,
          dependencies: 12,
        });
      }, 800);
    });
  }
};
