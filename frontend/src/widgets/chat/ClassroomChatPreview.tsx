import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { classroomsApi, getErrorMessage } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import type { MessageResponse } from "@/shared/api/generated";

export function ClassroomChatPreview(props: { classroomId: number }) {
  const { classroomId } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await classroomsApi.listChatMessages(classroomId, { tail: true, limit: 5, skip: 0 });
      setMessages(page.items);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [classroomId]);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{loading ? "Загрузка..." : "Последние сообщения"}</div>
        <Button asChild variant="outline" size="sm">
          <Link to={`${routes.chat}?classroomId=${classroomId}`}>Открыть чат</Link>
        </Button>
      </div>

      {error ? <div className="text-sm text-destructive">{error}</div> : null}

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


