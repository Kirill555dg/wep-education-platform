/**
 * Hook for fetching teacher statistics
 */
import { useState, useEffect } from "react";
import { statisticsApi, type ClassroomStatistics } from "@/shared/api";

export function useTeacherStatistics(classroomId?: number) {
  const [statistics, setStatistics] = useState<ClassroomStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        if (classroomId) {
          const stats = await statisticsApi.getClassroomStats(classroomId);
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

