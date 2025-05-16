import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/model/store";

export default function AuthBootstrapper() {
  const setUser = useAuthStore((s) => s.setUser);
  const setBootstrapped = useAuthStore((s) => s.setBootstrapped);

  useEffect(() => {
    const raw = sessionStorage.getItem("auth-user") || localStorage.getItem("auth-user");

    if (raw) {
      try {
        const user = JSON.parse(raw);
        setUser(user);
      } catch {
        sessionStorage.removeItem("auth-user");
        localStorage.removeItem("auth-user");
      }
    }

    setBootstrapped();
  }, [setUser, setBootstrapped]);

  return null;
}
