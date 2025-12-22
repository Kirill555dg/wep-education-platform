/**
 * Lesson API client
 */
import "./openapi";

import {
  LessonsService,
  type LessonCreate,
  type LessonDetailResponse,
  type LessonResponse,
  type LessonUpdate,
} from "@/api/client";

export const lessonsApi = {
  /**
   * Create new lesson (teachers only)
   */
  create: async (data: LessonCreate): Promise<LessonResponse> => {
    return await LessonsService.createLessonApiV1LessonsPost(data);
  },

  /**
   * Get all lessons for a classroom
   * Teachers see all lessons (including unpublished)
   * Students see only published lessons
   */
  getByClassroom: async (
    classroomId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<LessonResponse[]> => {
    const page = await LessonsService.getClassroomLessonsApiV1LessonsClassroomClassroomIdGet(
      classroomId,
      params?.skip ?? 0,
      params?.limit ?? 100
    );
    return page.items;
  },

  /**
   * Get lesson details by ID
   */
  getById: async (lessonId: number): Promise<LessonDetailResponse> => {
    return await LessonsService.getLessonApiV1LessonsLessonIdGet(lessonId);
  },

  /**
   * Update lesson (teachers only, owner only)
   */
  update: async (lessonId: number, data: LessonUpdate): Promise<LessonResponse> => {
    return await LessonsService.updateLessonApiV1LessonsLessonIdPatch(lessonId, data);
  },

  /**
   * Delete lesson (teachers only, owner only)
   */
  delete: async (lessonId: number): Promise<void> => {
    await LessonsService.deleteLessonApiV1LessonsLessonIdDelete(lessonId);
  },
};

