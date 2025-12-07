/**
 * Feature: Update Profile
 * Hook for updating user profile information
 */
import { useState } from "react";
import { profileApi } from "@/features/profile/api/profile-api";
import { useUserStore } from "@/entities/user/model/store";
import type { User } from "@/entities/user/model/types";

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  address?: string;
  about?: string;
  birthDate?: string;
  gender?: "male" | "female";
  contacts?: {
    telegram?: string;
    vk?: string;
  };
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useUserStore((s) => s.setUser);

  const updateProfile = async (data: UpdateProfileData): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await profileApi.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError("Ошибка при обновлении профиля");
      console.error("Error updating profile:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
  };
}

