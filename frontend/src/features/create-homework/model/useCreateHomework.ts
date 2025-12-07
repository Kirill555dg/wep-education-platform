/**
 * Hook for creating homework (teacher feature)
 */
import { useState } from "react";
import { homeworkApi, problemsApi, type HomeworkCreateDTO, type ProblemCreateDTO } from "@/shared/api";

export function useCreateHomework() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProblem = async (data: ProblemCreateDTO) => {
    try {
      const problem = await problemsApi.create(data);
      return problem;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to create problem";
      throw new Error(errorMessage);
    }
  };

  const createHomework = async (data: HomeworkCreateDTO) => {
    setLoading(true);
    setError(null);

    try {
      const homework = await homeworkApi.create(data);
      return homework;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to create homework";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { createHomework, createProblem, loading, error, clearError };
}

