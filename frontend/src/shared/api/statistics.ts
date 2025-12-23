import "@/shared/api/openapi";

import {
  StatisticsService,
  type ClassroomProgressResponse,
  type Page_StatisticsResponse_,
  type StudentProgressResponse,
  type StatisticsResponse,
} from "@/shared/api/generated";
import { clampLimit, clampSkip, fetchAllPages } from "@/shared/api/pagination";

export const statisticsApi = {
  async listMine(params: { skip?: number; limit?: number } = {}): Promise<Page_StatisticsResponse_> {
    return await StatisticsService.getMyStatisticsApiV1StatisticsMeGet(clampSkip(params.skip), clampLimit(params.limit));
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
      clampSkip(params.skip),
      clampLimit(params.limit)
    );
  },

  async homeworkStatsAll(
    homeworkId: number,
    opts: { maxItems?: number } = {}
  ): Promise<{ items: StatisticsResponse[]; total: number; truncated: boolean }> {
    return await fetchAllPages(async ({ skip, limit }) => await statisticsApi.homeworkStats(homeworkId, { skip, limit }), {
      maxItems: opts.maxItems,
    });
  },

  // Teacher: stats for a specific student across homeworks (filtering by classroom is done client-side)
  async studentStatsByTeacher(
    studentUserId: number,
    params: { skip?: number; limit?: number } = {}
  ): Promise<Page_StatisticsResponse_> {
    return await StatisticsService.getStudentStatisticsByTeacherApiV1StatisticsStudentStudentUserIdGet(
      studentUserId,
      clampSkip(params.skip),
      clampLimit(params.limit)
    );
  },

  async studentStatsByTeacherAll(
    studentUserId: number,
    opts: { maxItems?: number } = {}
  ): Promise<{ items: StatisticsResponse[]; total: number; truncated: boolean }> {
    return await fetchAllPages(
      async ({ skip, limit }) => await statisticsApi.studentStatsByTeacher(studentUserId, { skip, limit }),
      { maxItems: opts.maxItems }
    );
  },
} as const;

