import api from '@/services/api';
import {
  AutomationRule,
  CreateAutomationRuleDto,
  UpdateAutomationRuleDto,
  ExecutionLog,
  ExecutionHistoryFilters,
  PaginatedExecutionHistory,
  ScheduledJob,
  Reminder,
  CreateReminderDto,
} from '../types';

const BASE = '/automation';

// ─── Automation Rules ─────────────────────────────────────────────────────────

export const automationService = {
  // Rules
  getRules: async (): Promise<AutomationRule[]> => {
    const res = await api.get(`${BASE}/rules`);
    return res.data?.data ?? res.data ?? [];
  },

  createRule: async (data: CreateAutomationRuleDto): Promise<AutomationRule> => {
    const res = await api.post(`${BASE}/rules`, data);
    return res.data?.data ?? res.data;
  },

  updateRule: async (id: string, data: UpdateAutomationRuleDto): Promise<AutomationRule> => {
    const res = await api.patch(`${BASE}/rules/${id}`, data);
    return res.data?.data ?? res.data;
  },

  deleteRule: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/rules/${id}`);
  },

  enableRule: async (id: string): Promise<AutomationRule> => {
    const res = await api.patch(`${BASE}/rules/${id}/enable`);
    return res.data?.data ?? res.data;
  },

  disableRule: async (id: string): Promise<AutomationRule> => {
    const res = await api.patch(`${BASE}/rules/${id}/disable`);
    return res.data?.data ?? res.data;
  },

  // Execution History
  getHistory: async (
    filters?: ExecutionHistoryFilters
  ): Promise<PaginatedExecutionHistory> => {
    const params: Record<string, string | number> = {};
    if (filters?.status && filters.status !== 'ALL') params.status = filters.status;
    if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters?.dateTo) params.dateTo = filters.dateTo;
    if (filters?.ruleId) params.ruleId = filters.ruleId;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const res = await api.get(`${BASE}/history`, { params });
    const data = res.data?.data ?? res.data;

    // Normalize to paginated shape
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
        page: 1,
        limit: 50,
        totalPages: 1,
      };
    }
    return data;
  },

  // Scheduled Jobs
  getJobs: async (): Promise<ScheduledJob[]> => {
    const res = await api.get(`${BASE}/jobs`);
    return res.data?.data ?? res.data ?? [];
  },

  runJob: async (jobId?: string): Promise<ScheduledJob> => {
    const res = await api.post(`${BASE}/jobs/run`, jobId ? { jobId } : {});
    return res.data?.data ?? res.data;
  },

  cancelJob: async (jobId: string): Promise<ScheduledJob> => {
    const res = await api.post(`${BASE}/jobs/cancel`, { jobId });
    return res.data?.data ?? res.data;
  },

  // Reminders
  getReminders: async (): Promise<Reminder[]> => {
    const res = await api.get(`${BASE}/reminders`);
    return res.data?.data ?? res.data ?? [];
  },

  createReminder: async (data: CreateReminderDto): Promise<Reminder> => {
    const res = await api.post(`${BASE}/reminders`, data);
    return res.data?.data ?? res.data;
  },

  deleteReminder: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/reminders/${id}`);
  },

  // Dashboard aggregated stats (from history + rules)
  getDashboardStats: async () => {
    const [rules, history] = await Promise.all([
      automationService.getRules(),
      automationService.getHistory({ limit: 100 }),
    ]);

    const activeRules = rules.filter((r) => r.status === 'active').length;
    const disabledRules = rules.filter((r) => r.status === 'disabled').length;

    const today = new Date().toISOString().split('T')[0];
    const executionsToday = (history.data ?? []).filter(
      (e: ExecutionLog) => e.startedAt?.startsWith(today)
    ).length;
    const failedJobs = (history.data ?? []).filter(
      (e: ExecutionLog) => e.status === 'FAILED'
    ).length;

    return {
      activeRules,
      disabledRules,
      executionsToday,
      failedJobs,
      totalRules: rules.length,
    };
  },
};
