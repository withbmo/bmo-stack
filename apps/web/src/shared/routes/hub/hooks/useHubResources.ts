import { useQuery } from "@tanstack/react-query";

import { HUB_RESOURCES } from "@/shared/data/hub";
import { queryKeys } from "@/shared/lib/query-keys";
import type { HubResource } from "@/shared/types";

const fetchResources = async (): Promise<HubResource[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return HUB_RESOURCES;
};

export const useHubResources = () => {
  return useQuery({
    queryKey: queryKeys.hubResources(),
    queryFn: fetchResources,
  });
};
