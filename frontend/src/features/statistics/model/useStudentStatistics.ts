/**
 * Hook for fetching student statistics
 */
import { useState, useEffect } from "react";
import { statisticsApi, type StudentStatistics } from "@/shared/api";

export function useStudentStatistics() {
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const stats = await statisticsApi.getStudentStats();
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

