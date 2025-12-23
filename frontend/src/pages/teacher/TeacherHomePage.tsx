import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { classroomsApi, getErrorMessage } from "@/shared/api";
import { useMyClassroomsQuery } from "@/entities/classroom/api/queries";
import { routes } from "@/shared/config/routes";
import { toast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

export function TeacherHomePage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");

  const queryClient = useQueryClient();
  const listParams = useMemo(() => ({ skip: 0, limit: 100 }), []);
  const classroomsQuery = useMyClassroomsQuery(listParams);

  const createMutation = useMutation({
    mutationFn: async () => await classroomsApi.create({ name, subject, grade_level: 7 }),
    onSuccess: async () => {
      toast({ title: "Класс создан" });
      setCreateOpen(false);
      setName("");
      setSubject("");
      await queryClient.invalidateQueries({ queryKey: ["classroom", "my"] });
    },
    onError: (e) => {
      toast({ title: "Ошибка", description: getErrorMessage(e), variant: "destructive" });
    },
  });

  const items = (classroomsQuery.data?.items ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    subject: c.subject,
    invite_code: c.invite_code,
  }));
  const error = classroomsQuery.error ? getErrorMessage(classroomsQuery.error) : null;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="teacher-title">
            Teacher — классы
          </h1>
          <p className="text-sm text-muted-foreground">Создавай классы, уроки и задания</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="create-classroom-open">Создать класс</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый класс</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Название</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} data-testid="create-classroom-name" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Предмет</label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} data-testid="create-classroom-subject" />
              </div>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={!name || !subject || createMutation.isLoading}
                data-testid="create-classroom-submit"
              >
                {createMutation.isLoading ? "Создание..." : "Создать"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Ошибка</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void classroomsQuery.refetch()}>
              Повторить
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {classroomsQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}

      {!classroomsQuery.isLoading && items.length === 0 ? (
        <div className="text-sm text-muted-foreground">Классов пока нет. Создай первый.</div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((c) => (
          <Card key={c.id} data-testid="classroom-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{c.name}</span>
                <Button asChild size="sm" variant="secondary">
                  <Link to={routes.teacher.classroom(c.id)} data-testid={`open-classroom-${c.id}`}>
                    Открыть
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>{c.subject}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Invite code:{" "}
              <span className="font-mono" data-testid="invite-code">
                {c.invite_code || "-"}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


