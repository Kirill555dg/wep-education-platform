/**
 * Hook for creating a lesson (teacher feature)
 */
import { useState } from "react";
import { lessonsApi, type LessonCreateDTO } from "@/shared/api";

export function useCreateLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLesson = async (data: LessonCreateDTO) => {
    setLoading(true);
    setError(null);

    try {
      const lesson = await lessonsApi.create(data);
      return lesson;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to create lesson";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { createLesson, loading, error, clearError };
}

