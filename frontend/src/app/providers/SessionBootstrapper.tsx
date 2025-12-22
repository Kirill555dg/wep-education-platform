import { useEffect } from "react";

import { useSessionStore } from "@/entities/session/model/store";
import { toast } from "@/shared/hooks/use-toast";

export function SessionBootstrapper() {
  const bootstrap = useSessionStore((s) => s.bootstrap);
  const status = useSessionStore((s) => s.status);
  const error = useSessionStore((s) => s.error);
  const clearError = useSessionStore((s) => s.clearError);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!error) return;
    // Surface bootstrap/session errors once to the user (e.g. token expired / role_changed).
    if (status === "guest") {
      toast({
        title: "Сессия завершена",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [clearError, error, status]);

  return null;
}


