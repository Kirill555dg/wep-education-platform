import "@/shared/api/openapi";

import {
  HomeworkService,
  TestingService,
  type AnswerSubmit,
  type HomeworkCreate,
  type HomeworkDetailResponse,
  type HomeworkResponse,
  type HomeworkUpdate,
  type Page_HomeworkResponse_,
  type ProblemFullResponse,
  type ProblemResponse,
  type StatisticsResponse,
} from "@/shared/api/generated";
import { clampLimit, clampSkip } from "@/shared/api/pagination";

export const homeworkApi = {
  async listByLesson(lessonId: number, params: { skip?: number; limit?: number } = {}): Promise<Page_HomeworkResponse_> {
    return await HomeworkService.getLessonHomeworkApiV1HomeworkLessonLessonIdGet(
      lessonId,
      clampSkip(params.skip),
      clampLimit(params.limit)
    );
  },

  async get(homeworkId: number): Promise<HomeworkDetailResponse> {
    return await HomeworkService.getHomeworkApiV1HomeworkHomeworkIdGet(homeworkId);
  },

  async create(payload: HomeworkCreate): Promise<HomeworkResponse> {
    return await HomeworkService.createHomeworkApiV1HomeworkPost(payload);
  },

  async update(homeworkId: number, payload: HomeworkUpdate): Promise<HomeworkResponse> {
    return await HomeworkService.updateHomeworkApiV1HomeworkHomeworkIdPatch(homeworkId, payload);
  },

  async remove(homeworkId: number): Promise<void> {
    return await HomeworkService.deleteHomeworkApiV1HomeworkHomeworkIdDelete(homeworkId);
  },

  async getProblems(homeworkId: number): Promise<Array<ProblemResponse | ProblemFullResponse>> {
    return await HomeworkService.getHomeworkProblemsApiV1HomeworkHomeworkIdProblemsGet(homeworkId);
  },

  async submitAnswer(payload: AnswerSubmit): Promise<StatisticsResponse> {
    return await TestingService.submitAnswerApiV1TestingSubmitAnswerPost(payload);
  },

  async submitHomework(homeworkId: number): Promise<StatisticsResponse> {
    return await TestingService.submitHomeworkApiV1TestingHomeworkHomeworkIdSubmitPost(homeworkId);
  },

  async getStatus(homeworkId: number): Promise<StatisticsResponse> {
    return await TestingService.getHomeworkStatusApiV1TestingHomeworkHomeworkIdStatusGet(homeworkId);
  },
} as const;


