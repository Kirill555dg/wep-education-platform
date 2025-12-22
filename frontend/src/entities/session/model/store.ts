import { create } from "zustand";

import { authApi } from "@/shared/api";
import { getErrorCode, getErrorMessage, getRequestId, isRoleChanged } from "@/shared/api/errors";
import { logger } from "@/shared/lib/logger";
import type { SessionStatus, SessionUser } from "./types";

type SessionState = {
  status: SessionStatus;
  user: SessionUser | null;
  error: string | null;
  errorCode: string | null;
  errorRequestId: string | null;

  bootstrap: () => Promise<void>;
  setUser: (user: SessionUser | null) => void;
  logout: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  status: "unknown",
  user: null,
  error: null,
  errorCode: null,
  errorRequestId: null,

  async bootstrap() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      set({ status: "guest", user: null, error: null, errorCode: null, errorRequestId: null });
      return;
    }

    try {
      const user = await authApi.me();
      logger.info("session_bootstrap_ok", { userId: user.id, role: user.role });
      set({ status: "authenticated", user, error: null, errorCode: null, errorRequestId: null });
    } catch (err) {
      const code = getErrorCode(err);
      const requestId = getRequestId(err);
      // Token can become invalid after role switch or expiration.
      if (isRoleChanged(err)) {
        authApi.logout();
      }
      logger.warn("session_bootstrap_failed", {
        message: getErrorMessage(err),
        code,
        requestId,
        roleChanged: isRoleChanged(err),
      });
      set({ status: "guest", user: null, error: getErrorMessage(err), errorCode: code, errorRequestId: requestId });
    }
  },

  setUser(user) {
    set({ user, status: user ? "authenticated" : "guest", error: null, errorCode: null, errorRequestId: null });
  },

  logout() {
    authApi.logout();
    set({ status: "guest", user: null, error: null, errorCode: null, errorRequestId: null });
  },
}));


