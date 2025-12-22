import type { AuthApi } from "./api";
import type { User } from "@/entities/user/model/types";
import type { LoginData, RegisterData } from "@/features/auth/model/schema";
import { authApi as backendAuthApi, UserRole } from "@/shared/api";

function toEntityRole(role: UserRole): User["role"] {
  return role === UserRole.TEACHER ? "teacher" : "student";
}

/**
 * Real API implementation using backend API client
 */
export const authApiReal: AuthApi = {
  async login(data: LoginData): Promise<User> {
    const response = await backendAuthApi.login({
      username_or_email: data.email,
      password: data.password,
    });

    const u = response.user;
    return {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      middleName: u.middle_name ?? undefined,
      email: u.email,
      role: toEntityRole(u.role),
    };
  },

  async register(data: RegisterData): Promise<User> {
    const response = await backendAuthApi.register({
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      middle_name: data.middleName || null,
      role: data.role === "teacher" ? UserRole.TEACHER : UserRole.STUDENT,
    });

    const u = response;
    return {
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      middleName: u.middle_name ?? undefined,
      email: u.email,
      role: toEntityRole(u.role),
      gender: data.gender,
      birthDate: data.dateOfBirth,
      about: data.description,
    };
  },

  async resetPassword(email: string): Promise<void> {
    // This endpoint is not yet implemented in backend
    // For now, just throw an error or implement when backend is ready
    throw new Error("Password reset not yet implemented on backend");
  },

  async checkAuth(): Promise<User | null> {
    try {
      if (!backendAuthApi.isAuthenticated()) {
        return null;
      }

      const backendUser = await backendAuthApi.getCurrentUser();

      return {
        id: backendUser.id,
        firstName: backendUser.first_name,
        lastName: backendUser.last_name,
        middleName: backendUser.middle_name ?? undefined,
        email: backendUser.email,
        role: toEntityRole(backendUser.role),
      };
    } catch {
      return null;
    }
  },
};