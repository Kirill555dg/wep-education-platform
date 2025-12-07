/**
 * Homework API client
 */
import { axiosInstance } from "./axios";
import type {
  Homework,
  HomeworkDetail,
  HomeworkCreateDTO,
  HomeworkUpdateDTO,
  Problem,
  ProblemFull,
  AnswerSubmitDTO,
  Statistics,
} from "./types";

const HOMEWORK_PREFIX = "/api/v1/homework";
const TESTING_PREFIX = "/api/v1/testing";

export const homeworkApi = {
  /**
   * Create new homework (teachers only)
   */
  create: async (data: HomeworkCreateDTO): Promise<Homework> => {
    const response = await axiosInstance.post<Homework>(HOMEWORK_PREFIX, data);
    return response.data;
  },

  /**
   * Get homework by ID
   */
  getById: async (homeworkId: number): Promise<HomeworkDetail> => {
    const response = await axiosInstance.get<HomeworkDetail>(
      `${HOMEWORK_PREFIX}/${homeworkId}`
    );
    return response.data;
  },

  /**
   * Get all homework for a lesson
   */
  getByLesson: async (lessonId: number, params?: { skip?: number; limit?: number }): Promise<Homework[]> => {
    const response = await axiosInstance.get<Homework[]>(
      `${HOMEWORK_PREFIX}/lesson/${lessonId}`,
      {
        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 100,
        },
      }
    );
    return response.data;
  },

  /**
   * Get all problems for homework
   * Teachers see problems with correct answers
   * Students see problems without correct answers
   */
  getProblems: async (homeworkId: number): Promise<(Problem | ProblemFull)[]> => {
    const response = await axiosInstance.get<(Problem | ProblemFull)[]>(
      `${HOMEWORK_PREFIX}/${homeworkId}/problems`
    );
    return response.data;
  },

  /**
   * Update homework (teachers only, owner only)
   */
  update: async (homeworkId: number, data: HomeworkUpdateDTO): Promise<Homework> => {
    const response = await axiosInstance.patch<Homework>(
      `${HOMEWORK_PREFIX}/${homeworkId}`,
      data
    );
    return response.data;
  },

  /**
   * Submit answer for a problem (students only)
   */
  submitAnswer: async (data: AnswerSubmitDTO): Promise<Statistics> => {
    const response = await axiosInstance.post<Statistics>(
      `${TESTING_PREFIX}/submit-answer`,
      data
    );
    return response.data;
  },

  /**
   * Submit homework for final grading (students only)
   */
  submitHomework: async (homeworkId: number): Promise<Statistics> => {
    const response = await axiosInstance.post<Statistics>(
      `${TESTING_PREFIX}/homework/${homeworkId}/submit`
    );
    return response.data;
  },

  /**
   * Get current status/progress for homework (students only)
   */
  getStatus: async (homeworkId: number): Promise<Statistics> => {
    const response = await axiosInstance.get<Statistics>(
      `${TESTING_PREFIX}/homework/${homeworkId}/status`
    );
    return response.data;
  },
};

