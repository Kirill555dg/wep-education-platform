import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import type { ColumnDef } from "@tanstack/react-table";

import { classroomsApi, homeworkApi, lessonsApi, statisticsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { DataTable } from "@/shared/ui/data-table";
import { ErrorState } from "@/shared/ui/error-state";
import { Input } from "@/shared/ui/input";
import { ClassroomHomeworkTrendChart, type ClassroomHomeworkTrendPoint } from "@/widgets/statistics/ClassroomHomeworkTrendChart";
import { HomeworkStatusDonut } from "@/widgets/statistics/HomeworkStatusDonut";
import { TeacherStudentRankingChart, type TeacherStudentRankingPoint } from "@/widgets/statistics/TeacherStudentRankingChart";
import type { StatisticsResponse } from "@/shared/api/generated";

type StudentAggregateRow = {
  student_id: number;
  student_name: string;
  completed_homeworks: number;
  total_homeworks: number;
  score_percentage: number;
  attempts: number;
  minutes: number;
};

function isCompletedStatus(status: string | null | undefined) {
  const s = (status ?? "").toLowerCase();
  return s === "completed" || s === "submitted" || s === "done";
}

export function TeacherClassroomStatsPage() {
  const params = useParams();
  const classroomId = Number(params.classroomId);
  const [searchParams, setSearchParams] = useSearchParams();

  const classroomQuery = useQuery({
    queryKey: ["stats", "teacher", "classroom", classroomId, "meta"],
    queryFn: async () => await classroomsApi.get(classroomId),
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });

  const progressQuery = useQuery({
    queryKey: ["stats", "teacher", "classroom", classroomId, "progress"],
    queryFn: async () => await statisticsApi.classroomProgress(classroomId),
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });

  const studentsQuery = useQuery({
    queryKey: ["stats", "teacher", "classroom", classroomId, "students"],
    queryFn: async () => await classroomsApi.listStudents(classroomId, { skip: 0, limit: 100 }),
    enabled: Number.isFinite(classroomId) && classroomId > 0,
  });

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

  const homeworkIdText = searchParams.get("homeworkId") ?? "";
  const homeworkId = useMemo(() => {
    const id = Number(homeworkIdText);
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [homeworkIdText]);

  const homeworkStatsQuery = useQuery({
    queryKey: ["stats", "teacher", "homework", homeworkId],
    queryFn: async () => await statisticsApi.homeworkStats(homeworkId as number, { skip: 0, limit: 100 }),
    enabled: homeworkId != null,
  });

  const studentMap = useMemo(() => {
    const m = new Map<number, { name: string; userId: number }>();
    for (const s of studentsQuery.data?.items ?? []) {
      m.set(s.student_id, { name: s.user.full_name, userId: s.user.id });
    }
    return m;
  }, [studentsQuery.data]);

  const classroomHomeworkIds = useMemo(() => new Set((homeworksQuery.data ?? []).map((h) => h.id)), [homeworksQuery.data]);

  const studentAggQuery = useQuery({
    queryKey: ["stats", "teacher", "classroom", classroomId, "student-aggregate"],
    queryFn: async () => {
      const homeworks = homeworksQuery.data ?? [];
      const pages = await Promise.all(homeworks.map(async (h) => await statisticsApi.homeworkStats(h.id, { skip: 0, limit: 100 })));
      const rows = pages.flatMap((p) => p.items);
      return rows;
    },
    enabled: (homeworksQuery.data?.length ?? 0) > 0,
  });

  const aggregatedStudents: StudentAggregateRow[] = useMemo(() => {
    const rows = studentAggQuery.data ?? [];
    const byStudent = new Map<number, { completed: number; total: number; score: number; max: number; attempts: number; minutes: number }>();
    const hwCount = homeworksQuery.data?.length ?? 0;

    for (const r of rows) {
      const cur = byStudent.get(r.student_id) ?? { completed: 0, total: hwCount, score: 0, max: 0, attempts: 0, minutes: 0 };
      cur.attempts += r.attempts_count ?? 0;
      cur.minutes += r.time_spent_minutes ?? 0;
      cur.score += r.score ?? 0;
      cur.max += r.max_score ?? 0;
      if (isCompletedStatus(r.status) || Boolean(r.submitted_at)) cur.completed += 1;
      byStudent.set(r.student_id, cur);
    }

    // Ensure every student is present even if no rows yet.
    for (const s of studentsQuery.data?.items ?? []) {
      if (!byStudent.has(s.student_id)) {
        byStudent.set(s.student_id, { completed: 0, total: hwCount, score: 0, max: 0, attempts: 0, minutes: 0 });
      }
    }

    const out: StudentAggregateRow[] = [];
    for (const [studentId, agg] of byStudent.entries()) {
      const info = studentMap.get(studentId);
      const pct = agg.max > 0 ? Math.round((agg.score / agg.max) * 100) : 0;
      out.push({
        student_id: studentId,
        student_name: info?.name ?? `student#${studentId}`,
        completed_homeworks: agg.completed,
        total_homeworks: agg.total,
        score_percentage: pct,
        attempts: agg.attempts,
        minutes: agg.minutes,
      });
    }

    out.sort((a, b) => b.score_percentage - a.score_percentage);
    return out;
  }, [studentAggQuery.data, studentsQuery.data, homeworksQuery.data, studentMap]);

  const topChart: TeacherStudentRankingPoint[] = useMemo(
    () =>
      aggregatedStudents.slice(0, 10).map((r) => ({
        name: r.student_name.split(" ")[0] ?? r.student_name,
        value: r.score_percentage,
      })),
    [aggregatedStudents]
  );

  const trendChart: ClassroomHomeworkTrendPoint[] = useMemo(() => {
    const rows = studentAggQuery.data ?? [];
    const byHomework = new Map<number, { score: number; max: number }>();
    for (const r of rows) {
      const cur = byHomework.get(r.homework_id) ?? { score: 0, max: 0 };
      cur.score += r.score ?? 0;
      cur.max += r.max_score ?? 0;
      byHomework.set(r.homework_id, cur);
    }

    const titleById = new Map<number, string>();
    for (const h of homeworksQuery.data ?? []) titleById.set(h.id, h.title);

    const points = Array.from(byHomework.entries()).map(([id, agg]) => {
      const pct = agg.max > 0 ? Math.round((agg.score / agg.max) * 100) : 0;
      const title = titleById.get(id);
      return { name: title ? title : `#${id}`, value: pct };
    });

    // Keep stable order: by homework id (close enough for MVP)
    points.sort((a, b) => a.name.localeCompare(b.name));
    return points.slice(0, 20);
  }, [studentAggQuery.data, homeworksQuery.data]);

  const studentColumns = useMemo<Array<ColumnDef<StudentAggregateRow>>>(
    () => [
      { header: "Ученик", accessorKey: "student_name" },
      {
        header: "Выполнено",
        cell: ({ row }) => `${row.original.completed_homeworks}/${row.original.total_homeworks}`,
      },
      { header: "Средний %", accessorKey: "score_percentage" },
      { header: "Попытки", accessorKey: "attempts" },
      { header: "Время (мин)", accessorKey: "minutes" },
    ],
    []
  );

  const homeworkStatsColumns = useMemo<Array<ColumnDef<StatisticsResponse>>>(
    () => [
      {
        header: "Ученик",
        cell: ({ row }) => {
          const info = studentMap.get(row.original.student_id);
          return info?.name ?? `student#${row.original.student_id}`;
        },
      },
      {
        header: "Баллы",
        cell: ({ row }) => `${row.original.score ?? 0}/${row.original.max_score}`,
      },
      { header: "Статус", accessorKey: "status" },
      { header: "Попытки", accessorKey: "attempts_count" },
      { header: "Время (мин)", accessorKey: "time_spent_minutes" },
    ],
    [studentMap]
  );

  const homeworkList = homeworksQuery.data ?? [];

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Статистика класса</h1>
          <p className="text-sm text-muted-foreground">
            {classroomQuery.data?.name ?? `classroom#${classroomId}`} · {classroomQuery.data?.subject ?? ""}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.stats}>Назад</Link>
        </Button>
      </div>

      {classroomQuery.error ? (
        <ErrorState message={String((classroomQuery.error as Error)?.message || classroomQuery.error)} onRetry={() => classroomQuery.refetch()} />
      ) : null}
      {progressQuery.error ? (
        <ErrorState message={String((progressQuery.error as Error)?.message || progressQuery.error)} onRetry={() => progressQuery.refetch()} />
      ) : null}
      {studentsQuery.error ? (
        <ErrorState message={String((studentsQuery.error as Error)?.message || studentsQuery.error)} onRetry={() => studentsQuery.refetch()} />
      ) : null}
      {homeworksQuery.error ? (
        <ErrorState message={String((homeworksQuery.error as Error)?.message || homeworksQuery.error)} onRetry={() => homeworksQuery.refetch()} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Ученики</CardTitle>
            <CardDescription>Всего</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{progressQuery.data?.total_students ?? "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ДЗ назначено</CardTitle>
            <CardDescription>Всего</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{progressQuery.data?.total_homeworks_assigned ?? "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ДЗ выполнено</CardTitle>
            <CardDescription>Всего</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{progressQuery.data?.completed_homeworks ?? "-"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completion rate</CardTitle>
            <CardDescription>Средний</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{progressQuery.data?.average_completion_rate ?? "-"}%</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Динамика по ДЗ (средний %)</CardTitle>
          <CardDescription>Средний процент по каждому ДЗ (по всем ученикам)</CardDescription>
        </CardHeader>
        <CardContent>
          {studentAggQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          <ClassroomHomeworkTrendChart data={trendChart} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Топ учеников</CardTitle>
          <CardDescription>По среднему проценту (по всем ДЗ класса)</CardDescription>
        </CardHeader>
        <CardContent>
          {studentAggQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          <TeacherStudentRankingChart data={topChart} />
          <div className="mt-4">
            <DataTable data={aggregatedStudents} columns={studentColumns} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статистика по ДЗ</CardTitle>
          <CardDescription>Выберите домашнее задание — увидите статистику по каждому ученику</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Homework ID</label>
            <Input
              value={homeworkIdText}
              onChange={(e) => {
                const v = e.target.value;
                const next = new URLSearchParams(searchParams);
                if (!v) next.delete("homeworkId");
                else next.set("homeworkId", v);
                setSearchParams(next, { replace: true });
              }}
              placeholder="например: 10"
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Подсказка: ДЗ в классе (id: title):
            <div className="mt-1 grid gap-1">
              {homeworksQuery.isLoading ? <div>Загрузка...</div> : null}
              {homeworkList.slice(0, 12).map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.set("homeworkId", String(h.id));
                    setSearchParams(next, { replace: true });
                  }}
                  className="text-left underline underline-offset-4 hover:text-foreground"
                >
                  {h.id}: {h.title}
                </button>
              ))}
              {homeworkList.length > 12 ? <div>… и ещё {homeworkList.length - 12}</div> : null}
            </div>
          </div>

          {homeworkStatsQuery.error ? (
            <ErrorState
              message={String((homeworkStatsQuery.error as Error)?.message || homeworkStatsQuery.error)}
              onRetry={() => homeworkStatsQuery.refetch()}
            />
          ) : null}

          {homeworkId != null && !classroomHomeworkIds.has(homeworkId) ? (
            <div className="text-sm text-destructive">Это ДЗ не принадлежит выбранному классу</div>
          ) : null}

          {homeworkStatsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          {homeworkStatsQuery.data ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium mb-2">Распределение статусов</div>
                  <HomeworkStatusDonut stats={homeworkStatsQuery.data.items} />
                </div>
              </div>
              <DataTable data={homeworkStatsQuery.data.items} columns={homeworkStatsColumns} />
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}


