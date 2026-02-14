import { useQuery } from '@tanstack/react-query';
import { getProject } from '@/shared/lib/projects';
import { queryKeys } from '@/shared/lib/query-keys';
import { useAuth } from '@/shared/auth';

export const useProject = (projectId?: string) => {
  const { token } = useAuth();
  return useQuery({
    queryKey: projectId ? queryKeys.project(projectId) : ['project', undefined],
    queryFn: async () => {
      if (!token || !projectId) return null;
      return getProject(token, projectId);
    },
    enabled: !!token && !!projectId,
  });
};
