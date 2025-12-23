import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { classroomsApi, homeworkApi, lessonsApi, statisticsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { DataTable } from "@/shared/ui/data-table";
import { ErrorState } from "@/shared/ui/error-state";
import { ClassroomHomeworkTrendChart, type ClassroomHomeworkTrendPoint } from "@/widgets/statistics/ClassroomHomeworkTrendChart";
import { HomeworkStatusDonut } from "@/widgets/statistics/HomeworkStatusDonut";
import type { StatisticsResponse } from "@/shared/api/generated";

function isCompletedStatus(status: string | null | undefined) {
  const s = (status ?? "").toLowerCase();
  return s === "completed" || s === "submitted" || s === "done";
}

export function TeacherClassroomStudentStatsPage() {
  const params = useParams();
  const classroomId = Number(params.classroomId);
  const studentId = Number(params.studentId); // classroom student_id

  const studentsQuery = useQuery({
    queryKey: ["stats", "teacher", "classroom", classroomId, "students"],
    queryFn: async () => await classroomsApi.listStudentsAll(classroomId),
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });

  const studentInfo = useMemo(() => {
    const item = (studentsQuery.data?.items ?? []).find((s) => s.student_id === studentId);
    return item ? { studentId: item.student_id, userId: item.user.id, name: item.user.full_name } : null;
  }, [studentsQuery.data, studentId]);

  const homeworksQuery = useQuery({
    queryKey: ["stats", "teacher", "classroom", classroomId, "homeworks"],
    queryFn: async () => {
      const lessonsPage = await lessonsApi.listByClassroom(classroomId);
      const homeworkPages = await Promise.all(lessonsPage.items.map(async (l) => await homeworkApi.listByLesson(l.id)));
      const items = homeworkPages.flatMap((p) => p.items);
      return items;
    },
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });

  const studentStatsQuery = useQuery({
    queryKey: ["stats", "teacher", "student", studentInfo?.userId],
    queryFn: async () => await statisticsApi.studentStatsByTeacherAll(studentInfo!.userId),
    enabled: Boolean(studentInfo?.userId),
  });

  const classroomHomeworkIds = useMemo(() => new Set((homeworksQuery.data ?? []).map((h) => h.id)), [homeworksQuery.data]);
  const homeworkTitle = useMemo(() => {
    const map = new Map<number, string>();
    for (const h of homeworksQuery.data ?? []) map.set(h.id, h.title);
    return map;
  }, [homeworksQuery.data]);

  const rows: StatisticsResponse[] = useMemo(() => {
    const items = studentStatsQuery.data?.items ?? [];
    // Student endpoint can include stats for other classrooms; we only show this classroom.
    return items.filter((r) => classroomHomeworkIds.has(r.homework_id));
  }, [studentStatsQuery.data, classroomHomeworkIds]);

  const rowByHomeworkId = useMemo(() => {
    const m = new Map<number, StatisticsResponse>();
    for (const r of rows) m.set(r.homework_id, r);
    return m;
  }, [rows]);

  const aggregates = useMemo(() => {
    let completed = 0;
    let score = 0;
    let max = 0;
    let attempts = 0;
    let minutes = 0;
    for (const r of rows) {
      if (isCompletedStatus(r.status) || Boolean(r.submitted_at)) completed += 1;
      score += r.score ?? 0;
      max += r.max_score ?? 0;
      attempts += r.attempts_count ?? 0;
      minutes += r.time_spent_minutes ?? 0;
    }
    const pct = max > 0 ? Math.round((score / max) * 100) : 0;
    return { completed, total: homeworksQuery.data?.length ?? 0, pct, attempts, minutes };
  }, [rows, homeworksQuery.data]);

  const trend: ClassroomHomeworkTrendPoint[] = useMemo(() => {
    const homeworks = homeworksQuery.data ?? [];
    const pts = homeworks.map((h) => {
      const r = rowByHomeworkId.get(h.id);
      const pct = r && r.max_score > 0 ? Math.round(((r.score ?? 0) / r.max_score) * 100) : 0;
      return { name: h.title, value: pct };
    });
    return pts.slice(0, 20);
  }, [homeworksQuery.data, rowByHomeworkId]);

  const columns = useMemo<Array<ColumnDef<StatisticsResponse>>>(
    () => [
      {
        header: "ДЗ",
        cell: ({ row }) => (
          <div className="grid">
            <div className="font-medium">{homeworkTitle.get(row.original.homework_id) ?? `#${row.original.homework_id}`}</div>
            <div className="text-xs text-muted-foreground">id: {row.original.homework_id}</div>
          </div>
        ),
      },
      {
        header: "Баллы",
        cell: ({ row }) => `${row.original.score ?? 0}/${row.original.max_score}`,
      },
      { header: "Статус", accessorKey: "status" },
      { header: "Попытки", accessorKey: "attempts_count" },
      { header: "Время (мин)", accessorKey: "time_spent_minutes" },
      {
        header: "Открыть ДЗ",
        cell: ({ row }) => (
          <Button asChild size="sm" variant="outline">
            <Link to={routes.teacher.homework(row.original.homework_id)}>Открыть</Link>
          </Button>
        ),
      },
    ],
    [homeworkTitle]
  );

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Статистика ученика</h1>
          <p className="text-sm text-muted-foreground">
            {studentInfo?.name ?? `student#${studentId}`} · classroom #{classroomId}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.classroomStats(classroomId)}>Назад</Link>
        </Button>
      </div>

      {studentsQuery.error ? (
        <ErrorState message={String((studentsQuery.error as Error)?.message || studentsQuery.error)} onRetry={() => studentsQuery.refetch()} />
      ) : null}
      {homeworksQuery.error ? (
        <ErrorState message={String((homeworksQuery.error as Error)?.message || homeworksQuery.error)} onRetry={() => homeworksQuery.refetch()} />
      ) : null}
      {studentStatsQuery.error ? (
        <ErrorState message={String((studentStatsQuery.error as Error)?.message || studentStatsQuery.error)} onRetry={() => studentStatsQuery.refetch()} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Выполнено</CardTitle>
            <CardDescription>ДЗ</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {aggregates.completed}/{aggregates.total}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Средний %</CardTitle>
            <CardDescription>По ДЗ класса</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{aggregates.pct}%</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Попытки</CardTitle>
            <CardDescription>Всего</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{aggregates.attempts}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Время</CardTitle>
            <CardDescription>Минут</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{aggregates.minutes}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Динамика по ДЗ</CardTitle>
          <CardDescription>Процент по каждому ДЗ (0–100)</CardDescription>
        </CardHeader>
        <CardContent>
          {studentStatsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          <ClassroomHomeworkTrendChart data={trend as ClassroomHomeworkTrendPoint[]} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Распределение статусов</CardTitle>
          <CardDescription>По всем ДЗ класса</CardDescription>
        </CardHeader>
        <CardContent>
          <HomeworkStatusDonut stats={rows} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Таблица по ДЗ</CardTitle>
          <CardDescription>Статус/баллы/попытки по каждому домашнему заданию</CardDescription>
        </CardHeader>
        <CardContent>
          {studentStatsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          <DataTable data={rows} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}


