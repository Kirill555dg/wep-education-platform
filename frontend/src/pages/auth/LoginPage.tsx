import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSessionStore } from "@/entities/session/model/store";
import { authApi, getErrorMessage } from "@/shared/api";
import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

const schema = z.object({
  username_or_email: z.string().min(3),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useSessionStore((s) => s.setUser);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username_or_email: "",
      password: "",
    },
  });

  const message = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("message");
  }, [location.search]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const resp = await authApi.login(values);
      setUser(resp.user);
      navigate(resp.user.role === "teacher" ? routes.teacher.home : routes.student.home, { replace: true });
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    }
  });

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Вход</CardTitle>
          <CardDescription>Войти в систему с использованием email и пароля</CardDescription>
          {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4" data-testid="login-form">
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="username_or_email">
                Email
              </label>
              <Input id="username_or_email" {...form.register("username_or_email")} data-testid="login-email" />
              {form.formState.errors.username_or_email ? (
                <p className="text-sm text-destructive">{form.formState.errors.username_or_email.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="password">
                Пароль
              </label>
              <Input id="password" type="password" {...form.register("password")} data-testid="login-password" />
              {form.formState.errors.password ? (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>
            {submitError ? (
              <p className="text-sm text-destructive" data-testid="login-error">
                {submitError}
              </p>
            ) : null}
            <Button type="submit" disabled={form.formState.isSubmitting} data-testid="login-submit">
              {form.formState.isSubmitting ? "Входим..." : "Войти"}
            </Button>
            <div className="text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <Link className="underline" to={routes.register}>
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


