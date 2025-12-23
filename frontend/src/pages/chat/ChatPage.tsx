import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { getErrorMessage } from "@/shared/api";
import { useMyClassroomsQuery } from "@/entities/classroom/api/queries";
import { routes } from "@/shared/config/routes";
import { useSessionStore } from "@/entities/session/model/store";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ClassroomChat } from "@/widgets/chat/ClassroomChat";

type ClassroomListItem = { id: number; name: string; subject: string };

export function ChatPage() {
  const user = useSessionStore((s) => s.user);
  const [params, setParams] = useSearchParams();
  const selectedId = Number(params.get("classroomId") || "");

  const classroomsQuery = useMyClassroomsQuery({ skip: 0, limit: 100 });
  const items = useMemo(
    () => (classroomsQuery.data?.items ?? []).map((c) => ({ id: c.id, name: c.name, subject: c.subject })),
    [classroomsQuery.data]
  );
  const selected = useMemo(() => items.find((c) => c.id === selectedId) || null, [items, selectedId]);

  useEffect(() => {
    if (Number.isFinite(selectedId)) return;
    if (items.length === 0) return;
    setParams({ classroomId: String(items[0].id) }, { replace: true });
  }, [items, selectedId, setParams]);

  const selectClassroom = (id: number) => {
    setParams({ classroomId: String(id) }, { replace: true });
  };

  const sidebar = (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Классы</CardTitle>
        <CardDescription>Выберите класс для чата</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {classroomsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
        {classroomsQuery.error ? (
          <ErrorState message={getErrorMessage(classroomsQuery.error)} onRetry={() => void classroomsQuery.refetch()} />
        ) : null}
        {!classroomsQuery.isLoading && !classroomsQuery.error && items.length === 0 ? (
          <EmptyState title="Нет классов" description="Создайте класс (teacher) или вступите по коду (student)." />
        ) : null}
        {!classroomsQuery.isLoading && !classroomsQuery.error
          ? items.map((c) => (
              <button
                key={c.id}
                onClick={() => selectClassroom(c.id)}
                className={[
                  "text-left rounded-md border px-3 py-2 transition-colors",
                  selectedId === c.id ? "bg-muted border-muted-foreground/20" : "hover:bg-muted/40",
                ].join(" ")}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.subject}</div>
              </button>
            ))
          : null}
      </CardContent>
    </Card>
  );

  const chatPanel = (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>{selected ? selected.name : "Чат"}</span>
          {selected ? (
            <Button asChild variant="outline" size="sm">
              <Link
                to={user?.role === "teacher" ? routes.teacher.classroom(selected.id) : routes.student.classroom(selected.id)}
              >
                Открыть класс
              </Link>
            </Button>
          ) : null}
        </CardTitle>
        <CardDescription>{selected ? selected.subject : "Выберите класс слева"}</CardDescription>
      </CardHeader>
      <CardContent>
        {!selected ? (
          <EmptyState title="Выберите класс" description="Слева выберите класс, чтобы открыть чат." variant="compact" />
        ) : (
          <ClassroomChat classroomId={selected.id} />
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Чат</h1>
        <p className="text-sm text-muted-foreground">Обсуждения по классам в одном месте</p>
      </div>

      <div className="hidden lg:grid grid-cols-[320px_1fr] gap-4">
        {sidebar}
        {chatPanel}
      </div>

      <div className="lg:hidden">
        <Tabs defaultValue="chat">
          <TabsList className="w-full">
            <TabsTrigger className="flex-1" value="chat">
              Чат
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="classes">
              Классы
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-4">
            {chatPanel}
          </TabsContent>
          <TabsContent value="classes" className="mt-4">
            {sidebar}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


