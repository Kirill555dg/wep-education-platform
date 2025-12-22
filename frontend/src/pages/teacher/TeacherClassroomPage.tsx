import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { classroomsApi, getErrorMessage, lessonsApi } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { ClassroomChat } from "@/widgets/chat/ClassroomChat";

export function TeacherClassroomPage() {
  const navigate = useNavigate();
  const params = useParams();
  const classroomId = Number(params.classroomId);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState<{ id: number; name: string; subject: string; invite_code: string | null } | null>(
    null
  );
  const [lessons, setLessons] = useState<Array<{ id: number; title: string }>>([]);
  const [studentsCount, setStudentsCount] = useState<number | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await classroomsApi.get(classroomId);
      setClassroom({ id: c.id, name: c.name, subject: c.subject, invite_code: c.invite_code });

      const studentsPage = await classroomsApi.listStudents(classroomId);
      setStudentsCount(studentsPage.total);

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
      navigate(routes.teacher.home, { replace: true });
      return;
    }
    void load();
  }, [classroomId]);

  const createLesson = async () => {
    setError(null);
    try {
      const created = await lessonsApi.create({
        classroom_id: classroomId,
        title: lessonTitle,
        description: null,
        theory_material_ids: [],
      });

      // Publish for students.
      const published = await lessonsApi.update(created.id, { is_published: true });

      setLessons((prev) => [{ id: published.id, title: published.title }, ...prev]);
      setLessonTitle("");
      setCreateOpen(false);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  if (loading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (error) return <div className="text-sm text-destructive">{error}</div>;
  if (!classroom) return <div className="text-sm text-muted-foreground">Класс не найден</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="teacher-classroom-title">
            {classroom.name}
          </h1>
          <div className="text-sm text-muted-foreground">
            {classroom.subject} · students: {studentsCount ?? "-"} · invite:{" "}
            <span className="font-mono" data-testid="invite-code">
              {classroom.invite_code || "-"}
            </span>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.home}>Назад</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Уроки</span>
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="create-lesson-open">
                  Добавить урок
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новый урок</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Название</label>
                    <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} data-testid="create-lesson-title" />
                  </div>
                  <Button onClick={() => void createLesson()} disabled={!lessonTitle} data-testid="create-lesson-submit">
                    Создать
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Уроки для класса</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {lessons.length === 0 ? <div className="text-sm text-muted-foreground">Пока нет уроков</div> : null}
          {lessons.map((l) => (
            <div key={l.id} className="flex items-center justify-between border rounded-md px-3 py-2" data-testid="lesson-row">
              <div className="font-medium">{l.title}</div>
              <Button asChild size="sm" variant="secondary">
                <Link to={routes.teacher.lesson(l.id)} data-testid={`open-lesson-${l.id}`}>
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
          <CardDescription>Realtime чат (WebSocket) + fallback на HTTP</CardDescription>
        </CardHeader>
        <CardContent>
          <ClassroomChat classroomId={classroomId} />
        </CardContent>
      </Card>
    </div>
  );
}


