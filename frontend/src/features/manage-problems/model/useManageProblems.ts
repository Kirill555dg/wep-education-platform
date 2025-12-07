/**
 * Feature: Manage Problems
 * Hook for creating and managing problems (teacher only)
 */
import { useState } from "react";
import { problemsApi } from "@/shared/api";
import type { Problem } from "@/shared/api";

interface CreateProblemData {
  title: string;
  description: string;
  problem_type: string;
  difficulty?: number;
  correct_answer: string;
  explanation?: string;
  hints?: string;
}

export function useManageProblems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProblem = async (data: CreateProblemData): Promise<Problem> => {
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

  return {
    createProblem,
    loading,
    error,
  };
}

