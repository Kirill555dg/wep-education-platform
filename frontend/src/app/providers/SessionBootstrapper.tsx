import { useEffect } from "react";

import { useSessionStore } from "@/entities/session/model/store";

export function SessionBootstrapper() {
  const bootstrap = useSessionStore((s) => s.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return null;
}


