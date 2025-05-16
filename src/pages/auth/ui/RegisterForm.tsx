import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterData } from "@/features/auth/model/schema";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { useAuthStore } from "@/features/auth/model/store";
import { toast } from "@/shared/lib/toast";

export function RegisterForm() {
  const navigate = useNavigate();

  const performRegister = useAuthStore((s) => s.register);
  const error = useAuthStore((s) => s.error);
  const setError = useAuthStore((s) => s.setError);
  const isLoading = useAuthStore((s) => s.loading);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      description: "",
      role: "student",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterData) => {
    setError(null);
    try {
      await performRegister(data);
      const role = useAuthStore.getState().activeRole;
      toast.success("Регистрация завершена", `Вы вошли как ${role === "teacher" ? "учитель" : "ученик"}`);
      navigate(`/${role}`);
    } catch {
      setError("Произошла ошибка. Попробуйте снова.");
      toast.error("Ошибка", "Регистрация не удалась");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Регистрация</CardTitle>
        <CardDescription className="text-center">Создайте учетную запись для доступа к платформе</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}

          <div className="space-y-4">
            {["lastName", "firstName", "middleName"].map((field, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={field}>
                  {field === "middleName" ? "Отчество (необязательно)" : field === "firstName" ? "Имя" : "Фамилия"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input id={field} className="pl-10" {...register(field as keyof RegisterData)} />
                </div>
                {errors[field as keyof RegisterData] && (
                  <p className="text-sm text-red-600">{errors[field as keyof RegisterData]?.message}</p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input id="email" type="email" placeholder="example@edu.ru" className="pl-10" {...register("email")} />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Дата рождения</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input id="dateOfBirth" type="date" className="pl-10" {...register("dateOfBirth")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание (необязательно)</Label>
            <Textarea id="description" placeholder="Расскажите немного о себе" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label>Роль</Label>
            <div className="flex gap-2">
              {["student", "teacher"].map((role) => (
                <Button
                  key={role}
                  type="button"
                  className="flex-1"
                  variant={watch("role") === role ? "default" : "outline"}
                  onClick={() => setValue("role", role as "student" | "teacher")}
                >
                  {role === "student" ? "Ученик" : "Учитель"}
                </Button>
              ))}
            </div>
            {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="agreeTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="agreeTerms"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              )}
            />
            <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
              Я принимаю условия использования
            </Label>
          </div>

          {errors.agreeTerms && <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>}

          <Button className="w-full" type="submit" disabled={isSubmitting || isLoading}>
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Войти
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
