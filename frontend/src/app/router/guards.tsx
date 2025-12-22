import { Navigate, Outlet } from "react-router-dom";

import { useSessionStore } from "@/entities/session/model/store";
import { routes } from "@/shared/config/routes";
import { Loader } from "@/shared/ui/loader";

export function RequireAuth() {
  const status = useSessionStore((s) => s.status);

  if (status === "unknown") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to={routes.login} replace />;
  }

  return <Outlet />;
}

export function RequireRole(props: { role: "teacher" | "student" }) {
  const user = useSessionStore((s) => s.user);
  if (!user) return <Navigate to={routes.login} replace />;

  if (user.role !== props.role) {
    return <Navigate to={user.role === "teacher" ? routes.teacher.home : routes.student.home} replace />;
  }

  return <Outlet />;
}

