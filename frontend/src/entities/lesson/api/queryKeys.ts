export const lessonQueryKeys = {
  all: ["lesson"] as const,
  byId: (id: number) => [...lessonQueryKeys.all, "byId", id] as const,
  homeworks: (lessonId: number) => [...lessonQueryKeys.all, "homeworks", lessonId] as const,
} as const;


