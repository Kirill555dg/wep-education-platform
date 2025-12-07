/**
 * Hook for submitting homework answers (student feature)
 */
import { useState } from "react";
import { homeworkApi, type AnswerSubmitDTO, type Statistics } from "@/shared/api";

export function useSubmitHomework() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswer = async (data: AnswerSubmitDTO): Promise<Statistics> => {
    setLoading(true);
    setError(null);

    try {
      const stats = await homeworkApi.submitAnswer(data);
      return stats;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to submit answer";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitHomework = async (homeworkId: number): Promise<Statistics> => {
    setLoading(true);
    setError(null);

    try {
      const stats = await homeworkApi.submitHomework(homeworkId);
      return stats;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to submit homework";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { submitAnswer, submitHomework, loading, error, clearError };
}

