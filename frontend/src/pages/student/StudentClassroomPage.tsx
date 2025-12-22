import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { classroomsApi, getErrorMessage, lessonsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ClassroomChatPreview } from "@/widgets/chat/ClassroomChatPreview";

export function StudentClassroomPage() {
  const navigate = useNavigate();
  const params = useParams();
  const classroomId = Number(params.classroomId);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState<{ id: number; name: string; subject: string } | null>(null);
  const [lessons, setLessons] = useState<Array<{ id: number; title: string }>>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await classroomsApi.get(classroomId);
      setClassroom({ id: c.id, name: c.name, subject: c.subject });

      const lessonsPage = await lessonsApi.listByClassroom(classroomId);
      setLessons(lessonsPage.items.map((l) => ({ id: l.id, title: l.title })));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(classroomId)) {
      navigate(routes.student.home, { replace: true });
      return;
    }
    void load();
  }, [classroomId]);

  if (loading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;
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


