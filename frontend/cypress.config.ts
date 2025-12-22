import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Keep URL as `localhost` (CORS allowlist), but resolve it to IPv6 (::1) so it works
    // when Vite binds only on IPv6.
    hosts: {
      localhost: "::1",
    },
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    env: {
      BACKEND_URL: process.env.BACKEND_URL || "http://127.0.0.1:8023",
    },
  },
});
