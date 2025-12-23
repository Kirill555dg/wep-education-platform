import { useQuery } from "@tanstack/react-query";

import { statisticsApi } from "@/shared/api";
import { statisticsQueryKeys } from "@/entities/statistics/api/queryKeys";

export function useMyProgressQuery() {
  return useQuery({
    queryKey: statisticsQueryKeys.myProgress(),
    queryFn: async () => await statisticsApi.myProgress(),
  });
}


