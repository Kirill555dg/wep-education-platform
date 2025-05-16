import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "@/features/auth/model/schema";
import { useAuthStore } from "@/features/auth/model/store";
import { useNavigate, Link } from "react-router-dom";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/card";
import { Mail, Lock } from "lucide-react";
import { toast } from "@/shared/lib/toast";

export function LoginForm() {
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const setError = useAuthStore((s) => s.setError);
  const isLoading = useAuthStore((s) => s.loading);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginData) => {
    setError(null);
    try {
      await login(data);
      const role = useAuthStore.getState().activeRole;
      toast.success("Успешный вход", `Добро пожаловать!`);
      navigate(`/${role}`);
    } catch (_) {
      setError("Неверный email или пароль.");
      toast.error("Ошибка", "Неверный email или пароль");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
        <CardDescription className="text-center">
          Войдите в свою учетную запись для доступа к образовательной платформе
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="example@school.edu"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type={"password"}
                placeholder="••••••••"
                className="pl-10"
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                Запомнить меня
              </Label>
            </div>
            <Link to="/reset-password" className="text-sm text-blue-600 hover:underline">
              Забыли пароль?
            </Link>
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting || isLoading}>
            {isLoading ? "Загрузка..." : "Войти"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <span className="text-gray-600">Нет учетной записи? </span>
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Зарегистрироваться
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
