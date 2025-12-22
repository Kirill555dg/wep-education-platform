/**
 * Hook for fetching student statistics
 */
import { useState, useEffect } from "react";
import { statisticsApi } from "@/shared/api";

type StudentProgress = {
  total_homeworks: number;
  completed: number;
  in_progress: number;
  not_started: number;
  average_score_percentage: number;
  total_attempts: number;
  total_time_spent_minutes: number;
};

export function useStudentStatistics() {
  const [statistics, setStatistics] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const stats = await statisticsApi.getMyProgress();
        setStatistics(stats);
      } catch (err) {
        setError("Не удалось загрузить статистику");
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
  };
}

