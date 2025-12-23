export const classroomQueryKeys = {
  all: ["classroom"] as const,
  myList: (params: { skip: number; limit: number }) => [...classroomQueryKeys.all, "my", params] as const,
  byId: (id: number) => [...classroomQueryKeys.all, "byId", id] as const,
  studentsCount: (id: number) => [...classroomQueryKeys.all, "studentsCount", id] as const,
  lessons: (id: number) => [...classroomQueryKeys.all, "lessons", id] as const,
} as const;


