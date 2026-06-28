export type AppStatus = "idle" | "loading" | "ready" | "error";

export interface WorkspaceSummary {
  id: string;
  name: string;
  description?: string;
  status: AppStatus;
}
