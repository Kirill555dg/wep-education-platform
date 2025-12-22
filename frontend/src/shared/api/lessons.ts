import "@/shared/api/openapi";

import {
  LessonsService,
  type LessonCreate,
  type LessonDetailResponse,
  type LessonResponse,
  type LessonUpdate,
  type Page_LessonResponse_,
} from "@/shared/api/generated";

export const lessonsApi = {
  async listByClassroom(classroomId: number, params: { skip?: number; limit?: number } = {}): Promise<Page_LessonResponse_> {
    return await LessonsService.getClassroomLessonsApiV1LessonsClassroomClassroomIdGet(
      classroomId,
      params.skip ?? 0,
      params.limit ?? 100
    );
  },

  async get(lessonId: number): Promise<LessonDetailResponse> {
    return await LessonsService.getLessonApiV1LessonsLessonIdGet(lessonId);
  },

  async create(payload: LessonCreate): Promise<LessonResponse> {
    return await LessonsService.createLessonApiV1LessonsPost(payload);
  },

  async update(lessonId: number, payload: LessonUpdate): Promise<LessonResponse> {
    return await LessonsService.updateLessonApiV1LessonsLessonIdPatch(lessonId, payload);
  },

  async remove(lessonId: number): Promise<void> {
    return await LessonsService.deleteLessonApiV1LessonsLessonIdDelete(lessonId);
  },
} as const;

