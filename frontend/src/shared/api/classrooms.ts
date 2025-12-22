import "@/shared/api/openapi";

import {
  ClassroomsService,
  type ClassroomCreate,
  type ClassroomResponse,
  type ClassroomStudentResponse,
  type ClassroomUpdate,
  type JoinClassroomRequest,
  type MessageCreate,
  type MessageResponse,
  type Page_ClassroomResponse_,
  type Page_ClassroomStudentResponse_,
  type Page_MessageResponse_,
} from "@/shared/api/generated";

export const classroomsApi = {
  async listMine(params: { skip?: number; limit?: number } = {}): Promise<Page_ClassroomResponse_> {
    return await ClassroomsService.getMyClassroomsApiV1ClassroomsGet(params.skip ?? 0, params.limit ?? 100);
  },

  async create(payload: ClassroomCreate): Promise<ClassroomResponse> {
    return await ClassroomsService.createClassroomApiV1ClassroomsPost(payload);
  },

  async get(classroomId: number): Promise<ClassroomResponse> {
    return await ClassroomsService.getClassroomApiV1ClassroomsClassroomIdGet(classroomId);
  },

  async update(classroomId: number, payload: ClassroomUpdate): Promise<ClassroomResponse> {
    return await ClassroomsService.updateClassroomApiV1ClassroomsClassroomIdPatch(classroomId, payload);
  },

  async join(payload: JoinClassroomRequest): Promise<ClassroomResponse> {
    return await ClassroomsService.joinClassroomApiV1ClassroomsJoinPost(payload);
  },

  async listStudents(
    classroomId: number,
    params: { skip?: number; limit?: number } = {}
  ): Promise<Page_ClassroomStudentResponse_> {
    return await ClassroomsService.getClassroomStudentsApiV1ClassroomsClassroomIdStudentsGet(
      classroomId,
      params.skip ?? 0,
      params.limit ?? 100
    );
  },

  async listChatMessages(
    classroomId: number,
    params: { beforeId?: number | null; tail?: boolean; skip?: number; limit?: number } = {}
  ): Promise<Page_MessageResponse_> {
    return await ClassroomsService.listChatMessagesApiV1ClassroomsClassroomIdChatMessagesGet(
      classroomId,
      params.beforeId ?? null,
      params.tail ?? false,
      params.skip ?? 0,
      params.limit ?? 100
    );
  },

  async postChatMessage(classroomId: number, payload: MessageCreate): Promise<MessageResponse> {
    return await ClassroomsService.postChatMessageApiV1ClassroomsClassroomIdChatMessagesPost(classroomId, payload);
  },
} as const;


