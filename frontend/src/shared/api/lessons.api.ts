/**
 * Lesson API client
 */
import { axiosInstance } from "./axios";
import type {
  Lesson,
  LessonDetail,
  LessonCreateDTO,
  LessonUpdateDTO,
} from "./types";

const LESSONS_PREFIX = "/api/v1/lessons";

export const lessonsApi = {
  /**
   * Create new lesson (teachers only)
   */
  create: async (data: LessonCreateDTO): Promise<Lesson> => {
    const response = await axiosInstance.post<Lesson>(LESSONS_PREFIX, data);
    return response.data;
  },

  /**
   * Get all lessons for a classroom
   * Teachers see all lessons (including unpublished)
   * Students see only published lessons
   */
  getByClassroom: async (
    classroomId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<Lesson[]> => {
    const response = await axiosInstance.get<Lesson[]>(
      `${LESSONS_PREFIX}/classroom/${classroomId}`,
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
   * Get lesson details by ID
   */
  getById: async (lessonId: number): Promise<LessonDetail> => {
    const response = await axiosInstance.get<LessonDetail>(
      `${LESSONS_PREFIX}/${lessonId}`
    );
    return response.data;
  },

  /**
   * Update lesson (teachers only, owner only)
   */
  update: async (lessonId: number, data: LessonUpdateDTO): Promise<Lesson> => {
    const response = await axiosInstance.patch<Lesson>(
      `${LESSONS_PREFIX}/${lessonId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete lesson (teachers only, owner only)
   */
  delete: async (lessonId: number): Promise<void> => {
    await axiosInstance.delete(`${LESSONS_PREFIX}/${lessonId}`);
  },
};

