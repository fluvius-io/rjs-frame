import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RjsApp, Route } from "rjs-frame";
import "./config/api"; // Initialize API manager
import appConfig from "./config/defaults.json";
import BotManager from "./pages/BotManager";
import DashboardPage from "./pages/DashboardPage";
import DataPage from "./pages/DataPage";
import ExchangePage from "./pages/ExchangePage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignalsPage from "./pages/SignalsPage";
import UserManagementPage from "./pages/UserManagementPage";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RjsApp authRequired={true} appConfig={appConfig}>
      <Route path="/" element={<Navigate to="/users" replace />} />
      <Route path="/home/*" element={<HomePage />} />
      <Route path="/bots/*" element={<BotManager />} />
      <Route path="/signals/*" element={<SignalsPage />} />
      <Route path="/portfolio/*" element={<DashboardPage />} />
      <Route path="/exchange/*" element={<ExchangePage />} />
      <Route path="/data/*" element={<DataPage />} />
      <Route path="/users/*" element={<UserManagementPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </RjsApp>
  </React.StrictMode>
);
