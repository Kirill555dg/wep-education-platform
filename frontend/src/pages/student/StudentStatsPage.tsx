import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { statisticsApi } from "@/shared/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ErrorState } from "@/shared/ui/error-state";

export function StudentStatsPage() {
  const progressQuery = useQuery({
    queryKey: ["stats", "student", "progress"],
    queryFn: async () => await statisticsApi.myProgress(),
  });

  const listQuery = useQuery({
    queryKey: ["stats", "student", "list"],
    queryFn: async () => await statisticsApi.listMine({ skip: 0, limit: 100 }),
  });

  const items = useMemo(() => listQuery.data?.items ?? [], [listQuery.data]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Статистика</h1>
        <p className="text-sm text-muted-foreground">Ваш прогресс и попытки по домашним заданиям</p>
      </div>

      {progressQuery.error ? (
        <ErrorState message={String((progressQuery.error as Error)?.message || progressQuery.error)} onRetry={() => progressQuery.refetch()} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Мой прогресс</CardTitle>
          <CardDescription>Агрегированные показатели</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {progressQuery.isLoading ? (
            <div className="text-muted-foreground">Загрузка...</div>
          ) : progressQuery.data ? (
            <>
              <div>Всего ДЗ: {progressQuery.data.total_homeworks}</div>
              <div>Выполнено: {progressQuery.data.completed}</div>
              <div>В процессе: {progressQuery.data.in_progress}</div>
              <div>Не начато: {progressQuery.data.not_started}</div>
              <div>Средний процент: {progressQuery.data.average_score_percentage}%</div>
              <div>Попыток: {progressQuery.data.total_attempts}</div>
              <div>Времени (мин): {progressQuery.data.total_time_spent_minutes}</div>
            </>
          ) : (
            <div className="text-muted-foreground">Нет данных</div>
          )}
        </CardContent>
      </Card>

      {listQuery.error ? (
        <ErrorState message={String((listQuery.error as Error)?.message || listQuery.error)} onRetry={() => listQuery.refetch()} />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Попытки</CardTitle>
          <CardDescription>Последние попытки по домашним заданиям</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {listQuery.isLoading ? <div className="text-muted-foreground">Загрузка...</div> : null}
          {!listQuery.isLoading && items.length === 0 ? <div className="text-muted-foreground">Пока нет попыток</div> : null}
          {items.map((row) => (
            <div key={row.id} className="flex items-center justify-between border rounded-md px-3 py-2">
              <div>
                <div className="font-medium">Homework #{row.homework_id}</div>
                <div className="text-xs text-muted-foreground">
                  status: {row.status ?? "-"} · attempts: {row.attempts_count}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {(row.score ?? 0)}/{row.max_score}
                </div>
                <div className="text-xs text-muted-foreground">{row.time_spent_minutes ?? 0} мин</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


