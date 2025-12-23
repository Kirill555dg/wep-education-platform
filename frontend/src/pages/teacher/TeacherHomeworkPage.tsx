import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { classroomsApi, getErrorMessage, homeworkApi, lessonsApi, statisticsApi } from "@/shared/api";
import { useHomeworkProblemsQuery, useHomeworkQuery } from "@/entities/homework/api/queries";
import { homeworkQueryKeys } from "@/entities/homework/api/queryKeys";
import { routes } from "@/shared/config/routes";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { DataTable } from "@/shared/ui/data-table";
import { ErrorState } from "@/shared/ui/error-state";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { HomeworkStatusDonut } from "@/widgets/statistics/HomeworkStatusDonut";
import { HomeworkScoresBarChart, type HomeworkScorePoint } from "@/widgets/statistics/HomeworkScoresBarChart";
import type { StatisticsResponse } from "@/shared/api/generated";

export function TeacherHomeworkPage() {
  const params = useParams();
  const homeworkId = Number(params.homeworkId);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const hwQuery = useHomeworkQuery(homeworkId);
  const problemsQuery = useHomeworkProblemsQuery(homeworkId);

  const statsQuery = useQuery({
    queryKey: ["teacher", "homework", homeworkId, "stats"],
    queryFn: async () => await statisticsApi.homeworkStats(homeworkId, { skip: 0, limit: 100 }),
    enabled: Number.isFinite(homeworkId) && homeworkId > 0,
  });

  const lessonQuery = useQuery({
    queryKey: ["teacher", "homework", homeworkId, "lesson"],
    queryFn: async () => await lessonsApi.get(hwQuery.data!.lesson_id),
    enabled: Boolean(hwQuery.data?.lesson_id),
  });

  const studentsQuery = useQuery({
    queryKey: ["teacher", "classroom", lessonQuery.data?.classroom_id, "students"],
    queryFn: async () => await classroomsApi.listStudentsAll(lessonQuery.data!.classroom_id),
    enabled: Boolean(lessonQuery.data?.classroom_id),
  });

  const studentNameByStudentId = useMemo(() => {
    const m = new Map<number, string>();
    for (const s of studentsQuery.data?.items ?? []) {
      m.set(s.student_id, s.user.full_name);
    }
    return m;
  }, [studentsQuery.data]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxScoreText, setMaxScoreText] = useState("");
  const [deadline, setDeadline] = useState("");

  // Initialize form values once data arrives (simple MVP)
  useEffect(() => {
    const d = hwQuery.data;
    if (!d) return;
    setTitle(d.title);
    setDescription(d.description ?? "");
    setMaxScoreText(String(d.max_score ?? ""));
    setDeadline(d.deadline ?? "");
  }, [hwQuery.data?.id, hwQuery.data?.updated_at]);

  const updateMutation = useMutation({
    mutationFn: async (payload: Parameters<typeof homeworkApi.update>[1]) => await homeworkApi.update(homeworkId, payload),
    onSuccess: async () => {
      toast({ title: "Сохранено" });
      await queryClient.invalidateQueries({ queryKey: homeworkQueryKeys.byId(homeworkId) });
    },
    onError: (e) => toast({ title: "Ошибка", description: getErrorMessage(e), variant: "destructive" }),
  });

  const onSave = () => {
    updateMutation.mutate({
      title: title || null,
      description: description || null,
      max_score: maxScoreText ? Number(maxScoreText) : null,
      deadline: deadline || null,
    });
  };

  const onTogglePublish = () => {
    const isPublished = Boolean(hwQuery.data?.is_published);
    updateMutation.mutate({ is_published: !isPublished });
  };

  const columns = useMemo<Array<ColumnDef<StatisticsResponse>>>(
    () => [
      {
        header: "Ученик",
        cell: ({ row }) => {
          const name = studentNameByStudentId.get(row.original.student_id) ?? `student#${row.original.student_id}`;
          const classroomId = lessonQuery.data?.classroom_id;
          return classroomId ? (
            <Link className="underline underline-offset-4" to={routes.teacher.classroomStudentStats(classroomId, row.original.student_id)}>
              {name}
            </Link>
          ) : (
            name
          );
        },
      },
      { header: "score", cell: ({ row }) => `${row.original.score ?? 0}/${row.original.max_score}` },
      { header: "status", accessorKey: "status" },
      { header: "attempts", accessorKey: "attempts_count" },
      { header: "minutes", accessorKey: "time_spent_minutes" },
      { header: "submitted_at", accessorKey: "submitted_at" },
    ],
    [studentNameByStudentId, lessonQuery.data?.classroom_id]
  );

  const scoreChart: HomeworkScorePoint[] = useMemo(() => {
    const items = statsQuery.data?.items ?? [];
    const points = items.map((r) => {
      const name = studentNameByStudentId.get(r.student_id) ?? `student#${r.student_id}`;
      const pct = r.max_score > 0 ? Math.round(((r.score ?? 0) / r.max_score) * 100) : 0;
      return { name: name.split(" ")[0] ?? name, value: pct };
    });
    points.sort((a, b) => b.value - a.value);
    return points.slice(0, 15);
  }, [statsQuery.data, studentNameByStudentId]);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Домашнее задание</h1>
          <p className="text-sm text-muted-foreground">Homework #{homeworkId}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.home}>Назад</Link>
        </Button>
      </div>

      {hwQuery.error ? <ErrorState message={getErrorMessage(hwQuery.error)} onRetry={() => hwQuery.refetch()} /> : null}
      {updateMutation.error ? <div className="text-sm text-destructive">{getErrorMessage(updateMutation.error)}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>Редактирование</CardTitle>
          <CardDescription>Учитель может редактировать ДЗ и управлять публикацией</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {hwQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}

          <div className="grid gap-2">
            <label className="text-sm font-medium">Название</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Описание</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Max score</label>
              <Input value={maxScoreText} onChange={(e) => setMaxScoreText(e.target.value)} placeholder="например: 100" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Deadline (ISO)</label>
              <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="например: 2025-12-31T23:59:00Z" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onSave()} disabled={updateMutation.isLoading}>
              Сохранить
            </Button>
            <Button variant="secondary" onClick={() => onTogglePublish()} disabled={updateMutation.isLoading || hwQuery.isLoading}>
              {hwQuery.data?.is_published ? "Снять с публикации" : "Опубликовать"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Задачи</CardTitle>
          <CardDescription>Состав ДЗ (для редактирования задач добавим отдельную страницу создания/редактирования)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {problemsQuery.isLoading ? <div className="text-muted-foreground">Загрузка...</div> : null}
          {problemsQuery.error ? (
            <ErrorState message={getErrorMessage(problemsQuery.error)} onRetry={() => problemsQuery.refetch()} />
          ) : null}
          {(problemsQuery.data ?? []).length === 0 && !problemsQuery.isLoading ? (
            <div className="text-muted-foreground">Пока нет задач в ДЗ</div>
          ) : null}
          {(problemsQuery.data ?? []).map((p) => (
            <div key={p.id} className="border rounded-md px-3 py-2">
              <div className="font-medium">
                #{p.id} · {p.title}
              </div>
              <div className="text-xs text-muted-foreground">{p.problem_type}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статистика выполнения</CardTitle>
          <CardDescription>По каждому ученику внутри этого ДЗ</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {statsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          {statsQuery.error ? (
            <ErrorState message={getErrorMessage(statsQuery.error)} onRetry={() => statsQuery.refetch()} />
          ) : null}
          {statsQuery.data ? (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <div className="text-sm font-medium mb-2">Распределение статусов</div>
                  <HomeworkStatusDonut stats={statsQuery.data.items} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Топ по баллам (в %)</div>
                  <HomeworkScoresBarChart data={scoreChart} />
                </div>
              </div>
              <DataTable data={statsQuery.data.items} columns={columns} />
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}


