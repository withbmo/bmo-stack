import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/shared/auth';
import { listProjects, type ProjectListState } from '@/shared/lib/projects';
import { queryKeys } from '@/shared/lib/query-keys';

export const useProjects = (state: ProjectListState = 'active') => {
  const { user, hydrated } = useAuth();
  return useQuery({
    queryKey: queryKeys.projects(state),
    queryFn: async () => {
      if (!hydrated || !user) return [];
      return listProjects(undefined, state);
    },
    enabled: hydrated && !!user,
  });
};
