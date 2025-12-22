import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getErrorMessage, homeworkApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";

type Problem = { id: number; title: string; description: string; problem_type: string };

export function StudentHomeworkPage() {
  const navigate = useNavigate();
  const params = useParams();
  const homeworkId = Number(params.homeworkId);
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState<string>("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const hw = await homeworkApi.get(homeworkId);
      setTitle(hw.title);

      const rows = await homeworkApi.getProblems(homeworkId);
      const mapped: Problem[] = rows.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        problem_type: p.problem_type,
      }));
      setProblems(mapped);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(homeworkId)) {
      navigate(routes.student.home, { replace: true });
      return;
    }
    void load();
  }, [homeworkId]);

  const submitFirst = async () => {
    if (problems.length === 0) return;
    const p = problems[0];
    const answer = answers[p.id] || "";
    if (!answer) {
      toast({ title: "Введите ответ", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const stats = await homeworkApi.submitAnswer({
        homework_id: homeworkId,
        problem_id: p.id,
        answer,
        time_spent_minutes: 1,
      });
      toast({ title: "Ответ отправлен", description: `score: ${stats.score}/${stats.max_score}` });
    } catch (e) {
      const msg = getErrorMessage(e);
      setError(msg);
      toast({ title: "Ошибка", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;

  const p = problems[0];

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="student-homework-title">
            {title}
          </h1>
          <div className="text-sm text-muted-foreground">Homework #{homeworkId}</div>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.student.home}>Назад</Link>
        </Button>
      </div>

      {!p ? (
        <div className="text-sm text-muted-foreground">В этом ДЗ пока нет задач</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{p.title}</CardTitle>
            <CardDescription>{p.problem_type}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="text-sm whitespace-pre-wrap">{p.description}</div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Ответ</label>
              {p.problem_type === "essay" ? (
                <Textarea
                  value={answers[p.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  data-testid="answer"
                />
              ) : (
                <Input
                  value={answers[p.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  data-testid="answer"
                />
              )}
            </div>
            <Button onClick={() => void submitFirst()} disabled={submitting} data-testid="submit-answer">
              {submitting ? "Отправка..." : "Отправить ответ"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


