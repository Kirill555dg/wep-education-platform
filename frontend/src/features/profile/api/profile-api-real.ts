import type { ProfileApi } from "./profile-api";
import type { User } from "@/entities/user/model/types";
import { authApi } from "@/shared/api";

/**
 * Real API implementation using backend API client
 */
export const profileApiReal: ProfileApi = {
  async updateProfile(data: Partial<User>): Promise<User> {
    // Note: Backend doesn't have a dedicated update profile endpoint yet
    // This is a placeholder that uses getCurrentUser for now
    // TODO: Implement proper updateProfile endpoint in backend
    
    // For now, we can only fetch the current profile
    const backendUser = await authApi.getCurrentUser();
    
    // Map backend User to frontend User
    return {
      id: backendUser.id,
      username: backendUser.username,
      email: backendUser.email,
      firstName: backendUser.full_name.split(" ")[0] || "",
      lastName: backendUser.full_name.split(" ")[1] || "",
      middleName: backendUser.full_name.split(" ")[2] || "",
      dateOfBirth: data.dateOfBirth || "",
      gender: data.gender || "male",
      role: data.role || "student",
      avatarUrl: backendUser.avatar_url || "",
      description: data.description || "",
    };
  },
};

