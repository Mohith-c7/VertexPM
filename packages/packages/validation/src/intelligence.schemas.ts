import { z } from 'zod';

export const SprintPlanSchema = z.object({
  sprintGoal: z.string(),
  recommendedWorkItems: z.array(z.string()), // WorkItem IDs
  capacityAnalysis: z.object({
    totalPoints: z.number(),
    estimatedVelocity: z.number(),
    bottlenecks: z.array(z.string())
  }),
  risks: z.array(z.string())
});

export const BacklogAnalysisSchema = z.object({
  healthScore: z.number(),
  staleItems: z.array(z.string()),
  missingEstimates: z.array(z.string()),
  recommendations: z.array(z.string())
});

export const ReleasePlanSchema = z.object({
  targetDate: z.string(),
  criticalPath: z.array(z.string()),
  confidenceScore: z.number(),
  blockers: z.array(z.string())
});

export const BoardSummarySchema = z.object({
  statusDistribution: z.record(z.string(), z.number()),
  recentProgress: z.string(),
  blockers: z.array(z.string()),
  actionItems: z.array(z.string())
});

export const ProjectSummarySchema = z.object({
  overallHealth: z.enum(['HEALTHY', 'AT_RISK', 'CRITICAL']),
  milestoneProgress: z.number(),
  topRisks: z.array(z.string()),
  executiveSummary: z.string()
});

export const WorkloadAnalysisSchema = z.object({
  assigneeWorkloads: z.record(z.string(), z.number()),
  overloadedAssignees: z.array(z.string()),
  underutilizedAssignees: z.array(z.string()),
  rebalancingRecommendations: z.array(
    z.object({
      workItemId: z.string(),
      fromAssigneeId: z.string(),
      toAssigneeId: z.string(),
      reason: z.string()
    })
  )
});

export const DuplicateDetectionSchema = z.object({
  duplicates: z.array(
    z.object({
      originalId: z.string(),
      duplicateId: z.string(),
      similarityScore: z.number(),
      reason: z.string()
    })
  )
});

export const DependencyAnalysisSchema = z.object({
  circularDependencies: z.array(z.array(z.string())),
  criticalPaths: z.array(z.array(z.string())),
  bottlenecks: z.array(z.string())
});

export const RiskAnalysisSchema = z.object({
  identifiedRisks: z.array(
    z.object({
      type: z.enum(['SCHEDULE', 'RESOURCE', 'TECHNICAL', 'SCOPE']),
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      description: z.string(),
      mitigationPlan: z.string()
    })
  )
});

export const PriorityRecommendationSchema = z.object({
  workItemId: z.string(),
  suggestedPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  reason: z.string()
});

export const AssigneeRecommendationSchema = z.object({
  workItemId: z.string(),
  suggestedAssigneeId: z.string(),
  confidence: z.number(),
  reason: z.string()
});

export const DeadlinePredictionSchema = z.object({
  workItemId: z.string(),
  predictedCompletionDate: z.string(),
  confidence: z.number(),
  riskFactors: z.array(z.string())
});

export const WorkflowOptimizationSchema = z.object({
  bottleneckStages: z.array(z.string()),
  averageCycleTime: z.number(),
  recommendations: z.array(z.string())
});

export const ExecutiveSummarySchema = z.object({
  period: z.string(),
  keyAccomplishments: z.array(z.string()),
  strategicRisks: z.array(z.string()),
  kpiMetrics: z.record(z.string(), z.number())
});

export const EngineeringSummarySchema = z.object({
  codeVelocity: z.number(),
  reviewTurnaroundTime: z.number(),
  technicalDebtItems: z.array(z.string()),
  qualityMetrics: z.record(z.string(), z.number())
});

export const SprintReportSchema = z.object({
  sprintId: z.string(),
  completedPoints: z.number(),
  spilloverPoints: z.number(),
  retrospectiveInsights: z.array(z.string())
});
