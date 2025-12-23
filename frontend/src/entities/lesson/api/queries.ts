import { useQuery } from "@tanstack/react-query";

import { homeworkApi, lessonsApi } from "@/shared/api";
import { lessonQueryKeys } from "@/entities/lesson/api/queryKeys";

export function useLessonQuery(lessonId: number) {
  return useQuery({
    queryKey: lessonQueryKeys.byId(lessonId),
    queryFn: async () => await lessonsApi.get(lessonId),
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });
}

export function useLessonHomeworksQuery(lessonId: number) {
  return useQuery({
    queryKey: lessonQueryKeys.homeworks(lessonId),
    queryFn: async () => await homeworkApi.listByLesson(lessonId, { skip: 0, limit: 100 }),
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });
}


