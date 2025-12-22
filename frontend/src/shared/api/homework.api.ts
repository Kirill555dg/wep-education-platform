/**
 * Homework API client
 */
import "./openapi";

import {
  HomeworkService,
  TestingService,
  type AnswerSubmit,
  type HomeworkCreate,
  type HomeworkDetailResponse,
  type HomeworkResponse,
  type HomeworkUpdate,
  type ProblemFullResponse,
  type ProblemResponse,
  type StatisticsResponse,
} from "@/api/client";

export const homeworkApi = {
  /**
   * Create new homework (teachers only)
   */
  create: async (data: HomeworkCreate): Promise<HomeworkResponse> => {
    return await HomeworkService.createHomeworkApiV1HomeworkPost(data);
  },

  /**
   * Get homework by ID
   */
  getById: async (homeworkId: number): Promise<HomeworkDetailResponse> => {
    return await HomeworkService.getHomeworkApiV1HomeworkHomeworkIdGet(homeworkId);
  },

  /**
   * Get all homework for a lesson
   */
  getByLesson: async (
    lessonId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<HomeworkResponse[]> => {
    const page = await HomeworkService.getLessonHomeworkApiV1HomeworkLessonLessonIdGet(
      lessonId,
      params?.skip ?? 0,
      params?.limit ?? 100
    );
    return page.items;
  },

  /**
   * Get all problems for homework
   * Teachers see problems with correct answers
   * Students see problems without correct answers
   */
  getProblems: async (
    homeworkId: number
  ): Promise<Array<ProblemResponse | ProblemFullResponse>> => {
    return await HomeworkService.getHomeworkProblemsApiV1HomeworkHomeworkIdProblemsGet(homeworkId);
  },

  /**
   * Update homework (teachers only, owner only)
   */
  update: async (homeworkId: number, data: HomeworkUpdate): Promise<HomeworkResponse> => {
    return await HomeworkService.updateHomeworkApiV1HomeworkHomeworkIdPatch(homeworkId, data);
  },

  /**
   * Submit answer for a problem (students only)
   */
  submitAnswer: async (data: AnswerSubmit): Promise<StatisticsResponse> => {
    return await TestingService.submitAnswerApiV1TestingSubmitAnswerPost(data);
  },

  /**
   * Submit homework for final grading (students only)
   */
  submitHomework: async (homeworkId: number): Promise<StatisticsResponse> => {
    return await TestingService.submitHomeworkApiV1TestingHomeworkHomeworkIdSubmitPost(homeworkId);
  },

  /**
   * Get current status/progress for homework (students only)
   */
  getStatus: async (homeworkId: number): Promise<StatisticsResponse> => {
    return await TestingService.getHomeworkStatusApiV1TestingHomeworkHomeworkIdStatusGet(homeworkId);
  },
};

