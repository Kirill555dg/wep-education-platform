import { Navigate } from "react-router-dom";

import { useSessionStore } from "@/entities/session/model/store";
import { routes } from "@/shared/config/routes";

export function HomeRedirect() {
  const user = useSessionStore((s) => s.user);
  if (!user) return <Navigate to={routes.login} replace />;

  return <Navigate to={user.role === "teacher" ? routes.teacher.home : routes.student.home} replace />;
}


