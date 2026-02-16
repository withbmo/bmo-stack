import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/lib/query-keys';
import type { Deployment } from '@/shared/types';

import { MOCK_DEPLOYMENTS } from './mock-deployments';

const fetchMockDeployments = async (): Promise<Deployment[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_DEPLOYMENTS;
};

export const useMockDeployments = () => {
  return useQuery({
    queryKey: queryKeys.deployments(),
    queryFn: fetchMockDeployments,
  });
};
