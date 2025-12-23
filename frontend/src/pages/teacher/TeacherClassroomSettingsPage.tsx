import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { classroomsApi, getErrorMessage } from "@/shared/api";
import { useClassroomQuery } from "@/entities/classroom/api/queries";
import { classroomQueryKeys } from "@/entities/classroom/api/queryKeys";
import { routes } from "@/shared/config/routes";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

export function TeacherClassroomSettingsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const classroomId = Number(params.classroomId);

  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  if (!Number.isFinite(classroomId)) {
    navigate(routes.teacher.home, { replace: true });
    return null;
  }

  const queryClient = useQueryClient();
  const classroomQuery = useClassroomQuery(classroomId);
  const initializedRef = useRef(false);

  useEffect(() => {
    const c = classroomQuery.data;
    if (!c) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    setName(c.name);
    setSubject(c.subject);
    setDescription(c.description ?? "");
    setGradeLevel(c.grade_level != null ? String(c.grade_level) : "");
    setMaxStudents(c.max_students != null ? String(c.max_students) : "");
    setIsActive(Boolean(c.is_active));
    setInviteCode(c.invite_code ?? null);
  }, [classroomQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () =>
      await classroomsApi.update(classroomId, {
        name: name || null,
        subject: subject || null,
        description: description || null,
        grade_level: gradeLevel ? Number(gradeLevel) : null,
        max_students: maxStudents ? Number(maxStudents) : null,
        is_active: isActive,
      }),
    onSuccess: async (updated) => {
      setError(null);
      setInviteCode(updated.invite_code ?? null);
      toast({ title: "Сохранено", description: updated.name });
      await queryClient.invalidateQueries({ queryKey: classroomQueryKeys.byId(classroomId) });
      await queryClient.invalidateQueries({ queryKey: classroomQueryKeys.myRoot() });
    },
    onError: (e) => {
      const msg = getErrorMessage(e);
      setError(msg);
      toast({ title: "Ошибка", description: msg, variant: "destructive" });
    },
  });

  const onCopyInvite = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast({ title: "Скопировано", description: "Invite code скопирован в буфер обмена" });
    } catch {
      toast({ title: "Не удалось скопировать", description: inviteCode, variant: "destructive" });
    }
  };

  if (classroomQuery.isLoading) return <div className="text-sm text-muted-foreground">Загрузка...</div>;
  if (classroomQuery.error) return <div className="text-sm text-destructive">{getErrorMessage(classroomQuery.error)}</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Настройки класса</h1>
          <p className="text-sm text-muted-foreground">Classroom #{classroomId}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.classroom(classroomId)}>Назад</Link>
        </Button>
      </div>

      {error ? <div className="text-sm text-destructive">{error}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>Основное</CardTitle>
          <CardDescription>Название, предмет, описание и параметры набора</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Название</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Предмет</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Описание</label>
            <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Класс (grade level)</label>
              <Input value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} placeholder="например: 7" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Лимит учеников</label>
              <Input value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} placeholder="например: 30" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Активен</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-muted-foreground">{isActive ? "Да" : "Нет"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isLoading}>
              {saveMutation.isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite code</CardTitle>
          <CardDescription>Код для вступления учеников (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="font-mono">{inviteCode ?? "-"}</div>
          <Button variant="secondary" size="sm" onClick={() => void onCopyInvite()} disabled={!inviteCode}>
            Скопировать
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


