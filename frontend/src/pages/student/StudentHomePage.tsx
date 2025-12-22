import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { classroomsApi, getErrorMessage, getRequestId, statisticsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

const joinSchema = z.object({
  invite_code: z
    .string()
    .trim()
    .min(3, "Введите invite code")
    .max(64, "Слишком длинный invite code")
    .regex(/^[A-Za-z0-9_-]+$/, "Допустимы только буквы/цифры/`_`/`-`"),
});

type JoinFormValues = z.infer<typeof joinSchema>;

export function StudentHomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ id: number; name: string; subject: string }>>([]);
  const [progress, setProgress] = useState<{
    total_homeworks: number;
    completed: number;
    in_progress: number;
    not_started: number;
    average_score_percentage: number;
    total_attempts: number;
    total_time_spent_minutes: number;
  } | null>(null);

  const joinForm = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: { invite_code: "" },
    mode: "onChange",
  });

  const inviteCode = useMemo(() => joinForm.watch("invite_code"), [joinForm]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await classroomsApi.listMine();
      setItems(page.items.map((c) => ({ id: c.id, name: c.name, subject: c.subject })));

      const p = await statisticsApi.myProgress();
      setProgress(p);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const join = joinForm.handleSubmit(async (values) => {
    setError(null);
    try {
      const joined = await classroomsApi.join({ invite_code: values.invite_code.trim() });
      joinForm.reset({ invite_code: "" });
      setItems((prev) => [{ id: joined.id, name: joined.name, subject: joined.subject }, ...prev]);
      toast({ title: "Вы вступили в класс", description: joined.name });
      // Go straight into the classroom.
      navigate(routes.student.classroom(joined.id), { replace: true });
    } catch (e) {
      const msg = getErrorMessage(e);
      const requestId = getRequestId(e);
      const extra = requestId ? ` (request_id: ${requestId})` : "";
      setError(`${msg}${extra}`);
      toast({ title: "Не удалось вступить", description: `${msg}${extra}`, variant: "destructive" });
    }
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="student-title">
          Student — классы
        </h1>
        <p className="text-sm text-muted-foreground">Вступай в классы по invite code и выполняй задания</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Вступить в класс</CardTitle>
          <CardDescription>Введи invite code, который дал преподаватель</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={join} className="grid gap-2" data-testid="join-form">
            <div className="flex gap-2">
              <Input
                placeholder="invite code"
                {...joinForm.register("invite_code")}
                data-testid="join-invite-code"
                autoCapitalize="off"
                autoCorrect="off"
              />
              <Button
                type="submit"
                disabled={!inviteCode.trim() || !joinForm.formState.isValid || joinForm.formState.isSubmitting}
                data-testid="join-submit"
              >
                {joinForm.formState.isSubmitting ? "..." : "Вступить"}
              </Button>
            </div>
            {joinForm.formState.errors.invite_code ? (
              <p className="text-sm text-destructive" data-testid="join-error">
                {joinForm.formState.errors.invite_code.message}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Мой прогресс</CardTitle>
          <CardDescription>Агрегированная статистика (из backend)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          {!progress ? (
            <div className="text-muted-foreground">Нет данных</div>
          ) : (
            <>
              <div>Всего ДЗ: {progress.total_homeworks}</div>
              <div>Выполнено: {progress.completed}</div>
              <div>В процессе: {progress.in_progress}</div>
              <div>Не начато: {progress.not_started}</div>
              <div>Средний процент: {progress.average_score_percentage}%</div>
              <div>Попыток: {progress.total_attempts}</div>
              <div>Времени (мин): {progress.total_time_spent_minutes}</div>
            </>
          )}
        </CardContent>
      </Card>

      {error ? <div className="text-sm text-destructive">{error}</div> : null}
      {loading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((c) => (
          <Card key={c.id} data-testid="classroom-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{c.name}</span>
                <Button asChild size="sm" variant="secondary">
                  <Link to={routes.student.classroom(c.id)} data-testid={`open-classroom-${c.id}`}>
                    Открыть
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>{c.subject}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}


