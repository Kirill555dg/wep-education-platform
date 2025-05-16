import { AuthLayout } from "@/widgets/auth/layout/AuthLayout";
import { LoginForm } from "@/pages/auth/ui/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
