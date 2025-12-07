/**
 * Problems API client
 */
import { axiosInstance } from "./axios";
import type { ProblemFull, ProblemCreate, ProblemUpdate } from "./types";

const PROBLEMS_PREFIX = "/api/v1/problems";

export const problemsApi = {
  /**
   * Create new problem (teachers only)
   */
  create: async (data: ProblemCreate): Promise<ProblemFull> => {
    const response = await axiosInstance.post<ProblemFull>(PROBLEMS_PREFIX, data);
    return response.data;
  },

  /**
   * Get all problems (teachers only)
   */
  getAll: async (params?: { skip?: number; limit?: number }): Promise<ProblemFull[]> => {
    const response = await axiosInstance.get<ProblemFull[]>(PROBLEMS_PREFIX, {
      params: {
        skip: params?.skip ?? 0,
        limit: params?.limit ?? 100,
      },
    });
    return response.data;
  },

  /**
   * Get problem by ID (teachers only)
   */
  getById: async (problemId: number): Promise<ProblemFull> => {
    const response = await axiosInstance.get<ProblemFull>(
      `${PROBLEMS_PREFIX}/${problemId}`
    );
    return response.data;
  },

  /**
   * Update problem (teachers only)
   */
  update: async (problemId: number, data: ProblemUpdate): Promise<ProblemFull> => {
    const response = await axiosInstance.patch<ProblemFull>(
      `${PROBLEMS_PREFIX}/${problemId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete problem (teachers only)
   */
  delete: async (problemId: number): Promise<void> => {
    await axiosInstance.delete(`${PROBLEMS_PREFIX}/${problemId}`);
  },
};

