/**
 * Hook for getting teacher's classrooms
 */
import { useState, useEffect } from "react";
import { classroomsApi, type Classroom } from "@/shared/api";

export function useTeacherClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClassrooms = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await classroomsApi.getAll();
      setClassrooms(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Не удалось загрузить классы";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return { classrooms, loading, error, refetch: fetchClassrooms };
}

