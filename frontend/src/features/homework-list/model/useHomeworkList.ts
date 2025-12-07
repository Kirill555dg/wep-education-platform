/**
 * Hook for viewing homework list (student feature)
 */
import { useState, useEffect } from "react";
import { homeworkApi, type Homework } from "@/shared/api";

export function useHomeworkList(lessonId: number | null) {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchHomeworks = async () => {
      setLoading(true);
      setError(null);

      try {
        // Note: This endpoint needs to be implemented in homework.api.ts
        // For now using a placeholder
        // const data = await homeworkApi.getByLesson(lessonId);
        // setHomeworks(data);
        setHomeworks([]);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || "Failed to load homeworks";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworks();
  }, [lessonId]);

  return { homeworks, loading, error };
}

