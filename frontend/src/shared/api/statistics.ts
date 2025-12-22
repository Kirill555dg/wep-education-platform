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
} as const;

