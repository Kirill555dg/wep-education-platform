import "@/shared/api/openapi";

import {
  ProblemsService,
  type Page_ProblemFullResponse_,
  type ProblemCreate,
  type ProblemFullResponse,
  type ProblemUpdate,
} from "@/shared/api/generated";
import { clampLimit, clampSkip } from "@/shared/api/pagination";

export const problemsApi = {
  async list(params: { skip?: number; limit?: number } = {}): Promise<Page_ProblemFullResponse_> {
    return await ProblemsService.getProblemsApiV1ProblemsGet(clampSkip(params.skip), clampLimit(params.limit));
  },

  async get(problemId: number): Promise<ProblemFullResponse> {
    return await ProblemsService.getProblemApiV1ProblemsProblemIdGet(problemId);
  },

  async create(payload: ProblemCreate): Promise<ProblemFullResponse> {
    return await ProblemsService.createProblemApiV1ProblemsPost(payload);
  },

  async update(problemId: number, payload: ProblemUpdate): Promise<ProblemFullResponse> {
    return await ProblemsService.updateProblemApiV1ProblemsProblemIdPatch(problemId, payload);
  },

  async remove(problemId: number): Promise<void> {
    return await ProblemsService.deleteProblemApiV1ProblemsProblemIdDelete(problemId);
  },
} as const;


