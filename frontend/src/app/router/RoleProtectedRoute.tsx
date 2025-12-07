import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store";
import { Loader } from "@/shared/ui/loader";
import { useUserStore } from "@/entities/user/model/store";

export default function RoleProtectedRoute({ requiredRole }: { requiredRole: "student" | "teacher" }) {
  const user = useUserStore((s) => s.user);
  const currentRole = useUserStore((s) => s.currentRole);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  if (!bootstrapped) return <Loader />;

  const activeRole = currentRole || user?.role;

  if (!user || activeRole !== requiredRole) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
