import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/model/store";

export default function AuthBootstrapper() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null;
}
