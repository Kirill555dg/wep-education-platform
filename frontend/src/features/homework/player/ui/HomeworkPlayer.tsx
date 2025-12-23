import { useEffect, useMemo, useRef, useState } from "react";

import { homeworkApi, getErrorMessage } from "@/shared/api";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/shared/hooks/use-toast";

import { clearHomeworkDraft, loadHomeworkDraft, saveHomeworkDraft } from "../lib/draft";

type Problem = { id: number; title: string; description: string; problem_type: string };

export function HomeworkPlayer(props: { homeworkId: number; title: string; problems: Problem[] }) {
  const { homeworkId, title, problems } = props;

  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAtRef = useRef<number>(Date.now());
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const draft = loadHomeworkDraft(homeworkId);
    if (draft) setAnswers(draft.answers);
  }, [homeworkId]);

  useEffect(() => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      saveHomeworkDraft(homeworkId, answers);
      saveTimerRef.current = null;
    }, 350);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [homeworkId, answers]);

  useEffect(() => {
    startAtRef.current = Date.now();
  }, [homeworkId, activeIdx]);

  const active = problems[activeIdx] ?? null;
  const total = problems.length;
  const doneCount = useMemo(() => problems.filter((p) => (answers[p.id] ?? "").trim().length > 0).length, [problems, answers]);
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const timeSpentMinutes = () => {
    const ms = Date.now() - startAtRef.current;
    const mins = Math.max(1, Math.ceil(ms / 60_000));
    return mins;
  };

  const submitActive = async () => {
    if (!active) return;
    const answer = (answers[active.id] ?? "").trim();
    if (!answer) {
      toast({ title: "Введите ответ", description: "Ответ не может быть пустым", variant: "destructive" });
      return;
    }

    setSending(true);
    setError(null);
    try {
      const stats = await homeworkApi.submitAnswer({
        homework_id: homeworkId,
        problem_id: active.id,
        answer,
        time_spent_minutes: timeSpentMinutes(),
      });
      toast({ title: "Ответ отправлен", description: `score: ${stats.score ?? 0}/${stats.max_score}` });
    } catch (e) {
      const msg = getErrorMessage(e);
      setError(msg);
      toast({ title: "Ошибка", description: msg, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const submitHomework = async () => {
    setSending(true);
    setError(null);
    try {
      const stats = await homeworkApi.submitHomework(homeworkId);
      toast({ title: "ДЗ отправлено", description: `status: ${stats.status ?? "-"} · score: ${stats.score ?? 0}/${stats.max_score}` });
      clearHomeworkDraft(homeworkId);
    } catch (e) {
      const msg = getErrorMessage(e);
      setError(msg);
      toast({ title: "Ошибка", description: msg, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="student-homework-title">
          {title}
        </h1>
        <div className="text-sm text-muted-foreground">
          Homework #{homeworkId} · {total ? `Задача ${activeIdx + 1}/${total}` : "Нет задач"}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Прогресс</CardTitle>
          <CardDescription>
            Ответов заполнено: {doneCount}/{total} ({progressPct}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full rounded bg-muted">
            <div className="h-2 rounded bg-primary" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {problems.map((p, idx) => {
              const filled = (answers[p.id] ?? "").trim().length > 0;
              const isActive = idx === activeIdx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveIdx(idx)}
                  className={[
                    "text-xs rounded-md border px-2 py-1",
                    isActive ? "bg-muted border-muted-foreground/30" : "hover:bg-muted/40",
                    filled ? "border-green-300" : "",
                  ].join(" ")}
                  type="button"
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {!active ? (
        <div className="text-sm text-muted-foreground">В этом ДЗ пока нет задач</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{active.title}</CardTitle>
            <CardDescription>{active.problem_type}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {error ? <div className="text-sm text-destructive">{error}</div> : null}

            <div className="text-sm whitespace-pre-wrap">{active.description}</div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Ответ</label>
              {active.problem_type === "essay" ? (
                <Textarea
                  rows={6}
                  value={answers[active.id] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [active.id]: e.target.value }))}
                  data-testid="answer"
                />
              ) : (
                <Input
                  value={answers[active.id] ?? ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [active.id]: e.target.value }))}
                  data-testid="answer"
                />
              )}
              <div className="text-xs text-muted-foreground">Черновик сохраняется автоматически</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => setActiveIdx((i) => Math.max(0, i - 1))} disabled={activeIdx === 0}>
                Назад
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveIdx((i) => Math.min(total - 1, i + 1))}
                disabled={activeIdx >= total - 1}
              >
                Вперёд
              </Button>
              <Button type="button" onClick={() => void submitActive()} disabled={sending}>
                Отправить ответ
              </Button>
              <Button type="button" variant="secondary" onClick={() => void submitHomework()} disabled={sending}>
                Сдать ДЗ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


