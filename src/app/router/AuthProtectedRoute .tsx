import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store";
import { Loader } from "@/shared/ui/loader";

export default function AuthProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  if (!bootstrapped) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
