export const homeworkQueryKeys = {
  all: ["homework"] as const,
  byId: (homeworkId: number) => [...homeworkQueryKeys.all, "byId", homeworkId] as const,
  problems: (homeworkId: number) => [...homeworkQueryKeys.all, "problems", homeworkId] as const,
} as const;


