import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    env: {
      // IMPORTANT: do not read generic BACKEND_URL here – it may be set in developer shell
      // and point to a stale port (e.g. 8000), breaking e2e unexpectedly.
      BACKEND_URL: process.env.CYPRESS_BACKEND_URL || "http://127.0.0.1:8023",
    },
  },
});
