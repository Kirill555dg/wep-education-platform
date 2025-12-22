import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSessionStore } from "@/entities/session/model/store";
import { authApi } from "@/shared/api";
import { getErrorMessage } from "@/shared/api/errors";
import { UserRole } from "@/shared/api/generated";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  middle_name: z.string().optional(),
  role: z.enum(["student", "teacher"]),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useSessionStore((s) => s.setUser);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      role: "student",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const v = schema.parse(values);
      await authApi.register({
        email: v.email,
        password: v.password,
        first_name: v.first_name,
        last_name: v.last_name,
        middle_name: v.middle_name ? v.middle_name : null,
        role: v.role === "teacher" ? UserRole.TEACHER : UserRole.STUDENT,
      });

      // Auto-login after registration to get JWT.
      const token = await authApi.login({ username_or_email: values.email, password: values.password });
      setUser(token.user);
      navigate(token.user.role === "teacher" ? routes.teacher.home : routes.student.home, { replace: true });
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    }
  });

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>Создать новый аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4" data-testid="register-form">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input id="email" {...form.register("email")} data-testid="register-email" />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="password">
                Пароль
              </label>
              <Input id="password" type="password" {...form.register("password")} data-testid="register-password" />
              <div className="text-xs text-muted-foreground">Минимум 8 символов</div>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="first_name">
                  Имя
                </label>
                <Input id="first_name" {...form.register("first_name")} data-testid="register-first-name" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="last_name">
                  Фамилия
                </label>
                <Input id="last_name" {...form.register("last_name")} data-testid="register-last-name" />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="middle_name">
                Отчество (опционально)
              </label>
              <Input id="middle_name" {...form.register("middle_name")} data-testid="register-middle-name" />
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium">Роль</div>
              <RadioGroup
                defaultValue={form.getValues("role")}
                onValueChange={(v) => form.setValue("role", v as "student" | "teacher")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="role-student" />
                  <label htmlFor="role-student" className="text-sm">
                    Student
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="role-teacher" />
                  <label htmlFor="role-teacher" className="text-sm">
                    Teacher
                  </label>
                </div>
              </RadioGroup>
            </div>

            {form.formState.errors.root ? (
              <div className="text-sm text-destructive">{form.formState.errors.root.message}</div>
            ) : null}
            {submitError ? (
              <div className="text-sm text-destructive" data-testid="register-error">
                {submitError}
              </div>
            ) : null}

            <Button type="submit" disabled={form.formState.isSubmitting} data-testid="register-submit">
              {form.formState.isSubmitting ? "Создаём..." : "Создать аккаунт"}
            </Button>

            <div className="text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link className="underline" to={routes.login}>
                Войти
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


