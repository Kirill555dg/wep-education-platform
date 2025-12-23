export const classroomQueryKeys = {
  all: ["classroom"] as const,
  myRoot: () => [...classroomQueryKeys.all, "my"] as const,
  myList: (params: { skip: number; limit: number }) => [...classroomQueryKeys.myRoot(), params] as const,
  byId: (id: number) => [...classroomQueryKeys.all, "byId", id] as const,
  studentsCount: (id: number) => [...classroomQueryKeys.all, "studentsCount", id] as const,
  lessons: (id: number) => [...classroomQueryKeys.all, "lessons", id] as const,
} as const;


