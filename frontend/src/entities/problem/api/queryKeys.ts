export const problemQueryKeys = {
  all: ["problems"] as const,
  list: (params: { skip: number; limit: number; q: string; type: string }) =>
    [...problemQueryKeys.all, "list", params] as const,
  byId: (id: number) => [...problemQueryKeys.all, "byId", id] as const,
};


