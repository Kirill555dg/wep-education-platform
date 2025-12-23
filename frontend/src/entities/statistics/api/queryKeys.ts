export const statisticsQueryKeys = {
  all: ["statistics"] as const,
  myListRoot: () => [...statisticsQueryKeys.all, "myList"] as const,
  myList: (params: { skip: number; limit: number }) => [...statisticsQueryKeys.myListRoot(), params] as const,
  myProgress: () => [...statisticsQueryKeys.all, "myProgress"] as const,
} as const;


