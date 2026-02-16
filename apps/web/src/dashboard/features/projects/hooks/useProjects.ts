import { useQuery } from '@tanstack/react-query';
import { listProjects } from '@/shared/lib/projects';
import { queryKeys } from '@/shared/lib/query-keys';
import { useAuth } from '@/shared/auth';

export const useProjects = () => {
  const { user, hydrated } = useAuth();
  return useQuery({
    queryKey: queryKeys.projects(),
    queryFn: async () => {
      if (!hydrated || !user) return [];
      return listProjects(undefined);
    },
    enabled: hydrated && !!user,
  });
};
