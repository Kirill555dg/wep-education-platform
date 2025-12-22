import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { classroomsApi, getErrorMessage, statisticsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

export function StudentHomePage() {
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

  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);

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

  const join = async () => {
    setJoining(true);
    setError(null);
    try {
      const joined = await classroomsApi.join({ invite_code: inviteCode });
      setInviteCode("");
      setItems((prev) => [{ id: joined.id, name: joined.name, subject: joined.subject }, ...prev]);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setJoining(false);
    }
  };

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
        <CardContent className="flex gap-2">
          <Input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="invite code"
            data-testid="join-invite-code"
          />
          <Button onClick={() => void join()} disabled={!inviteCode || joining} data-testid="join-submit">
            {joining ? "..." : "Вступить"}
          </Button>
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


