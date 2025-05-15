import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordData } from "@/features/auth/model/schema";
import { useState } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { authApi } from "@/features/auth/api/api";
import { toast } from "@/shared/lib/toast";

export function ResetPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    await authApi.resetPassword(data.email);
    toast.success("Письмо отправлено", "Проверьте вашу почту");
    setSubmittedEmail(data.email);
    setIsSubmitted(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Восстановление пароля</CardTitle>
        <CardDescription className="text-center">
          {!isSubmitted
            ? "Введите email, указанный при регистрации, и мы отправим вам инструкции по восстановлению пароля"
            : "Инструкции по восстановлению пароля отправлены на ваш email"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Отправка..." : "Отправить инструкции"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center text-gray-600">
              Мы отправили инструкции по восстановлению пароля на адрес <strong>{submittedEmail}</strong>. Пожалуйста,
              проверьте вашу почту.
            </p>
            <p className="text-sm text-gray-500 text-center">
              Если вы не получили письмо в течение нескольких минут, проверьте папку «Спам» или попробуйте снова.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline font-medium flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Вернуться на страницу входа
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
