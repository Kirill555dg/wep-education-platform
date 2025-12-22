import { useQuery } from "@tanstack/react-query";

import { problemsApi } from "@/shared/api";
import { problemQueryKeys } from "@/entities/problem/api/queryKeys";

export function useProblemsList(params: { skip: number; limit: number; q: string; type: string }) {
  return useQuery({
    queryKey: problemQueryKeys.list(params),
    queryFn: async () => {
      const page = await problemsApi.list({ skip: params.skip, limit: params.limit });
      // Server filtering not guaranteed; we apply minimal client-side filters for UX.
      const q = params.q.trim().toLowerCase();
      const type = params.type.trim().toLowerCase();
      const items = page.items
        .filter((p) => (q ? p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) : true))
        .filter((p) => (type ? p.problem_type.toLowerCase() === type : true));
      return { ...page, items };
    },
  });
}

export function useProblem(problemId: number) {
  return useQuery({
    queryKey: problemQueryKeys.byId(problemId),
    queryFn: async () => await problemsApi.get(problemId),
    enabled: Number.isFinite(problemId),
  });
}


