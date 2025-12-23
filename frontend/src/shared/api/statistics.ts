import "@/shared/api/openapi";

import {
  StatisticsService,
  type ClassroomProgressResponse,
  type Page_StatisticsResponse_,
  type StudentProgressResponse,
  type StatisticsResponse,
} from "@/shared/api/generated";
import { clampLimit, clampSkip, fetchAllPages } from "@/shared/api/pagination";
import { env } from "@/shared/config/env";
import { isApiError } from "@/shared/api/errors";
import { mockClassroomProgress, mockHomeworkStats, mockStudentProgress, mockStudentStats } from "@/shared/api/mock/statistics";

export const statisticsApi = {
  async listMine(params: { skip?: number; limit?: number } = {}): Promise<Page_StatisticsResponse_> {
    return await StatisticsService.getMyStatisticsApiV1StatisticsMeGet(clampSkip(params.skip), clampLimit(params.limit));
  },

  async myProgress(): Promise<StudentProgressResponse> {
    try {
      return await StatisticsService.getMyProgressApiV1StatisticsMeProgressGet();
    } catch (e) {
      if (env.useMockApi) return mockStudentProgress(Number(localStorage.getItem("user_id") || "1"));
      throw e;
    }
  },

  async classroomProgress(classroomId: number): Promise<ClassroomProgressResponse> {
    try {
      return await StatisticsService.getClassroomProgressApiV1StatisticsClassroomClassroomIdProgressGet(classroomId);
    } catch (e) {
      if (env.useMockApi) return mockClassroomProgress(classroomId);
      throw e;
    }
  },

  // Teacher: stats for all students for a homework
  async homeworkStats(homeworkId: number, params: { skip?: number; limit?: number } = {}): Promise<Page_StatisticsResponse_> {
    try {
      return await StatisticsService.getHomeworkStatisticsApiV1StatisticsHomeworkHomeworkIdGet(
        homeworkId,
        clampSkip(params.skip),
        clampLimit(params.limit)
      );
    } catch (e) {
      if (env.useMockApi && isApiError(e) && [404, 501, 500].includes(e.status)) {
        return mockHomeworkStats(homeworkId, { skip: clampSkip(params.skip), limit: clampLimit(params.limit) });
      }
      throw e;
    }
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
    try {
      return await StatisticsService.getStudentStatisticsByTeacherApiV1StatisticsStudentStudentUserIdGet(
        studentUserId,
        clampSkip(params.skip),
        clampLimit(params.limit)
      );
    } catch (e) {
      if (env.useMockApi && isApiError(e) && [404, 501, 500].includes(e.status)) {
        return mockStudentStats(studentUserId, { skip: clampSkip(params.skip), limit: clampLimit(params.limit) });
      }
      throw e;
    }
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

