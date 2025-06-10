import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RjsApp, Route } from "rjs-frame";
import "rjs-frame/dist/style.css";
import "./index.css";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RjsApp authRequired={true}>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home/*" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </RjsApp>
  </React.StrictMode>
);
