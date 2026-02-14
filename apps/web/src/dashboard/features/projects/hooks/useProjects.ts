import { useQuery } from '@tanstack/react-query';
import { listProjects } from '@/shared/lib/projects';
import { queryKeys } from '@/shared/lib/query-keys';
import { useAuth } from '@/shared/auth';

export const useProjects = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: queryKeys.projects(),
    queryFn: async () => {
      if (!token) return [];
      return listProjects(token);
    },
    enabled: !!token,
  });
};
