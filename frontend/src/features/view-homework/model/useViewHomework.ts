/**
 * Feature: View Homework
 * Hook for fetching and displaying homework details
 */
import { useState, useEffect } from "react";
import { homeworkApi } from "@/shared/api";
import type { Homework, Problem } from "@/shared/api";

export function useViewHomework(homeworkId: number | null) {
  const [homework, setHomework] = useState<Homework | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!homeworkId) return;

    const fetchHomework = async () => {
      setLoading(true);
      setError(null);

      try {
        const hw = await homeworkApi.getById(homeworkId);
        setHomework(hw);

        const probs = await homeworkApi.getProblems(homeworkId);
        setProblems(probs as Problem[]);
      } catch (err) {
        setError("Ошибка загрузки задания");
        console.error("Error fetching homework:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [homeworkId]);

  return {
    homework,
    problems,
    loading,
    error,
  };
}

