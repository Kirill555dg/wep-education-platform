import { Link } from "react-router-dom";

import { getErrorMessage } from "@/shared/api";
import { useChatTailMessagesQuery } from "@/entities/chat/api/queries";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";

export function ClassroomChatPreview(props: { classroomId: number }) {
  const { classroomId } = props;
  const messagesQuery = useChatTailMessagesQuery(classroomId, { limit: 5 });
  const messages = messagesQuery.data?.items ?? [];

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{messagesQuery.isLoading ? "Загрузка..." : "Последние сообщения"}</div>
        <Button asChild variant="outline" size="sm">
          <Link to={`${routes.chat}?classroomId=${classroomId}`}>Открыть чат</Link>
        </Button>
      </div>

      {messagesQuery.error ? <div className="text-sm text-destructive">{getErrorMessage(messagesQuery.error)}</div> : null}

      <div className="border rounded-md p-3 bg-muted/20">
        {messages.length === 0 ? <div className="text-sm text-muted-foreground">Нет сообщений</div> : null}
        <div className="grid gap-2">
          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <span className="text-muted-foreground">{m.sender?.full_name || `user#${m.sender_id}`}: </span>
              <span>{m.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


