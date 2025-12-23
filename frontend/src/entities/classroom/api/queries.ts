import { useQuery } from "@tanstack/react-query";

import { classroomsApi, lessonsApi } from "@/shared/api";
import { classroomQueryKeys } from "@/entities/classroom/api/queryKeys";

export function useMyClassroomsQuery(params: { skip: number; limit: number }) {
  return useQuery({
    queryKey: classroomQueryKeys.myList(params),
    queryFn: async () => await classroomsApi.listMine(params),
  });
}

export function useClassroomQuery(classroomId: number) {
  return useQuery({
    queryKey: classroomQueryKeys.byId(classroomId),
    queryFn: async () => await classroomsApi.get(classroomId),
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });
}

export function useClassroomStudentsCountQuery(classroomId: number) {
  return useQuery({
    queryKey: classroomQueryKeys.studentsCount(classroomId),
    queryFn: async () => {
      const page = await classroomsApi.listStudents(classroomId, { skip: 0, limit: 1 });
      return page.total;
    },
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });
}

export function useClassroomLessonsQuery(classroomId: number) {
  return useQuery({
    queryKey: classroomQueryKeys.lessons(classroomId),
    queryFn: async () => await lessonsApi.listByClassroom(classroomId, { skip: 0, limit: 100 }),
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });
}


