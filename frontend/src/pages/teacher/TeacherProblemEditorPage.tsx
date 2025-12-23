import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getErrorMessage, problemsApi } from "@/shared/api";
import { useProblem } from "@/entities/problem/api/queries";
import { problemQueryKeys } from "@/entities/problem/api/queryKeys";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useToast } from "@/shared/hooks/use-toast";

const schema = z.object({
  title: z.string().trim().min(3, "Введите заголовок"),
  description: z.string().trim().min(10, "Добавьте условие задачи"),
  problem_type: z.string().trim().min(1, "Укажите тип"),
  correct_answer: z.string().trim().min(1, "Укажите правильный ответ").nullable(),
  explanation: z.string().trim().nullable(),
  hints: z.string().trim().nullable(),
});

type FormValues = z.infer<typeof schema>;

export function TeacherProblemEditorPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const problemIdParam = params.problemId;
  const isNew = problemIdParam === "new" || !problemIdParam;
  const problemId = Number(problemIdParam);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      problem_type: "short_answer",
      correct_answer: "",
      explanation: null,
      hints: null,
    },
  });

  const header = useMemo(() => (isNew ? "Создать задачу" : `Задача #${problemId}`), [isNew, problemId]);

  useEffect(() => {
    if (isNew) return;
    if (!Number.isFinite(problemId)) {
      navigate(routes.teacher.problems, { replace: true });
    }
  }, [isNew, navigate, problemId]);

  const problemQuery = useProblem(problemId);

  useEffect(() => {
    if (isNew) return;
    if (!problemQuery.data) return;
    const p = problemQuery.data;
    form.reset({
      title: p.title,
      description: p.description,
      problem_type: p.problem_type,
      correct_answer: p.correct_answer ?? "",
      explanation: p.explanation,
      hints: p.hints ?? null,
    });
  }, [form, isNew, problemQuery.data]);

  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: async (values: FormValues) =>
      await problemsApi.create({
        title: values.title,
        description: values.description,
        problem_type: values.problem_type,
        correct_answer: values.correct_answer || null,
        explanation: values.explanation ?? null,
        hints: values.hints ?? null,
      }),
    onSuccess: async (created) => {
      toast({ title: "Задача создана", description: created.title });
      await queryClient.invalidateQueries({ queryKey: problemQueryKeys.all });
      navigate(routes.teacher.problem(created.id), { replace: true });
    },
    onError: (e) => toast({ title: "Ошибка", description: getErrorMessage(e), variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormValues) =>
      await problemsApi.update(problemId, {
        title: values.title,
        description: values.description,
        problem_type: values.problem_type,
        correct_answer: values.correct_answer || null,
        explanation: values.explanation ?? null,
        hints: values.hints ?? null,
      }),
    onSuccess: async (updated) => {
      toast({ title: "Сохранено", description: updated.title });
      await queryClient.invalidateQueries({ queryKey: problemQueryKeys.byId(problemId) });
      await queryClient.invalidateQueries({ queryKey: problemQueryKeys.all });
    },
    onError: (e) => toast({ title: "Ошибка", description: getErrorMessage(e), variant: "destructive" }),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (isNew) {
      createMutation.mutate(values);
      return;
    }
    updateMutation.mutate(values);
  });

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{header}</h1>
          <p className="text-sm text-muted-foreground">Редактор задачи для базы задач</p>
        </div>
        <Button asChild variant="outline">
          <Link to={routes.teacher.problems}>Назад к базе</Link>
        </Button>
      </div>

      {!isNew && problemQuery.isLoading ? <div className="text-sm text-muted-foreground">Загрузка...</div> : null}
      {!isNew && problemQuery.error ? <div className="text-sm text-destructive">{getErrorMessage(problemQuery.error)}</div> : null}

      <Card>
        <CardHeader>
          <CardTitle>Поля задачи</CardTitle>
          <CardDescription>Заполните условие и правильный ответ (для auto-check)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Заголовок</label>
              <Input {...form.register("title")} />
              {form.formState.errors.title ? <p className="text-sm text-destructive">{form.formState.errors.title.message}</p> : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Тип</label>
              <Input {...form.register("problem_type")} placeholder="short_answer / essay / ..." />
              {form.formState.errors.problem_type ? (
                <p className="text-sm text-destructive">{form.formState.errors.problem_type.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Условие</label>
              <Textarea rows={6} {...form.register("description")} />
              {form.formState.errors.description ? (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Правильный ответ</label>
              <Input {...form.register("correct_answer")} />
              {form.formState.errors.correct_answer ? (
                <p className="text-sm text-destructive">{form.formState.errors.correct_answer.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Пояснение (опционально)</label>
              <Textarea rows={3} {...form.register("explanation")} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Подсказки (опционально)</label>
              <Textarea rows={2} {...form.register("hints")} />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={createMutation.isLoading || updateMutation.isLoading}>
                {createMutation.isLoading || updateMutation.isLoading ? "Сохранение..." : "Сохранить"}
              </Button>
              {isNew ? (
                <Button asChild variant="secondary" type="button">
                  <Link to={routes.teacher.problems}>Отмена</Link>
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


