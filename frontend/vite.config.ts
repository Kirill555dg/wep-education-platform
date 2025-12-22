/// <reference types="vitest" />

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    // Bind to IPv6 "any" to support both IPv6 (::1) and IPv4 (127.0.0.1) clients reliably.
    // This avoids flaky Cypress/Electron runs on macOS where `localhost` resolution and Vite bind address may differ.
    host: "::",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "::",
    port: 5173,
    strictPort: true,
  },
})
