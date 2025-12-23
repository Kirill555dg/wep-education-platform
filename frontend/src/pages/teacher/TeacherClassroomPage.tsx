import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage, lessonsApi } from "@/shared/api";
import { useClassroomLessonsQuery, useClassroomQuery, useClassroomStudentsCountQuery } from "@/entities/classroom/api/queries";
import { classroomQueryKeys } from "@/entities/classroom/api/queryKeys";
import { routes } from "@/shared/config/routes";
import { toast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { ClassroomChatPreview } from "@/widgets/chat/ClassroomChatPreview";

export function TeacherClassroomPage() {
  const navigate = useNavigate();
  const params = useParams();
  const classroomId = Number(params.classroomId);

  const [createOpen, setCreateOpen] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");

  if (!Number.isFinite(classroomId)) {
    navigate(routes.teacher.home, { replace: true });
    return null;
  }

  const queryClient = useQueryClient();
  const classroomQuery = useClassroomQuery(classroomId);
  const studentsCountQuery = useClassroomStudentsCountQuery(classroomId);
  const lessonsQuery = useClassroomLessonsQuery(classroomId);

  const lessons = useMemo(() => (lessonsQuery.data?.items ?? []).map((l) => ({ id: l.id, title: l.title })), [lessonsQuery.data]);

  const createLessonMutation = useMutation({
    mutationFn: async () => {
      const created = await lessonsApi.create({
        classroom_id: classroomId,
        title: lessonTitle,
        description: null,
        theory_material_ids: [],
      });
      return await lessonsApi.update(created.id, { is_published: true });
    },
    onSuccess: async () => {
      toast({ title: "Урок создан" });
      setLessonTitle("");
      setCreateOpen(false);
      await queryClient.invalidateQueries({ queryKey: classroomQueryKeys.lessons(classroomId) });
    },
    onError: (e) => toast({ title: "Ошибка", description: getErrorMessage(e), variant: "destructive" }),
  });

  if (classroomQuery.isLoading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (classroomQuery.error) return <div className="text-sm text-destructive">{getErrorMessage(classroomQuery.error)}</div>;
  const classroom = classroomQuery.data;
  if (!classroom) return <div className="text-sm text-muted-foreground">Класс не найден</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="teacher-classroom-title">
            {classroom.name}
          </h1>
          <div className="text-sm text-muted-foreground">
            {classroom.subject} · students: {studentsCountQuery.data ?? "-"} · invite:{" "}
            <span className="font-mono" data-testid="invite-code">
              {classroom.invite_code || "-"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary">
            <Link to={routes.teacher.classroomSettings(classroomId)}>Настройки</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={routes.teacher.home}>Назад</Link>
          </Button>
        </div>
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
                  <Button
                    onClick={() => createLessonMutation.mutate()}
                    disabled={!lessonTitle || createLessonMutation.isLoading}
                    data-testid="create-lesson-submit"
                  >
                    {createLessonMutation.isLoading ? "Создание..." : "Создать"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Уроки для класса</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          {lessonsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
          {lessonsQuery.error ? <div className="text-sm text-destructive">{getErrorMessage(lessonsQuery.error)}</div> : null}
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
          <CardDescription>Единый чат находится на отдельной странице</CardDescription>
        </CardHeader>
        <CardContent>
          <ClassroomChatPreview classroomId={classroomId} />
        </CardContent>
      </Card>
    </div>
  );
}


