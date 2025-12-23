import { Link, useNavigate, useParams } from "react-router-dom";

import { getErrorMessage } from "@/shared/api";
import { useLessonHomeworksQuery, useLessonQuery } from "@/entities/lesson/api/queries";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function StudentLessonPage() {
  const navigate = useNavigate();
  const params = useParams();
  const lessonId = Number(params.lessonId);

  if (!Number.isFinite(lessonId)) {
    navigate(routes.student.home, { replace: true });
    return null;
  }

  const lessonQuery = useLessonQuery(lessonId);
  const homeworksQuery = useLessonHomeworksQuery(lessonId);

  if (lessonQuery.isLoading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (lessonQuery.error) return <div className="text-sm text-destructive">{getErrorMessage(lessonQuery.error)}</div>;
  const lesson = lessonQuery.data;
  const homeworks = (homeworksQuery.data?.items ?? []).map((h) => ({ id: h.id, title: h.title }));

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="student-lesson-title">
            {lesson?.title ?? `Lesson #${lessonId}`}
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
          {homeworksQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          {homeworksQuery.error ? <div className="text-sm text-destructive">{getErrorMessage(homeworksQuery.error)}</div> : null}
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


