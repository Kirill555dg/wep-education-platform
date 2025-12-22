/**
 * Problems API client
 */
import "./openapi";

import {
  ProblemsService,
  type ProblemCreate,
  type ProblemFullResponse,
  type ProblemUpdate,
} from "@/api/client";

export const problemsApi = {
  /**
   * Create new problem (teachers only)
   */
  create: async (data: ProblemCreate): Promise<ProblemFullResponse> => {
    return await ProblemsService.createProblemApiV1ProblemsPost(data);
  },

  /**
   * Get all problems (teachers only)
   */
  getAll: async (params?: { skip?: number; limit?: number }): Promise<ProblemFullResponse[]> => {
    const page = await ProblemsService.getProblemsApiV1ProblemsGet(
      params?.skip ?? 0,
      params?.limit ?? 100
    );
    return page.items;
  },

  /**
   * Get problem by ID (teachers only)
   */
  getById: async (problemId: number): Promise<ProblemFullResponse> => {
    return await ProblemsService.getProblemApiV1ProblemsProblemIdGet(problemId);
  },

  /**
   * Update problem (teachers only)
   */
  update: async (problemId: number, data: ProblemUpdate): Promise<ProblemFullResponse> => {
    return await ProblemsService.updateProblemApiV1ProblemsProblemIdPatch(problemId, data);
  },

  /**
   * Delete problem (teachers only)
   */
  delete: async (problemId: number): Promise<void> => {
    await ProblemsService.deleteProblemApiV1ProblemsProblemIdDelete(problemId);
  },
};

