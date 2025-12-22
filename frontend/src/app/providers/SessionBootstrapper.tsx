import { useEffect } from "react";

import { useSessionStore } from "@/entities/session/model/store";
import { routes } from "@/shared/config/routes";
import { useToast } from "@/shared/hooks/use-toast";
import { logger } from "@/shared/lib/logger";
import { useLocation, useNavigate } from "react-router-dom";

export function SessionBootstrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const bootstrap = useSessionStore((s) => s.bootstrap);
  const status = useSessionStore((s) => s.status);
  const errorCode = useSessionStore((s) => s.errorCode);
  const error = useSessionStore((s) => s.error);
  const errorRequestId = useSessionStore((s) => s.errorRequestId);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (status !== "guest") return;
    if (!errorCode && !error) return;

    // Avoid spamming when user is already on auth pages.
    const isAuthPage = location.pathname === routes.login || location.pathname === routes.register;
    if (isAuthPage) return;

    if (errorCode === "role_changed") {
      toast({
        title: "Сессия устарела",
        description: "Роль была изменена. Войдите заново.",
        variant: "destructive",
      });
      logger.info("session_role_changed_redirect", { requestId: errorRequestId ?? undefined });
      navigate(routes.login, { replace: true });
      return;
    }

    // Generic bootstrap failure (expired token, network, etc.)
    toast({
      title: "Не удалось восстановить сессию",
      description: errorRequestId ? `${error} (request_id: ${errorRequestId})` : error,
      variant: "destructive",
    });
    navigate(routes.login, { replace: true });
  }, [status, errorCode, error, errorRequestId, toast, navigate, location.pathname]);

  return null;
}


