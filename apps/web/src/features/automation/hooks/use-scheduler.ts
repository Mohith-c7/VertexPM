'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ScheduledJob } from '../types';
import { automationService } from '../services/automation.service';

export function useScheduler(autoRefreshInterval = 30000) {
  const [jobs, setJobs] = useState<ScheduledJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setError(null);
      const data = await automationService.getJobs();
      setJobs(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load jobs';
      setError(msg);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();

    if (autoRefreshInterval > 0) {
      intervalRef.current = setInterval(fetchJobs, autoRefreshInterval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchJobs, autoRefreshInterval]);

  const runJob = useCallback(async (jobId?: string): Promise<boolean> => {
    try {
      setRunningJobId(jobId ?? 'new');
      await automationService.runJob(jobId);
      await fetchJobs();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to run job';
      setError(msg);
      return false;
    } finally {
      setRunningJobId(null);
    }
  }, [fetchJobs]);

  const cancelJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      setRunningJobId(jobId);
      await automationService.cancelJob(jobId);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: 'CANCELLED' } : j))
      );
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to cancel job';
      setError(msg);
      return false;
    } finally {
      setRunningJobId(null);
    }
  }, []);

  const pendingJobs = jobs.filter((j) => j.status === 'PENDING');
  const runningJobs = jobs.filter((j) => j.status === 'RUNNING');
  const failedJobs = jobs.filter((j) => j.status === 'FAILED');

  return {
    jobs,
    pendingJobs,
    runningJobs,
    failedJobs,
    isLoading,
    error,
    runningJobId,
    fetchJobs,
    runJob,
    cancelJob,
  };
}
