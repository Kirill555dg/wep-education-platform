import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/index";
import "./shared/styles/globals.css";
import { logger } from "@/shared/lib/logger";
import { env } from "@/shared/config/env";
import { loggingConfig } from "@/shared/config/logging";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { QueryProvider } from "@/app/providers/QueryProvider";

logger.info("frontend_start", { apiBaseUrl: env.apiBaseUrl, logLevel: loggingConfig.level });

window.addEventListener("error", (event) => {
  logger.error("window_error", {
    message: event.error?.message || event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
  logger.error("unhandled_rejection", { reason });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
