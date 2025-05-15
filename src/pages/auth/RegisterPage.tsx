// pages/auth/RegisterPage.tsx
import { AuthLayout } from "@/widgets/auth-layout/AuthLayout";
import { RegisterForm } from "@/pages/auth/ui/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
