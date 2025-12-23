import { Link, useNavigate, useParams } from "react-router-dom";

import { getErrorMessage } from "@/shared/api";
import { useClassroomLessonsQuery, useClassroomQuery } from "@/entities/classroom/api/queries";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ClassroomChatPreview } from "@/widgets/chat/ClassroomChatPreview";

export function StudentClassroomPage() {
  const navigate = useNavigate();
  const params = useParams();
  const classroomId = Number(params.classroomId);

  if (!Number.isFinite(classroomId)) {
    navigate(routes.student.home, { replace: true });
    return null;
  }

  const classroomQuery = useClassroomQuery(classroomId);
  const lessonsQuery = useClassroomLessonsQuery(classroomId);

  if (classroomQuery.isLoading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (classroomQuery.error) return <div className="text-sm text-destructive">{getErrorMessage(classroomQuery.error)}</div>;
  const classroom = classroomQuery.data;
  const lessons = (lessonsQuery.data?.items ?? []).map((l) => ({ id: l.id, title: l.title }));
  if (!classroom) return <div className="text-sm text-muted-foreground">Класс не найден</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="student-classroom-title">
            {classroom.name}
          </h1>
          <div className="text-sm text-muted-foreground">{classroom.subject}</div>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.student.home}>Назад</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Уроки</CardTitle>
          <CardDescription>Опубликованные уроки для класса</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {lessonsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          {lessonsQuery.error ? <div className="text-sm text-destructive">{getErrorMessage(lessonsQuery.error)}</div> : null}
          {lessons.length === 0 ? <div className="text-sm text-muted-foreground">Пока нет уроков</div> : null}
          {lessons.map((l) => (
            <div key={l.id} className="flex items-center justify-between border rounded-md px-3 py-2" data-testid="lesson-row">
              <div className="font-medium">{l.title}</div>
              <Button asChild size="sm" variant="secondary">
                <Link to={routes.student.lesson(l.id)} data-testid={`open-lesson-${l.id}`}>
                  Открыть
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Чат класса</CardTitle>
          <CardDescription>Единый чат находится на отдельной странице</CardDescription>
        </CardHeader>
        <CardContent>
          <ClassroomChatPreview classroomId={classroomId} />
        </CardContent>
      </Card>
    </div>
  );
}


