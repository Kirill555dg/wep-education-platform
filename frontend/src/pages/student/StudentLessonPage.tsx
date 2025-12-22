import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getErrorMessage, homeworkApi, lessonsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function StudentLessonPage() {
  const navigate = useNavigate();
  const params = useParams();
  const lessonId = Number(params.lessonId);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [lessonTitle, setLessonTitle] = useState<string>("");
  const [homeworks, setHomeworks] = useState<Array<{ id: number; title: string }>>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const lesson = await lessonsApi.get(lessonId);
      setLessonTitle(lesson.title);

      const hwPage = await homeworkApi.listByLesson(lessonId);
      setHomeworks(hwPage.items.map((h) => ({ id: h.id, title: h.title })));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(lessonId)) {
      navigate(routes.student.home, { replace: true });
      return;
    }
    void load();
  }, [lessonId]);

  if (loading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="student-lesson-title">
            {lessonTitle}
          </h1>
          <div className="text-sm text-muted-foreground">Lesson #{lessonId}</div>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.student.home}>Назад</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Домашние задания</CardTitle>
          <CardDescription>Опубликованные задания</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {homeworks.length === 0 ? <div className="text-sm text-muted-foreground">Пока нет ДЗ</div> : null}
          {homeworks.map((h) => (
            <div key={h.id} className="flex items-center justify-between border rounded-md px-3 py-2" data-testid="homework-row">
              <div className="font-medium">{h.title}</div>
              <Button asChild size="sm" variant="secondary">
                <Link to={routes.student.homework(h.id)} data-testid={`open-homework-${h.id}`}>
                  Открыть
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}


