import { useState } from "react";
import { classroomsApi } from "@/shared/api";

/**
 * Hook for joining a classroom using real API
 */
export function useJoinClass() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinClass = async (code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await classroomsApi.join({ invite_code: code });
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Не удалось присоединиться к классу";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { joinClass, loading, error, clearError };
}

