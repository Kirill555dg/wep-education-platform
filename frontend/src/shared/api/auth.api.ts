/**
 * Authentication API client
 */
import "./openapi";

import {
  AuthenticationService,
  type LoginRequest,
  type RoleSwitchRequest,
  type TokenResponse,
  type UserCreate,
  type UserResponse,
  type UserRolesResponse,
} from "@/api/client";

export const authApi = {
  /**
   * Register new user (student or teacher)
   */
  register: async (data: UserCreate): Promise<UserResponse> => {
    return await AuthenticationService.registerApiV1AuthRegisterPost(data);
  },

  /**
   * Login and get JWT token
   */
  login: async (credentials: LoginRequest): Promise<TokenResponse> => {
    const resp = await AuthenticationService.loginApiV1AuthLoginPost(credentials);

    if (resp.access_token) {
      localStorage.setItem("access_token", resp.access_token);
      localStorage.setItem("user", JSON.stringify(resp.user));
    }

    return resp;
  },

  /**
   * Logout user (clear local storage)
   */
  logout: (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  /**
   * Get current authenticated user profile
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    return await AuthenticationService.getCurrentUserProfileApiV1AuthMeGet();
  },

  /**
   * Get current user's role
   */
  getCurrentUserRole: async (): Promise<{ role: string | null }> => {
    const resp = await AuthenticationService.getCurrentUserRoleApiV1AuthMeRoleGet();
    return { role: (resp.role as string | null) ?? null };
  },

  getCurrentUserRoles: async (): Promise<UserRolesResponse> => {
    return await AuthenticationService.getCurrentUserRolesApiV1AuthMeRolesGet();
  },

  switchMyRole: async (payload: RoleSwitchRequest): Promise<UserRolesResponse> => {
    return await AuthenticationService.switchMyRoleApiV1AuthMeRolePost(payload);
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("access_token");
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: (): UserResponse | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as UserResponse;
    } catch {
      return null;
    }
  },
};

