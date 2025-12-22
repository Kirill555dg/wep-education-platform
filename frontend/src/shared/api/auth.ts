import "@/shared/api/openapi";

import {
  AuthenticationService,
  type LoginRequest,
  type RoleSwitchRequest,
  type TokenResponse,
  type UserCreate,
  type UserResponse,
  type UserRolesResponse,
} from "@/shared/api/generated";

export const authApi = {
  async register(payload: UserCreate): Promise<UserResponse> {
    return await AuthenticationService.registerApiV1AuthRegisterPost(payload);
  },

  async login(payload: LoginRequest): Promise<TokenResponse> {
    const resp = await AuthenticationService.loginApiV1AuthLoginPost(payload);
    if (resp.access_token) {
      localStorage.setItem("access_token", resp.access_token);
      localStorage.setItem("user", JSON.stringify(resp.user));
    }
    return resp;
  },

  async me(): Promise<UserResponse> {
    return await AuthenticationService.getCurrentUserProfileApiV1AuthMeGet();
  },

  async getRoles(): Promise<UserRolesResponse> {
    return await AuthenticationService.getCurrentUserRolesApiV1AuthMeRolesGet();
  },

  async switchRole(payload: RoleSwitchRequest): Promise<UserRolesResponse> {
    return await AuthenticationService.switchMyRoleApiV1AuthMeRolePost(payload);
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },
} as const;


