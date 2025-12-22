import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { classroomsApi, statisticsApi } from "@/shared/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ErrorState } from "@/shared/ui/error-state";
import { Input } from "@/shared/ui/input";

export function TeacherStatsPage() {
  const classroomsQuery = useQuery({
    queryKey: ["stats", "teacher", "classrooms"],
    queryFn: async () => await classroomsApi.listMine({ skip: 0, limit: 100 }),
  });

  const classrooms = useMemo(() => classroomsQuery.data?.items ?? [], [classroomsQuery.data]);
  const [classroomIdText, setClassroomIdText] = useState("");
  const classroomId = Number(classroomIdText);

  const progressQuery = useQuery({
    queryKey: ["stats", "teacher", "classroom", classroomId],
    queryFn: async () => await statisticsApi.classroomProgress(classroomId),
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Статистика</h1>
        <p className="text-sm text-muted-foreground">Прогресс по классам (teacher)</p>
      </div>

      {classroomsQuery.error ? (
        <ErrorState message={String((classroomsQuery.error as Error)?.message || classroomsQuery.error)} onRetry={() => classroomsQuery.refetch()} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Выбор класса</CardTitle>
          <CardDescription>Выберите класс, чтобы увидеть прогресс</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <label className="text-sm font-medium">Classroom ID</label>
          <Input value={classroomIdText} onChange={(e) => setClassroomIdText(e.target.value)} placeholder="например: 1" />
          <div className="text-xs text-muted-foreground">
            Подсказка: ваши классы (id: name):
            <div className="mt-1 grid gap-1">
              {classroomsQuery.isLoading ? <div>Загрузка...</div> : null}
              {classrooms.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setClassroomIdText(String(c.id))}
                  className="text-left underline underline-offset-4 hover:text-foreground"
                >
                  {c.id}: {c.name}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {progressQuery.error ? (
        <ErrorState message={String((progressQuery.error as Error)?.message || progressQuery.error)} onRetry={() => progressQuery.refetch()} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Прогресс класса</CardTitle>
          <CardDescription>Агрегированные показатели</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {!progressQuery.isLoading && !progressQuery.data ? (
            <div className="text-muted-foreground">Выберите класс</div>
          ) : null}
          {progressQuery.isLoading ? <div className="text-muted-foreground">Загрузка...</div> : null}
          {progressQuery.data ? (
            <>
              <div>Всего учеников: {progressQuery.data.total_students}</div>
              <div>Всего ДЗ назначено: {progressQuery.data.total_homeworks_assigned}</div>
              <div>Выполнено ДЗ: {progressQuery.data.completed_homeworks}</div>
              <div>Средний completion rate: {progressQuery.data.average_completion_rate}%</div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}


