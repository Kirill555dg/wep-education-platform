import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useProblemsList } from "@/entities/problem/api/queries";
import { getErrorMessage, homeworkApi, lessonsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ErrorState } from "@/shared/ui/error-state";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import type { ProblemFullResponse } from "@/shared/api/generated";

type Selected = { points: number; title: string; problem_type: string };

function normalizePoints(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return 1;
  const int = Math.floor(n);
  if (int < 1) return 1;
  // Keep things sane for MVP UI; backend may enforce other constraints.
  return Math.min(int, 100);
}

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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [publish, setPublish] = useState(true);

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [selected, setSelected] = useState<Record<number, Selected>>({});

  const [skip, setSkip] = useState(0);
  const limit = 50;
  const problemsQuery = useProblemsList({ skip, limit, q, type });
  const filteredProblems = problemsQuery.data?.items ?? [];
  const totalProblems = problemsQuery.data?.total ?? 0;
  const canPrev = skip > 0;
  const canNext = skip + limit < totalProblems;

  const selectedEntries = useMemo(() => {
    const entries = Object.entries(selected)
      .map(([id, v]) => ({ id: Number(id), ...v }))
      .sort((a, b) => a.id - b.id);
    return entries;
  }, [selected]);

  const totalPoints = useMemo(() => {
    return Object.values(selected).reduce((acc, s) => acc + (Number.isFinite(s.points) ? s.points : 0), 0);
  }, [selected]);

  const toggleProblem = (p: Pick<ProblemFullResponse, "id" | "title" | "problem_type">) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[p.id]) delete next[p.id];
      else next[p.id] = { points: 1, title: p.title, problem_type: p.problem_type };
      return next;
    });
  };

  const setPoints = (id: number, points: number) => {
    setSelected((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return { ...prev, [id]: { ...current, points: normalizePoints(points) } };
    });
  };

  const onCreate = async () => {
    try {
      const titleTrimmed = title.trim();
      if (titleTrimmed.length < 3) {
        toast({ title: "Проверьте форму", description: "Название ДЗ должно быть не короче 3 символов", variant: "destructive" });
        return;
      }

      if (selectedEntries.length === 0) {
        toast({ title: "Проверьте форму", description: "Выберите хотя бы одну задачу", variant: "destructive" });
        return;
      }

      const ids = selectedEntries.map((e) => e.id);
      const points = selectedEntries.map((e) => normalizePoints(e.points));
      const maxScore = points.reduce((acc, p) => acc + p, 0);
      if (maxScore <= 0) {
        toast({ title: "Проверьте форму", description: "Сумма баллов должна быть больше 0", variant: "destructive" });
        return;
      }

      const created = await homeworkApi.create({
        lesson_id: lessonId,
        title: titleTrimmed,
        description: description || null,
        deadline: deadline || null,
        max_score: maxScore,
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

  const canCreate = title.trim().length >= 3 && selectedEntries.length > 0 && totalPoints > 0;

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

            <Card className="bg-muted/10">
              <CardHeader>
                <CardTitle className="text-base">Выбрано задач: {selectedEntries.length}</CardTitle>
                <CardDescription>Итоговый max_score = сумма баллов</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {selectedEntries.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Пока ничего не выбрано</div>
                ) : (
                  <div className="grid gap-2">
                    {selectedEntries.map((s) => (
                      <div key={s.id} className="flex items-start justify-between gap-3 border rounded-md px-3 py-2 bg-background">
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            #{s.id} · {s.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{s.problem_type}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">баллы</span>
                          <Input
                            type="number"
                            min={1}
                            step={1}
                            className="w-20"
                            value={String(s.points)}
                            onChange={(e) => setPoints(s.id, Number(e.target.value))}
                          />
                          <Button size="sm" variant="outline" type="button" onClick={() => toggleProblem({ id: s.id, title: s.title, problem_type: s.problem_type })}>
                            Убрать
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-sm text-muted-foreground">Max score: {totalPoints}</div>
              </CardContent>
            </Card>

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
                  placeholder="short_answer / ..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                Показаны: {filteredProblems.length} · всего задач: {totalProblems} · page: {Math.floor(skip / limit) + 1}
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" disabled={!canPrev} onClick={() => setSkip((s) => Math.max(0, s - limit))}>
                  Назад
                </Button>
                <Button type="button" size="sm" variant="outline" disabled={!canNext} onClick={() => setSkip((s) => s + limit)}>
                  Вперёд
                </Button>
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
                        <input type="checkbox" checked={checked} onChange={() => toggleProblem(p)} className="mt-1 h-4 w-4" />
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
                        type="number"
                        min={1}
                        step={1}
                        className="w-20"
                        value={checked ? String(selected[p.id]?.points ?? 1) : ""}
                        onChange={(e) => setPoints(p.id, Number(e.target.value || "1"))}
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


