export const chatQueryKeys = {
  all: ["chat"] as const,
  tailMessages: (classroomId: number, params: { limit: number }) => [...chatQueryKeys.all, "tail", classroomId, params] as const,
} as const;


