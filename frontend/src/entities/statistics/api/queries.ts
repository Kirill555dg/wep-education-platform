import { useQuery } from "@tanstack/react-query";

import { statisticsApi } from "@/shared/api";
import { statisticsQueryKeys } from "@/entities/statistics/api/queryKeys";

export function useMyProgressQuery() {
  return useQuery({
    queryKey: statisticsQueryKeys.myProgress(),
    queryFn: async () => await statisticsApi.myProgress(),
  });
}

export function useMyStatisticsListQuery(params: { skip: number; limit: number }) {
  return useQuery({
    queryKey: statisticsQueryKeys.myList(params),
    queryFn: async () => await statisticsApi.listMine(params),
  });
}


