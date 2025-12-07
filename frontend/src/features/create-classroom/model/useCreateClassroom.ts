/**
 * Hook for creating a classroom (teacher feature)
 */
import { useState } from "react";
import { classroomsApi, type ClassroomCreateDTO } from "@/shared/api";

export function useCreateClassroom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClassroom = async (data: ClassroomCreateDTO) => {
    setLoading(true);
    setError(null);

    try {
      const classroom = await classroomsApi.create(data);
      return classroom;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to create classroom";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { createClassroom, loading, error, clearError };
}

