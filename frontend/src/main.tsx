import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/index";
import "./shared/styles/globals.css";

import { setAuthApi } from "@/features/auth/api/api";
import { authApiMock } from "@/features/auth/api/api-mock";
import { authApiReal } from "@/features/auth/api/api-real";
import { setProfileApi } from "@/features/profile/api/profile-api";
import { profileApiMock } from "@/features/profile/api/profile-api-mock";
import { profileApiReal } from "@/features/profile/api/profile-api-real";
import { API_CONFIG } from "@/shared/config/api.config";

// Configure API based on environment
if (API_CONFIG.USE_REAL_API) {
  console.log("🌐 Using REAL API at:", API_CONFIG.BACKEND_URL);
  setAuthApi(authApiReal);
  setProfileApi(profileApiReal);
} else {
  console.log("🎭 Using MOCK API (development mode)");
  setAuthApi(authApiMock);
  setProfileApi(profileApiMock);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
