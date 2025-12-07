/**
 * Centralized export of all API clients and types
 */

// Export API clients
export { authApi } from "./auth.api";
export { classroomsApi } from "./classrooms.api";
export { lessonsApi } from "./lessons.api";
export { homeworkApi } from "./homework.api";
export { problemsApi } from "./problems.api";
export { statisticsApi } from "./statistics.api";

// Export axios instance for custom requests
export { axiosInstance } from "./axios";

// Re-export all types
export * from "./types";

