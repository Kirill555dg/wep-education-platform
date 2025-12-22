/**
 * Environment configuration (Vite env).
 */

export const env = {
  // Default to IPv4 loopback to avoid `localhost` resolving to IPv6 when backend listens on IPv4 only.
  // - Dev default: explicit backend URL on IPv4 loopback (works without nginx proxy)
  // - Prod default: same-origin (nginx proxies `/api` to backend)
  apiBaseUrl: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://127.0.0.1:8023"),
  useRealApi: true,
} as const;


