export const statisticsQueryKeys = {
  all: ["statistics"] as const,
  myProgress: () => [...statisticsQueryKeys.all, "myProgress"] as const,
} as const;


