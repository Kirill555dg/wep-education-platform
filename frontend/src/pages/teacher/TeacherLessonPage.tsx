import { Link, useNavigate, useParams } from "react-router-dom";

import { getErrorMessage } from "@/shared/api";
import { useLessonHomeworksQuery, useLessonQuery } from "@/entities/lesson/api/queries";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export function TeacherLessonPage() {
  const navigate = useNavigate();
  const params = useParams();
  const lessonId = Number(params.lessonId);

  if (!Number.isFinite(lessonId)) {
    navigate(routes.teacher.home, { replace: true });
    return null;
  }

  const lessonQuery = useLessonQuery(lessonId);
  const homeworksQuery = useLessonHomeworksQuery(lessonId);

  if (lessonQuery.isLoading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (lessonQuery.error) return <div className="text-sm text-destructive">{getErrorMessage(lessonQuery.error)}</div>;
  const lesson = lessonQuery.data;
  const homeworks = (homeworksQuery.data?.items ?? []).map((h) => ({ id: h.id, title: h.title, is_published: !!h.is_published }));

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="teacher-lesson-title">
            {lesson?.title ?? `Lesson #${lessonId}`}
          </h1>
          <div className="text-sm text-muted-foreground">Lesson #{lessonId}</div>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.home}>Назад</Link>
        </Button>
      </div>

      {homeworksQuery.error ? <div className="text-sm text-destructive">{getErrorMessage(homeworksQuery.error)}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Домашние задания</span>
            <Button asChild size="sm" data-testid="create-homework-open">
              <Link to={routes.teacher.homeworkNewForLesson(lessonId)}>Создать ДЗ</Link>
            </Button>
          </CardTitle>
          <CardDescription>Создание и сборка ДЗ из базы задач</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {homeworksQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
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


