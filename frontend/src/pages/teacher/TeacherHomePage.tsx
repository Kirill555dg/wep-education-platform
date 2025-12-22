import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { classroomsApi, getErrorMessage } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

export function TeacherHomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Array<{ id: number; name: string; subject: string; invite_code: string | null }>>(
    []
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await classroomsApi.listMine();
      setItems(page.items.map((c) => ({ id: c.id, name: c.name, subject: c.subject, invite_code: c.invite_code })));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    try {
      const created = await classroomsApi.create({ name, subject, grade_level: 7 });
      setCreateOpen(false);
      setName("");
      setSubject("");
      setItems((prev) => [{ id: created.id, name: created.name, subject: created.subject, invite_code: created.invite_code }, ...prev]);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

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
              <Button onClick={() => void create()} disabled={!name || !subject} data-testid="create-classroom-submit">
                Создать
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
            <Button variant="outline" onClick={() => void load()}>
              Повторить
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {loading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}

      {!loading && items.length === 0 ? (
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


