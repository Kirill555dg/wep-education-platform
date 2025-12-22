import { useEffect, useMemo, useRef, useState } from "react";

import { classroomsApi, getErrorMessage } from "@/shared/api";
import { env } from "@/shared/config/env";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import type { MessageResponse } from "@/shared/api/generated";

type WsState = "connecting" | "open" | "closed" | "error" | "unsupported";

function toWsBaseUrl(httpBaseUrl: string): string {
  if (httpBaseUrl.startsWith("https://")) return httpBaseUrl.replace("https://", "wss://");
  if (httpBaseUrl.startsWith("http://")) return httpBaseUrl.replace("http://", "ws://");
  return httpBaseUrl;
}

function getWsOrigin(httpBaseUrl: string): string {
  // Prod: same-origin behind nginx (`env.apiBaseUrl === ""`).
  if (!httpBaseUrl) {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}`;
  }
  return toWsBaseUrl(httpBaseUrl);
}

export function ClassroomChat(props: { classroomId: number }) {
  const { classroomId } = props;

  const [wsState, setWsState] = useState<WsState>("connecting");
  const [wsError, setWsError] = useState<string | null>(null);

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const pingRef = useRef<number | null>(null);

  const wsUrl = useMemo(() => {
    const token = localStorage.getItem("access_token") || "";
    const origin = getWsOrigin(env.apiBaseUrl);
    return `${origin}/api/v1/classrooms/${classroomId}/chat/ws?token=${encodeURIComponent(token)}`;
  }, [classroomId]);

  const loadTail = async () => {
    try {
      const page = await classroomsApi.listChatMessages(classroomId, { tail: true, limit: 50, skip: 0 });
      setMessages(page.items);
    } catch (e) {
      setWsError(getErrorMessage(e));
    }
  };

  useEffect(() => {
    void loadTail();
  }, [classroomId]);

  useEffect(() => {
    if (typeof WebSocket === "undefined") {
      setWsState("unsupported");
      return;
    }

    setWsState("connecting");
    setWsError(null);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsState("open");

      // Keep presence alive (server also has keepalive, but ping helps detect dead connections).
      pingRef.current = window.setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 15_000);
    };

    ws.onclose = () => {
      setWsState("closed");
      if (pingRef.current) {
        window.clearInterval(pingRef.current);
        pingRef.current = null;
      }
    };

    ws.onerror = () => {
      setWsState("error");
      setWsError("WebSocket error");
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as any;
        if (!data || typeof data !== "object") return;

        if (data.type === "message" && data.payload) {
          setMessages((prev) => {
            const msg = data.payload as MessageResponse;
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          return;
        }

        if (data.type === "ready") {
          // noop (presence snapshot)
          return;
        }

        if (data.type === "error") {
          const code = data?.error?.code;
          const message = data?.error?.message || "Realtime error";
          setWsError(`${code ? `[${code}] ` : ""}${message}`);
          return;
        }
      } catch {
        // ignore
      }
    };

    return () => {
      if (pingRef.current) {
        window.clearInterval(pingRef.current);
        pingRef.current = null;
      }
      wsRef.current = null;
      ws.close();
    };
  }, [wsUrl]);

  const send = async () => {
    const content = input.trim();
    if (!content) return;

    setSending(true);
    setWsError(null);
    try {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "message", content }));
      } else {
        // Fallback to HTTP post (still persists, but no realtime fanout).
        const msg = await classroomsApi.postChatMessage(classroomId, { content });
        setMessages((prev) => [...prev, msg]);
      }
      setInput("");
    } catch (e) {
      setWsError(getErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground" data-testid="chat-status">
          chat: {wsState}
        </div>
        <div className="text-xs text-muted-foreground">
          <a className="underline" href={`/chat?classroomId=${classroomId}`}>
            Открыть в чате
          </a>
        </div>
        {wsError ? (
          <div className="text-xs text-destructive" data-testid="chat-error">
            {wsError}
          </div>
        ) : null}
      </div>

      <div className="border rounded-md p-3 h-64 overflow-auto bg-muted/20" data-testid="chat-message-list">
        {messages.length === 0 ? <div className="text-sm text-muted-foreground">Нет сообщений</div> : null}
        <div className="grid gap-2">
          {messages.map((m) => (
            <div key={m.id} className="text-sm" data-testid="chat-message-item">
              <span className="text-muted-foreground">{m.sender?.full_name || `user#${m.sender_id}`}: </span>
              <span>{m.content}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Сообщение..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void send();
            }
          }}
          data-testid="chat-input"
        />
        <Button onClick={() => void send()} disabled={sending || !input.trim()} data-testid="chat-send">
          Отправить
        </Button>
      </div>
    </div>
  );
}


