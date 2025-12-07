/**
 * API configuration for switching between mock and real API
 */

export const API_CONFIG = {
  /**
   * Use real backend API (true) or mock API (false)
   * Set via environment variable VITE_USE_REAL_API
   */
  USE_REAL_API: import.meta.env.VITE_USE_REAL_API === "true" || import.meta.env.MODE === "production",
  
  /**
   * Backend API base URL
   */
  BACKEND_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
} as const;

/**
 * Check if using real API
 */
export const isRealApi = (): boolean => API_CONFIG.USE_REAL_API;

/**
 * Check if using mock API
 */
export const isMockApi = (): boolean => !API_CONFIG.USE_REAL_API;

