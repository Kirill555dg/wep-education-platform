import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useProblemsList } from "@/entities/problem/api/queries";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { Input } from "@/shared/ui/input";

export function TeacherProblemsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");

  const params = useMemo(() => ({ skip: 0, limit: 100, q, type }), [q, type]);
  const query = useProblemsList(params);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">База задач</h1>
          <p className="text-sm text-muted-foreground">Создавайте задачи и используйте их при сборке домашних заданий</p>
        </div>
        <Button asChild>
          <Link to={routes.teacher.problemNew}>Создать задачу</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Поиск и фильтры</CardTitle>
          <CardDescription>Поиск по заголовку/тексту и фильтр по типу задачи</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Поиск</label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="например: дроби, уравнение..." />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Тип</label>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="short_answer / essay / ..." />
          </div>
        </CardContent>
      </Card>

      {query.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
      {query.error ? <ErrorState message={String((query.error as Error)?.message || query.error)} onRetry={() => query.refetch()} /> : null}

      {!query.isLoading && !query.error && query.data?.items?.length === 0 ? (
        <EmptyState
          title="Задач пока нет"
          description="Создайте первую задачу, чтобы быстро собирать домашние задания из базы."
          action={{ label: "Создать задачу", onClick: () => (window.location.href = routes.teacher.problemNew) }}
        />
      ) : null}

      {!query.isLoading && !query.error && query.data ? (
        <Card>
          <CardHeader>
            <CardTitle>Задачи</CardTitle>
            <CardDescription>Всего: {query.data.total}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {query.data.items.map((p) => (
              <div key={p.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.problem_type} · published: {String(p.is_published)}
                  </div>
                </div>
                <Button asChild size="sm" variant="secondary">
                  <Link to={`/teacher/problems/${p.id}`}>Открыть</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="text-xs text-muted-foreground">
        Подсказка: в сборке ДЗ на уроке будет доступен выбор задач из базы (следующий шаг).
      </div>
    </div>
  );
}


