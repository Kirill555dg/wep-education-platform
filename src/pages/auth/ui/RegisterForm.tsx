import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterData } from "@/features/auth/model/schema";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Calendar } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { useAuthStore } from "@/features/auth/model/store";
import { toast } from "@/shared/lib/toast";
import {
  AuthCardFooter,
  AuthCardHeader,
  FormCheckbox,
  FormErrorAlert,
  FormErrorMessage,
  FormFieldWithIcon,
  FormLink,
} from "@/widgets/auth";

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
      toast.info("Регистрация завершена", `Добро пожаловать!`);
      navigate(`/${role}`);
    } catch {
      setError("Произошла ошибка. Попробуйте снова.");
    }
  };

  return (
    <Card>
      <AuthCardHeader title="Регистрация" description="Создайте учетную запись для доступа к платформе" />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormErrorAlert message={error} />

          <div className="space-y-4">
            {["lastName", "firstName", "middleName"].map((field, index) => (
              <FormFieldWithIcon
                key={index}
                id={field}
                label={field === "middleName" ? "Отчество (необязательно)" : field === "firstName" ? "Имя" : "Фамилия"}
                placeholder={field === "middleName" ? "Иванович" : field === "firstName" ? "Иван" : "Иванов"}
                icon={User}
                error={errors[field as keyof RegisterData]}
                registerProps={register(field as keyof RegisterData)}
              />
            ))}
          </div>

          <FormFieldWithIcon
            id="email"
            label="Email"
            placeholder="example@edu.ru"
            type="email"
            icon={Mail}
            error={errors.email}
            registerProps={register("email")}
          />

          <FormFieldWithIcon
            id="password"
            label="Пароль"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.password}
            registerProps={register("password")}
          />

          <FormFieldWithIcon
            id="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword}
            registerProps={register("confirmPassword")}
          />

          <FormFieldWithIcon
            id="dateOfBirth"
            label="Дата рождения"
            type="date"
            icon={Calendar}
            error={errors.dateOfBirth}
            registerProps={register("dateOfBirth")}
          />

          <div className="space-y-2">
            <label htmlFor="description">Описание (необязательно)</label>
            <Textarea id="description" placeholder="Расскажите немного о себе" {...register("description")} />
          </div>

          <div className="space-y-2">
            <label>Роль</label>
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
            <FormErrorMessage error={errors.role} />
          </div>

          <FormCheckbox name="agreeTerms" control={control} label="Я принимаю условия использования" />
          <FormErrorMessage error={errors.agreeTerms} />

          <Button className="w-full" type="submit" disabled={isSubmitting || isLoading}>
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>
      </CardContent>
      <AuthCardFooter>
        <p className="text-sm text-gray-600 text-center">
          Уже есть аккаунт? <FormLink to="/login">Войти</FormLink>
        </p>
      </AuthCardFooter>
    </Card>
  );
}
