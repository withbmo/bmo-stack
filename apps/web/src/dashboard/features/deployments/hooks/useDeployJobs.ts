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
  const { token } = useAuth();
  return useQuery({
    queryKey: queryKeys.deployJobs(params),
    queryFn: async () => {
      if (!token) return [];
      return listDeployJobs(token, params);
    },
    enabled: !!token,
    refetchInterval: poll ? 1500 : false,
  });
};

export const useDeployJob = (jobId?: string, poll = true) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: jobId ? queryKeys.deployJob(jobId) : ['deploy-job', undefined],
    queryFn: async () => {
      if (!token || !jobId) return null;
      return getDeployJob(token, jobId);
    },
    enabled: !!token && !!jobId,
    refetchInterval: poll ? 1500 : false,
  });
};

export const useCreateDeployJob = (projectId?: string) => {
  const { token } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (envId: string) => {
      if (!token) throw new Error('Missing token');
      if (!projectId) throw new Error('Missing project');
      return createDeployJob(token, {
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
  const { token } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      if (!token) throw new Error('Missing token');
      return cancelDeployJob(token, jobId);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.deployJobs({ projectId }) });
    },
  });
};
