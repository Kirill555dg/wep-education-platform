import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { classroomsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ErrorState } from "@/shared/ui/error-state";

export function TeacherStatsPage() {
  const classroomsQuery = useQuery({
    queryKey: ["stats", "teacher", "classrooms"],
    queryFn: async () => await classroomsApi.listMine({ skip: 0, limit: 100 }),
  });

  const classrooms = useMemo(() => classroomsQuery.data?.items ?? [], [classroomsQuery.data]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Статистика</h1>
        <p className="text-sm text-muted-foreground">Выберите класс — откроется детальная аналитика по ДЗ и ученикам</p>
      </div>

      {classroomsQuery.error ? (
        <ErrorState message={String((classroomsQuery.error as Error)?.message || classroomsQuery.error)} onRetry={() => classroomsQuery.refetch()} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Классы</CardTitle>
          <CardDescription>Детальная статистика: по классу → по ДЗ → по каждому ученику</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {classroomsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          {classrooms.length === 0 && !classroomsQuery.isLoading ? <div className="text-sm text-muted-foreground">Пока нет классов</div> : null}
          {classrooms.map((c) => (
            <div key={c.id} className="flex items-center justify-between border rounded-md px-3 py-2">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">
                  id: {c.id} · {c.subject}
                </div>
              </div>
              <Button asChild size="sm" variant="secondary">
                <Link to={routes.teacher.classroomStats(c.id)}>Открыть статистику</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


