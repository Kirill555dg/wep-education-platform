/**
 * Hook for fetching student's joined classrooms
 */
import { useState, useEffect } from "react";
import { classroomsApi, type Classroom } from "@/shared/api";

export function useStudentClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassrooms = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await classroomsApi.getAll();
      setClassrooms(data);
    } catch (err) {
      setError("Не удалось загрузить классы");
      console.error("Error fetching classrooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  return {
    classrooms,
    loading,
    error,
    refetch: fetchClassrooms,
  };
}

