import { useQuery } from "@tanstack/react-query";

import { homeworkApi } from "@/shared/api";
import { homeworkQueryKeys } from "@/entities/homework/api/queryKeys";

export function useHomeworkQuery(homeworkId: number) {
  return useQuery({
    queryKey: homeworkQueryKeys.byId(homeworkId),
    queryFn: async () => await homeworkApi.get(homeworkId),
    enabled: Number.isFinite(homeworkId) && homeworkId > 0,
  });
}

export function useHomeworkProblemsQuery(homeworkId: number) {
  return useQuery({
    queryKey: homeworkQueryKeys.problems(homeworkId),
    queryFn: async () => await homeworkApi.getProblems(homeworkId),
    enabled: Number.isFinite(homeworkId) && homeworkId > 0,
  });
}


