import { useQuery } from "@tanstack/react-query";

import { classroomsApi } from "@/shared/api";
import { chatQueryKeys } from "@/entities/chat/api/queryKeys";

export function useChatTailMessagesQuery(classroomId: number, params: { limit: number }) {
  return useQuery({
    queryKey: chatQueryKeys.tailMessages(classroomId, params),
    queryFn: async () => await classroomsApi.listChatMessages(classroomId, { tail: true, limit: params.limit, skip: 0 }),
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });
}


