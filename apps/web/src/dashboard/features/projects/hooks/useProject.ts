import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/shared/auth';
import { getProject } from '@/shared/lib/projects';
import { queryKeys } from '@/shared/lib/query-keys';

export const useProject = (projectId?: string) => {
  const { user, hydrated } = useAuth();
  return useQuery({
    queryKey: projectId ? queryKeys.project(projectId) : ['project', undefined],
    queryFn: async () => {
      if (!hydrated || !user || !projectId) return null;
      return getProject(undefined, projectId);
    },
    enabled: hydrated && !!user && !!projectId,
  });
};
