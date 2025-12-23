import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { classroomsApi, getErrorMessage, getRequestId } from "@/shared/api";
import { useMyClassroomsQuery } from "@/entities/classroom/api/queries";
import { classroomQueryKeys } from "@/entities/classroom/api/queryKeys";
import { useMyProgressQuery } from "@/entities/statistics/api/queries";
import { statisticsQueryKeys } from "@/entities/statistics/api/queryKeys";
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

  const [joinError, setJoinError] = useState<string | null>(null);

  const joinForm = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: { invite_code: "" },
    mode: "onChange",
  });

  const inviteCode = useMemo(() => joinForm.watch("invite_code"), [joinForm]);

  const queryClient = useQueryClient();
  const listParams = useMemo(() => ({ skip: 0, limit: 100 }), []);
  const classroomsQuery = useMyClassroomsQuery(listParams);
  const progressQuery = useMyProgressQuery();

  const joinMutation = useMutation({
    mutationFn: async (inviteCode: string) => await classroomsApi.join({ invite_code: inviteCode }),
    onSuccess: async (joined) => {
      setJoinError(null);
      joinForm.reset({ invite_code: "" });
      toast({ title: "Вы вступили в класс", description: joined.name });
      await queryClient.invalidateQueries({ queryKey: classroomQueryKeys.myRoot() });
      await queryClient.invalidateQueries({ queryKey: statisticsQueryKeys.myProgress() });
      navigate(routes.student.classroom(joined.id), { replace: true });
    },
    onError: (e) => {
      const msg = getErrorMessage(e);
      const requestId = getRequestId(e);
      const extra = requestId ? ` (request_id: ${requestId})` : "";
      setJoinError(`${msg}${extra}`);
      toast({ title: "Не удалось вступить", description: `${msg}${extra}`, variant: "destructive" });
    },
  });

  const join = joinForm.handleSubmit(async (values) => {
    setJoinError(null);
    joinMutation.mutate(values.invite_code.trim());
  });

  const items = (classroomsQuery.data?.items ?? []).map((c) => ({ id: c.id, name: c.name, subject: c.subject }));
  const progress = progressQuery.data ?? null;

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
                disabled={!inviteCode.trim() || !joinForm.formState.isValid || joinMutation.isLoading}
                data-testid="join-submit"
              >
                {joinMutation.isLoading ? "..." : "Вступить"}
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
          {progressQuery.isLoading ? (
            <div className="text-muted-foreground">Загрузка...</div>
          ) : progressQuery.error ? (
            <div className="text-destructive">{getErrorMessage(progressQuery.error)}</div>
          ) : !progress ? (
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

      {joinError ? <div className="text-sm text-destructive">{joinError}</div> : null}
      {classroomsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
      {classroomsQuery.error ? <div className="text-sm text-destructive">{getErrorMessage(classroomsQuery.error)}</div> : null}

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


