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
    
    return {
      id: backendUser.id,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      middleName: backendUser.middle_name ?? undefined,
      email: backendUser.email,
      role: backendUser.role,
      gender: data.gender,
      birthDate: data.birthDate,
      about: data.about,
    };
  },
};

