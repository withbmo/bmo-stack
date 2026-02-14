import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEnvironment, listEnvironments, updateEnvironment } from '@/shared/lib/environments';
import { queryKeys } from '@/shared/lib/query-keys';
import type { Environment } from '@/shared/types';
import { useAuth } from '@/shared/auth';

export const useEnvironments = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: queryKeys.environments(),
    queryFn: async () => {
      if (!token) return [] as Environment[];
      return listEnvironments(token);
    },
    enabled: !!token,
  });
};

export const useCreateEnvironment = () => {
  const { token } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Parameters<typeof createEnvironment>[1]) => {
      if (!token) throw new Error('Missing token');
      return createEnvironment(token, payload);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.environments() });
    },
  });
};

export const useUpdateEnvironment = () => {
  const { token } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      envId: string;
      payload: Parameters<typeof updateEnvironment>[2];
    }) => {
      if (!token) throw new Error('Missing token');
      return updateEnvironment(token, args.envId, args.payload);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.environments() });
    },
  });
};
