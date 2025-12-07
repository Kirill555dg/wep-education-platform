/**
 * Classroom API client
 */
import { axiosInstance } from "./axios";
import type {
  Classroom,
  ClassroomCreateDTO,
  ClassroomUpdateDTO,
  JoinClassroomDTO,
} from "./types";

const CLASSROOMS_PREFIX = "/api/v1/classrooms";

export const classroomsApi = {
  /**
   * Create new classroom (teachers only)
   */
  create: async (data: ClassroomCreateDTO): Promise<Classroom> => {
    const response = await axiosInstance.post<Classroom>(CLASSROOMS_PREFIX, data);
    return response.data;
  },

  /**
   * Get all classrooms for current user
   * Teachers: classrooms they created
   * Students: classrooms they joined
   */
  getAll: async (params?: { skip?: number; limit?: number }): Promise<Classroom[]> => {
    const response = await axiosInstance.get<Classroom[]>(CLASSROOMS_PREFIX, {
      params: {
        skip: params?.skip ?? 0,
        limit: params?.limit ?? 100,
      },
    });
    return response.data;
  },

  /**
   * Get classroom by ID
   */
  getById: async (classroomId: number): Promise<Classroom> => {
    const response = await axiosInstance.get<Classroom>(
      `${CLASSROOMS_PREFIX}/${classroomId}`
    );
    return response.data;
  },

  /**
   * Update classroom (teachers only, owner only)
   */
  update: async (classroomId: number, data: ClassroomUpdateDTO): Promise<Classroom> => {
    const response = await axiosInstance.patch<Classroom>(
      `${CLASSROOMS_PREFIX}/${classroomId}`,
      data
    );
    return response.data;
  },

  /**
   * Join classroom via invite code (students only)
   */
  join: async (data: JoinClassroomDTO): Promise<Classroom> => {
    const response = await axiosInstance.post<Classroom>(
      `${CLASSROOMS_PREFIX}/join`,
      data
    );
    return response.data;
  },

  /**
   * Get list of students in classroom (teachers only)
   */
  getStudents: async (
    classroomId: number,
    params?: { skip?: number; limit?: number }
  ): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(
      `${CLASSROOMS_PREFIX}/${classroomId}/students`,
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

