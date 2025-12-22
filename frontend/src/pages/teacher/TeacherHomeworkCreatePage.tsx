import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getErrorMessage, homeworkApi, lessonsApi, problemsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ErrorState } from "@/shared/ui/error-state";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

type Selected = { points: number };

export function TeacherHomeworkCreatePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const lessonId = Number(params.lessonId);

  const lessonQuery = useQuery({
    queryKey: ["teacher", "lesson", lessonId],
    queryFn: async () => await lessonsApi.get(lessonId),
    enabled: Number.isFinite(lessonId) && lessonId > 0,
  });

  const problemsQuery = useQuery({
    queryKey: ["teacher", "problems", "list"],
    queryFn: async () => await problemsApi.list({ skip: 0, limit: 100 }),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [publish, setPublish] = useState(true);

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState<Record<number, Selected>>({});

  const filteredProblems = useMemo(() => {
    const items = problemsQuery.data?.items ?? [];
    const qq = q.trim().toLowerCase();
    const tt = type.trim().toLowerCase();
    return items.filter((p) => {
      const matchesQ = !qq || p.title.toLowerCase().includes(qq) || p.description.toLowerCase().includes(qq);
      const matchesT = !tt || p.problem_type.toLowerCase().includes(tt);
      return matchesQ && matchesT;
    });
  }, [problemsQuery.data, q, type]);

  const totalPoints = useMemo(() => {
    return Object.values(selected).reduce((acc, s) => acc + (Number.isFinite(s.points) ? s.points : 0), 0);
  }, [selected]);

  const toggleProblem = (id: number) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { points: 1 };
      return next;
    });
  };

  const setPoints = (id: number, points: number) => {
    setSelected((prev) => ({ ...prev, [id]: { points } }));
  };

  const onCreate = async () => {
    try {
      const ids = Object.keys(selected).map((x) => Number(x));
      const points = ids.map((id) => selected[id]?.points ?? 1);
      const maxScore = points.reduce((acc, p) => acc + (Number.isFinite(p) ? p : 0), 0);

      const created = await homeworkApi.create({
        lesson_id: lessonId,
        title,
        description: description || null,
        deadline: deadline || null,
        max_score: maxScore || 0,
        problem_ids: ids,
        problem_points: points,
      });

      if (publish) {
        await homeworkApi.update(created.id, { is_published: true });
      }

      toast({ title: "ДЗ создано", description: created.title });
      navigate(routes.teacher.homework(created.id));
    } catch (e) {
      toast({ title: "Ошибка", description: getErrorMessage(e), variant: "destructive" });
    }
  };

  const canCreate = title.trim().length >= 3 && Object.keys(selected).length > 0;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Создать ДЗ</h1>
          <p className="text-sm text-muted-foreground">
            Lesson #{lessonId} {lessonQuery.data ? `· ${lessonQuery.data.title}` : ""}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.lesson(lessonId)}>Назад</Link>
        </Button>
      </div>

      {lessonQuery.error ? (
        <ErrorState message={String((lessonQuery.error as Error)?.message || lessonQuery.error)} onRetry={() => lessonQuery.refetch()} />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Параметры ДЗ</CardTitle>
            <CardDescription>Название, описание, дедлайн и публикация</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Название</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="например: Уравнения — практика" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Описание</label>
              <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="опционально" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Deadline (ISO)</label>
              <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="например: 2025-12-31T23:59:00Z" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="h-4 w-4" />
              <span className="text-sm">Опубликовать сразу</span>
            </div>
            <div className="text-sm text-muted-foreground">Max score: {totalPoints}</div>
            <div className="flex gap-2">
              <Button onClick={() => void onCreate()} disabled={!canCreate}>
                Создать
              </Button>
              <Button asChild variant="secondary" type="button">
                <Link to={routes.teacher.problemNew}>Создать задачу в базе</Link>
              </Button>
            </div>
            {!canCreate ? (
              <div className="text-xs text-muted-foreground">Нужно: название (≥ 3) и хотя бы 1 выбранная задача</div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Выбор задач из базы</CardTitle>
            <CardDescription>Фильтруйте, выбирайте задачи и назначайте баллы</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {problemsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
            {problemsQuery.error ? (
              <ErrorState
                message={String((problemsQuery.error as Error)?.message || problemsQuery.error)}
                onRetry={() => problemsQuery.refetch()}
              />
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Поиск</label>
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="например: дроби, уравнение..." />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Тип</label>
                <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="short_answer / ..." />
              </div>
            </div>

            <div className="grid gap-2 max-h-[520px] overflow-auto">
              {filteredProblems.length === 0 && !problemsQuery.isLoading ? (
                <div className="text-sm text-muted-foreground">Ничего не найдено</div>
              ) : null}
              {filteredProblems.map((p) => {
                const checked = Boolean(selected[p.id]);
                return (
                  <div key={p.id} className="flex items-start justify-between gap-3 border rounded-md px-3 py-2">
                    <div className="min-w-0">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={checked} onChange={() => toggleProblem(p.id)} className="mt-1 h-4 w-4" />
                        <span className="min-w-0">
                          <div className="font-medium truncate">
                            #{p.id} · {p.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{p.problem_type}</div>
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">баллы</span>
                      <Input
                        className="w-20"
                        value={checked ? String(selected[p.id]?.points ?? 1) : ""}
                        onChange={(e) => setPoints(p.id, Number(e.target.value || "0"))}
                        disabled={!checked}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


