/**
 * Environment configuration (Vite env).
 */

export const env = {
  // Default to IPv4 loopback to avoid `localhost` resolving to IPv6 when backend listens on IPv4 only.
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://127.0.0.1:8023",
  useRealApi: true,
} as const;


