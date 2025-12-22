/**
 * Feature: Manage Problems
 * Hook for creating and managing problems (teacher only)
 */
import { useState } from "react";
import { problemsApi, type ProblemFull, type ProblemCreateDTO, type ProblemUpdateDTO } from "@/shared/api";

export function useManageProblems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProblem = async (data: ProblemCreateDTO): Promise<ProblemFull> => {
    setLoading(true);
    setError(null);

    try {
      const problem = await problemsApi.create(data);
      return problem;
    } catch (err) {
      setError("Ошибка при создании задачи");
      console.error("Error creating problem:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProblem = async (problemId: number, data: ProblemUpdateDTO): Promise<ProblemFull> => {
    setLoading(true);
    setError(null);

    try {
      const problem = await problemsApi.update(problemId, data);
      return problem;
    } catch (err) {
      setError("Ошибка при обновлении задачи");
      console.error("Error updating problem:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProblem = async (problemId: number): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await problemsApi.delete(problemId);
    } catch (err) {
      setError("Ошибка при удалении задачи");
      console.error("Error deleting problem:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProblem,
    updateProblem,
    deleteProblem,
    loading,
    error,
  };
}

