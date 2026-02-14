import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/common/lib/queryKeys';
import { HUB_RESOURCES } from '@/site/data/hub';
import type { HubResource } from '@/common/types';

const fetchResources = async (): Promise<HubResource[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return HUB_RESOURCES;
};

export const useHubResources = () => {
  return useQuery({
    queryKey: queryKeys.hubResources(),
    queryFn: fetchResources,
  });
};
