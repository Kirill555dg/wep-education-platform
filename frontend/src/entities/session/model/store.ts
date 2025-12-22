import { create } from "zustand";

import { authApi } from "@/shared/api";
import { getErrorMessage, isRoleChanged } from "@/shared/api/errors";
import { logger } from "@/shared/lib/logger";
import type { SessionStatus, SessionUser } from "./types";

type SessionState = {
  status: SessionStatus;
  user: SessionUser | null;
  error: string | null;

  bootstrap: () => Promise<void>;
  setUser: (user: SessionUser | null) => void;
  logout: () => void;
  clearError: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  status: "unknown",
  user: null,
  error: null,

  async bootstrap() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ status: "guest", user: null, error: null });
      return;
    }

    try {
      const user = await authApi.me();
      logger.info("session_bootstrap_ok", { userId: user.id, role: user.role });
      set({ status: "authenticated", user, error: null });
    } catch (err) {
      // Token can become invalid after role switch or expiration.
      if (isRoleChanged(err)) {
        authApi.logout();
      }
      logger.warn("session_bootstrap_failed", { message: getErrorMessage(err), roleChanged: isRoleChanged(err) });
      set({ status: "guest", user: null, error: getErrorMessage(err) });
    }
  },

  setUser(user) {
    set({ user, status: user ? "authenticated" : "guest" });
  },

  logout() {
    authApi.logout();
    set({ status: "guest", user: null, error: null });
  },

  clearError() {
    set({ error: null });
  },
}));


