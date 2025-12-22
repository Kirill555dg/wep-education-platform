import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { useProblemsList } from "@/entities/problem/api/queries";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { Input } from "@/shared/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import type { ProblemFullResponse } from "@/shared/api/generated";

export function TeacherProblemsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");

  const [skip, setSkip] = useState(0);
  const limit = 50;
  const params = useMemo(() => ({ skip, limit, q, type }), [skip, limit, q, type]);
  const query = useProblemsList(params);
  const total = query.data?.total ?? 0;
  const canPrev = skip > 0;
  const canNext = skip + limit < total;

  const columns = useMemo<Array<ColumnDef<ProblemFullResponse>>>(
    () => [
      {
        header: "Заголовок",
        accessorKey: "title",
        cell: ({ row }) => (
          <Link className="underline underline-offset-4" to={routes.teacher.problem(row.original.id)}>
            {row.original.title}
          </Link>
        ),
      },
      { header: "Тип", accessorKey: "problem_type" },
      {
        header: "Публикация",
        accessorKey: "is_published",
        cell: ({ row }) => (
          <Badge variant={row.original.is_published ? "success" : "secondary"}>{row.original.is_published ? "published" : "draft"}</Badge>
        ),
      },
      {
        header: "Обновлено",
        accessorKey: "updated_at",
        cell: ({ row }) => {
          try {
            return format(new Date(row.original.updated_at), "yyyy-MM-dd HH:mm");
          } catch {
            return row.original.updated_at;
          }
        },
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => (
          <Button asChild size="sm" variant="secondary">
            <Link to={routes.teacher.problem(row.original.id)}>Открыть</Link>
          </Button>
        ),
      },
    ],
    []
  );

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
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSkip(0);
              }}
              placeholder="например: дроби, уравнение..."
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Тип</label>
            <Input
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setSkip(0);
              }}
              placeholder="short_answer / essay / ..."
            />
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
            <CardDescription>
              Показано: {query.data.items.length} · всего: {query.data.total} · page: {Math.floor(skip / limit) + 1}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" variant="outline" disabled={!canPrev} onClick={() => setSkip((s) => Math.max(0, s - limit))}>
                Назад
              </Button>
              <Button size="sm" variant="outline" disabled={!canNext} onClick={() => setSkip((s) => s + limit)}>
                Вперёд
              </Button>
            </div>
            <DataTable data={query.data.items} columns={columns} sortable />
          </CardContent>
        </Card>
      ) : null}

      <div className="text-xs text-muted-foreground">
        Подсказка: в сборке ДЗ на уроке будет доступен выбор задач из базы (следующий шаг).
      </div>
    </div>
  );
}


