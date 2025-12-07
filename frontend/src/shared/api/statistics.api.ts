/**
 * Statistics API client
 */
import { axiosInstance } from "./axios";
import type {
  Statistics,
  StudentProgress,
  ClassroomProgress,
} from "./types";

const STATISTICS_PREFIX = "/api/v1/statistics";

export const statisticsApi = {
  /**
   * Get all statistics for current student
   */
  getMy: async (params?: { skip?: number; limit?: number }): Promise<Statistics[]> => {
    const response = await axiosInstance.get<Statistics[]>(`${STATISTICS_PREFIX}/me`, {
      params: {
        skip: params?.skip ?? 0,
        limit: params?.limit ?? 100,
      },
    });
    return response.data;
  },

  /**
   * Get overall progress for current student
   */
  getMyProgress: async (): Promise<StudentProgress> => {
    const response = await axiosInstance.get<StudentProgress>(
      `${STATISTICS_PREFIX}/me/progress`
    );
    return response.data;
  },

  /**
   * Get statistics for all students for a specific homework (teachers only)
   */
  getHomeworkStats: async (
    homeworkId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<Statistics[]> => {
    const response = await axiosInstance.get<Statistics[]>(
      `${STATISTICS_PREFIX}/homework/${homeworkId}`,
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
   * Get overall progress for a classroom (teachers only)
   */
  getClassroomProgress: async (classroomId: number): Promise<ClassroomProgress> => {
    const response = await axiosInstance.get<ClassroomProgress>(
      `${STATISTICS_PREFIX}/classroom/${classroomId}/progress`
    );
    return response.data;
  },

  /**
   * Get statistics for a specific student (teachers only)
   */
  getStudentStats: async (
    studentUserId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<Statistics[]> => {
    const response = await axiosInstance.get<Statistics[]>(
      `${STATISTICS_PREFIX}/student/${studentUserId}`,
      {
        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 100,
        },
      }
    );
    return response.data;
  },
};

