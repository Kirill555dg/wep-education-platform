import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store";

export default function RoleProtectedRoute({ requiredRole }: { requiredRole: "student" | "teacher" }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeRole = useAuthStore((s) => s.activeRole);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (activeRole !== requiredRole) return <Navigate to="/profile" replace />;
  return <Outlet />;
}
