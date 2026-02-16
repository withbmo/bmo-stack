import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelDeployJob,
  createDeployJob,
  getDeployJob,
  listDeployJobs,
} from '@/shared/lib/deploy-jobs';
import { queryKeys } from '@/shared/lib/query-keys';
import { useAuth } from '@/shared/auth';

export const useDeployJobs = (params: { projectId?: string; envId?: string }, poll = true) => {
  const { user, hydrated } = useAuth();
  return useQuery({
    queryKey: queryKeys.deployJobs(params),
    queryFn: async () => {
      if (!hydrated || !user) return [];
      return listDeployJobs(undefined, params);
    },
    enabled: hydrated && !!user,
    refetchInterval: poll ? 1500 : false,
  });
};

export const useDeployJob = (jobId?: string, poll = true) => {
  const { user, hydrated } = useAuth();
  return useQuery({
    queryKey: jobId ? queryKeys.deployJob(jobId) : ['deploy-job', undefined],
    queryFn: async () => {
      if (!hydrated || !user || !jobId) return null;
      return getDeployJob(undefined, jobId);
    },
    enabled: hydrated && !!user && !!jobId,
    refetchInterval: poll ? 1500 : false,
  });
};

export const useCreateDeployJob = (projectId?: string) => {
  const { user, hydrated } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (envId: string) => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      if (!projectId) throw new Error('Missing project');
      return createDeployJob(undefined, {
        projectId,
        environmentId: envId,
        source: { origin: 'dashboard', ref: 'main' },
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.deployJobs({ projectId }) });
    },
  });
};

export const useCancelDeployJob = (projectId?: string) => {
  const { user, hydrated } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      return cancelDeployJob(undefined, jobId);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.deployJobs({ projectId }) });
    },
  });
};
