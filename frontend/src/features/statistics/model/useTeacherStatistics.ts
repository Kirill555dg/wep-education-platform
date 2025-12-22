/**
 * Hook for fetching teacher statistics
 */
import { useState, useEffect } from "react";
import { statisticsApi } from "@/shared/api";

type ClassroomProgress = {
  total_students: number;
  total_homeworks_assigned: number;
  completed_homeworks: number;
  average_completion_rate: number;
};

export function useTeacherStatistics(classroomId?: number) {
  const [statistics, setStatistics] = useState<ClassroomProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        if (classroomId) {
          const stats = await statisticsApi.getClassroomProgress(classroomId);
          setStatistics([stats]);
        } else {
          // TODO: Get all classrooms stats
          setStatistics([]);
        }
      } catch (err) {
        setError("Не удалось загрузить статистику");
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [classroomId]);

  return {
    statistics,
    loading,
    error,
  };
}

