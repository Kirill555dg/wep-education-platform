/**
 * Classroom API client
 */
import "./openapi";

import {
  ClassroomsService,
  type ClassroomCreate,
  type ClassroomResponse,
  type ClassroomUpdate,
  type JoinClassroomRequest,
} from "@/api/client";

export const classroomsApi = {
  /**
   * Create new classroom (teachers only)
   */
  create: async (data: ClassroomCreate): Promise<ClassroomResponse> => {
    return await ClassroomsService.createClassroomApiV1ClassroomsPost(data);
  },

  /**
   * Get all classrooms for current user
   * Teachers: classrooms they created
   * Students: classrooms they joined
   */
  getAll: async (params?: { skip?: number; limit?: number }): Promise<ClassroomResponse[]> => {
    const page = await ClassroomsService.getMyClassroomsApiV1ClassroomsGet(
      params?.skip ?? 0,
      params?.limit ?? 100
    );
    return page.items;
  },

  /**
   * Get classroom by ID
   */
  getById: async (classroomId: number): Promise<ClassroomResponse> => {
    return await ClassroomsService.getClassroomApiV1ClassroomsClassroomIdGet(classroomId);
  },

  /**
   * Update classroom (teachers only, owner only)
   */
  update: async (classroomId: number, data: ClassroomUpdate): Promise<ClassroomResponse> => {
    return await ClassroomsService.updateClassroomApiV1ClassroomsClassroomIdPatch(classroomId, data);
  },

  /**
   * Join classroom via invite code (students only)
   */
  join: async (data: JoinClassroomRequest): Promise<ClassroomResponse> => {
    return await ClassroomsService.joinClassroomApiV1ClassroomsJoinPost(data);
  },

  /**
   * Get list of students in classroom (teachers only)
   */
  getStudents: async (
    classroomId: number,
    params?: { skip?: number; limit?: number }
  ) => {
    const page = await ClassroomsService.getClassroomStudentsApiV1ClassroomsClassroomIdStudentsGet(
      classroomId,
      params?.skip ?? 0,
      params?.limit ?? 100
    );
    return page.items;
  },
};

