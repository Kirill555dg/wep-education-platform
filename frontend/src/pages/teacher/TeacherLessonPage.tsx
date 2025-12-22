import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getErrorMessage, homeworkApi, lessonsApi, problemsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

export function TeacherLessonPage() {
  const navigate = useNavigate();
  const params = useParams();
  const lessonId = Number(params.lessonId);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [lessonTitle, setLessonTitle] = useState<string>("");
  const [homeworks, setHomeworks] = useState<Array<{ id: number; title: string; is_published: boolean }>>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState("");
  const [problemTitle, setProblemTitle] = useState("");
  const [problemAnswer, setProblemAnswer] = useState("");
  const [problemText, setProblemText] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const lesson = await lessonsApi.get(lessonId);
      setLessonTitle(lesson.title);

      const hwPage = await homeworkApi.listByLesson(lessonId);
      setHomeworks(hwPage.items.map((h) => ({ id: h.id, title: h.title, is_published: !!h.is_published })));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(lessonId)) {
      navigate(routes.teacher.home, { replace: true });
      return;
    }
    void load();
  }, [lessonId]);

  const createHomeworkWithProblem = async () => {
    setError(null);
    try {
      const createdProblem = await problemsApi.create({
        title: problemTitle,
        description: problemText || "Ответь кратко",
        problem_type: "short_answer",
        correct_answer: problemAnswer,
        explanation: null,
        hints: null,
      });

      const createdHomework = await homeworkApi.create({
        lesson_id: lessonId,
        title: hwTitle,
        description: null,
        max_score: 1,
        deadline: null,
        problem_ids: [createdProblem.id],
        problem_points: [1],
      });

      // Publish for students.
      const published = await homeworkApi.update(createdHomework.id, { is_published: true });

      setHomeworks((prev) => [{ id: published.id, title: published.title, is_published: !!published.is_published }, ...prev]);
      setCreateOpen(false);
      setHwTitle("");
      setProblemTitle("");
      setProblemAnswer("");
      setProblemText("");
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="teacher-lesson-title">
            {lessonTitle}
          </h1>
          <div className="text-sm text-muted-foreground">Lesson #{lessonId}</div>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.home}>Назад</Link>
        </Button>
      </div>

      {error ? <div className="text-sm text-destructive">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Домашние задания</span>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="create-homework-open">
                  Создать ДЗ (1 задача)
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ДЗ + задача</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Название ДЗ</label>
                    <Input value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} data-testid="create-homework-title" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Название задачи</label>
                    <Input
                      value={problemTitle}
                      onChange={(e) => setProblemTitle(e.target.value)}
                      data-testid="create-problem-title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Текст задачи</label>
                    <Textarea
                      value={problemText}
                      onChange={(e) => setProblemText(e.target.value)}
                      data-testid="create-problem-description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Правильный ответ</label>
                    <Input
                      value={problemAnswer}
                      onChange={(e) => setProblemAnswer(e.target.value)}
                      data-testid="create-problem-answer"
                    />
                  </div>
                  <Button
                    onClick={() => void createHomeworkWithProblem()}
                    disabled={!hwTitle || !problemTitle || !problemAnswer}
                    data-testid="create-homework-submit"
                  >
                    Создать и опубликовать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Для демонстрации MVP: создаётся задача + ДЗ и сразу публикуется</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {homeworks.length === 0 ? <div className="text-sm text-muted-foreground">Пока нет ДЗ</div> : null}
          {homeworks.map((h) => (
            <div key={h.id} className="flex items-center justify-between border rounded-md px-3 py-2" data-testid="homework-row">
              <div>
                <div className="font-medium">{h.title}</div>
                <div className="text-xs text-muted-foreground">published: {String(h.is_published)}</div>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link to={routes.teacher.homework(h.id)} data-testid={`open-teacher-homework-${h.id}`}>
                    Открыть (teacher)
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to={routes.student.homework(h.id)} data-testid={`open-student-homework-${h.id}`}>
                    Открыть (student)
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


