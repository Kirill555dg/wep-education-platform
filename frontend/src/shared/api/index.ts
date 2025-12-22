export { ApiError, CancelError, OpenAPI } from "@/shared/api/generated";
export type { OpenAPIConfig } from "@/shared/api/generated";

export { authApi } from "./auth";
export { classroomsApi } from "./classrooms";
export { lessonsApi } from "./lessons";
export { homeworkApi } from "./homework";
export { problemsApi } from "./problems";
export { statisticsApi } from "./statistics";

export * from "./errors";
