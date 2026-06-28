import { SprintPlanner } from './planning/sprint-planner';
import { BacklogAnalyzer } from './planning/backlog-analyzer';
import { ProjectSummaryAnalyzer } from './analysis/project-summary';
import { PriorityRecommender } from './recommendations/priority-recommender';
import { ExecutiveSummaryReport } from './reports/executive-summary';

export class IntelligenceEngine {
  public sprintPlanner = new SprintPlanner();
  public backlogAnalyzer = new BacklogAnalyzer();
  public projectSummary = new ProjectSummaryAnalyzer();
  public priorityRecommender = new PriorityRecommender();
  public executiveSummaryReport = new ExecutiveSummaryReport();

  async initialize() {
    // Initialization logic
  }
}
export const intelligenceEngine = new IntelligenceEngine();
