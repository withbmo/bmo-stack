import { ORCHESTRATOR_STATUS } from '@pytholit/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/shared/auth';
import { createEnvironment, deleteEnvironment, listEnvironments, updateEnvironment } from '@/shared/lib/environments';
import { queryKeys } from '@/shared/lib/query-keys';
import type { Environment } from '@/shared/types';

function getOrchestratorStatus(env: Environment): string | null {
  const cfg = (env.config as Record<string, unknown> | undefined) ?? {};
  const orch = (cfg.orchestrator as Record<string, unknown> | undefined) ?? null;
  const status = orch ? (orch.status as unknown) : null;
  return typeof status === 'string' ? status : null;
}

function isTransitional(status: string | null): boolean {
  return (
    status === ORCHESTRATOR_STATUS.QUEUED ||
    status === ORCHESTRATOR_STATUS.STARTING ||
    status === ORCHESTRATOR_STATUS.STOPPING ||
    status === ORCHESTRATOR_STATUS.TERMINATING
  );
}

export const useEnvironments = () => {
  const { user, hydrated } = useAuth();
  return useQuery({
    queryKey: queryKeys.environments(),
    queryFn: async () => {
      if (!hydrated || !user) return [] as Environment[];
      return listEnvironments(undefined);
    },
    enabled: hydrated && !!user,
    // Keep the UI fresh while environments are transitioning so users see status changes without manual refresh.
    refetchInterval: (query) => {
      const data = (query as { state?: { data?: unknown } })?.state?.data;
      if (!Array.isArray(data) || data.length === 0) return false;
      return data.some((env) => isTransitional(getOrchestratorStatus(env))) ? 2000 : false;
    },
  });
};

export const useCreateEnvironment = () => {
  const { user, hydrated } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Parameters<typeof createEnvironment>[1]) => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      return createEnvironment(undefined, payload);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.environments() });
    },
  });
};

export const useUpdateEnvironment = () => {
  const { user, hydrated } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      envId: string;
      payload: Parameters<typeof updateEnvironment>[2];
    }) => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      return updateEnvironment(undefined, args.envId, args.payload);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.environments() });
    },
  });
};

export const useDeleteEnvironment = () => {
  const { user, hydrated } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (envId: string) => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      return deleteEnvironment(undefined, envId);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.environments() });
    },
  });
};
