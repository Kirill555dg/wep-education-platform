import type { AuthApi } from "./api";
import type { User } from "@/entities/user/model/types";
import type { LoginData, RegisterData } from "@/features/auth/model/schema";
import { authApi as backendAuthApi } from "@/shared/api";

/**
 * Real API implementation using backend API client
 */
export const authApiReal: AuthApi = {
  async login(data: LoginData): Promise<User> {
    // Map frontend LoginData to backend LoginRequestDTO
    const response = await backendAuthApi.login({
      username_or_email: data.email,
      password: data.password,
    });

    // Map backend User to frontend User
    return {
      id: response.user.id,
      username: response.user.username,
      email: response.user.email,
      firstName: response.user.full_name.split(" ")[0] || "",
      lastName: response.user.full_name.split(" ")[1] || "",
      middleName: response.user.full_name.split(" ")[2] || "",
      dateOfBirth: "",
      gender: "male", // Default, should be fetched from backend if needed
      role: "student", // Will be determined from role endpoint
      avatarUrl: response.user.avatar_url || "",
      description: "",
    };
  },

  async register(data: RegisterData): Promise<User> {
    // Map frontend RegisterData to backend UserCreateDTO
    const fullName = [data.lastName, data.firstName, data.middleName]
      .filter(Boolean)
      .join(" ");

    const response = await backendAuthApi.register({
      username: data.email.split("@")[0], // Generate username from email
      email: data.email,
      password: data.password,
      full_name: fullName,
      is_teacher: data.role === "teacher",
    });

    // Map backend User to frontend User
    return {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName || "",
      dateOfBirth: data.dateOfBirth || "",
      gender: data.gender,
      role: data.role,
      avatarUrl: response.avatar_url || "",
      description: data.description || "",
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
      const roleResponse = await backendAuthApi.getCurrentUserRole();

      // Map backend User to frontend User
      return {
        id: backendUser.id,
        username: backendUser.username,
        email: backendUser.email,
        firstName: backendUser.full_name.split(" ")[0] || "",
        lastName: backendUser.full_name.split(" ")[1] || "",
        middleName: backendUser.full_name.split(" ")[2] || "",
        dateOfBirth: "",
        gender: "male", // Should be stored in backend if needed
        role: roleResponse.role,
        avatarUrl: backendUser.avatar_url || "",
        description: "",
      };
    } catch {
      return null;
    }
  },
};