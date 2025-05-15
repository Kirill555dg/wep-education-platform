import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/index";
import "./shared/styles/globals.css";

import { setAuthApi } from "@/features/auth/api/api";
import { authApiMock } from "@/features/auth/api/mock-api";

setAuthApi(authApiMock);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
