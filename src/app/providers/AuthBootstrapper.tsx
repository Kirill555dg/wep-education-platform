import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/model/store";
import { authApi } from "@/features/auth/api/api";

export default function AuthBootstrapper() {
  const setUser = useAuthStore((s) => s.setUser);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  useEffect(() => {
    authApi
      .checkAuth()
      .then((user) => {
        if (user) setUser(user);
      })
      .finally(() => setBootstrapped());
  }, [setUser, setBootstrapped]);

  return null;
}
