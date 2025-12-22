import "@/shared/api/openapi";

import {
  StatisticsService,
  type ClassroomProgressResponse,
  type Page_StatisticsResponse_,
  type StudentProgressResponse,
} from "@/shared/api/generated";

export const statisticsApi = {
  async listMine(params: { skip?: number; limit?: number } = {}): Promise<Page_StatisticsResponse_> {
    return await StatisticsService.getMyStatisticsApiV1StatisticsMeGet(params.skip ?? 0, params.limit ?? 100);
  },

  async myProgress(): Promise<StudentProgressResponse> {
    return await StatisticsService.getMyProgressApiV1StatisticsMeProgressGet();
  },

  async classroomProgress(classroomId: number): Promise<ClassroomProgressResponse> {
    return await StatisticsService.getClassroomProgressApiV1StatisticsClassroomClassroomIdProgressGet(classroomId);
  },

  // Teacher: stats for all students for a homework
  async homeworkStats(homeworkId: number, params: { skip?: number; limit?: number } = {}): Promise<Page_StatisticsResponse_> {
    return await StatisticsService.getHomeworkStatisticsApiV1StatisticsHomeworkHomeworkIdGet(
      homeworkId,
      params.skip ?? 0,
      params.limit ?? 100
    );
  },

  // Teacher: stats for a specific student across homeworks (filtering by classroom is done client-side)
  async studentStatsByTeacher(
    studentUserId: number,
    params: { skip?: number; limit?: number } = {}
  ): Promise<Page_StatisticsResponse_> {
    return await StatisticsService.getStudentStatisticsByTeacherApiV1StatisticsStudentStudentUserIdGet(
      studentUserId,
      params.skip ?? 0,
      params.limit ?? 100
    );
  },
} as const;

