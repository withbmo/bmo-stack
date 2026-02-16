import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/shared/auth';
import { createEnvironment, listEnvironments, updateEnvironment } from '@/shared/lib/environments';
import { queryKeys } from '@/shared/lib/query-keys';
import type { Environment } from '@/shared/types';

export const useEnvironments = () => {
  const { user, hydrated } = useAuth();
  return useQuery({
    queryKey: queryKeys.environments(),
    queryFn: async () => {
      if (!hydrated || !user) return [] as Environment[];
      return listEnvironments(undefined);
    },
    enabled: hydrated && !!user,
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
