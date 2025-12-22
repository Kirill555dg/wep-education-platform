/**
 * Statistics API client
 */
import "./openapi";

import {
  StatisticsService,
  type StatisticsResponse,
} from "@/api/client";

export const statisticsApi = {
  /**
   * Get all statistics for current student
   */
  getMy: async (params?: { skip?: number; limit?: number }): Promise<StatisticsResponse[]> => {
    const page = await StatisticsService.getMyStatisticsApiV1StatisticsMeGet(
      params?.skip ?? 0,
      params?.limit ?? 100
    );
    return page.items;
  },

  /**
   * Get overall progress for current student
   */
  getMyProgress: async () => {
    return await StatisticsService.getMyProgressApiV1StatisticsMeProgressGet();
  },

  /**
   * Get statistics for all students for a specific homework (teachers only)
   */
  getHomeworkStats: async (
    homeworkId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<StatisticsResponse[]> => {
    const page = await StatisticsService.getHomeworkStatisticsApiV1StatisticsHomeworkHomeworkIdGet(
      homeworkId,
      params?.skip ?? 0,
      params?.limit ?? 100
    );
    return page.items;
  },

  /**
   * Get overall progress for a classroom (teachers only)
   */
  getClassroomProgress: async (classroomId: number) => {
    return await StatisticsService.getClassroomProgressApiV1StatisticsClassroomClassroomIdProgressGet(classroomId);
  },

  /**
   * Get statistics for a specific student (teachers only)
   */
  getStudentStats: async (
    studentUserId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<StatisticsResponse[]> => {
    const page = await StatisticsService.getStudentStatisticsByTeacherApiV1StatisticsStudentStudentUserIdGet(
      studentUserId,
      params?.skip ?? 0,
      params?.limit ?? 100
    );
    return page.items;
  },
};

