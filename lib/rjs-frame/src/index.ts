/**
 * RJS Frame - Comprehensive React/TypeScript Framework
 * Main entry point for all framework components and utilities
 */

// Import styles
import "./styles/index.css";

// Components
export { ErrorScreen } from "./components/ErrorScreen";
export { PageLayout } from "./components/PageLayout";
export { PageLayoutOptions } from "./components/PageLayoutOptions";
export { PageModule, RoutingModule } from "./components/PageModule";
export { PageParamsManager } from "./components/PageParamsManager";
export { PageSection } from "./components/PageSection";
export { PageSlot } from "./components/PageSlot";
export {
  Navigate,
  RjsApp,
  Route,
  Router,
  Routes,
  useAppContext,
  useLocation,
  useNavigate,
} from "./components/RjsApp";

export type { PageModuleProps } from "./components/PageModule";

// Export types separately
export type { AppConfig } from "./components/RjsApp";

// Store
export {
  getAppSettingsValue as getAppSettings,
  getAppState,
  initAppState as initializeFromBrowserLocation,
  matchPageParams,
  popBreadcrumb,
  pushBreadcrumb,
  setAuthContext,
  setPageName,
  subscribeToAppState,
  updateAppSettings,
  updateHashParams,
  updateLinkParams,
  updateModuleState,
  updatePageParams,
} from "./store/appStateStore";

// Configuration Management
export { ConfigManager } from "./config/ConfigManager";
export type { ConfigManagerOptions } from "./config/ConfigManager";

// API Management
export {
  APICollection,
  ApiError,
  APIManager,
  ConfigurationError,
  MockAPI,
  RTCConnectionFactory,
  SSEConnection,
  WebSocketConnection,
} from "./api";

export type {
  ApiCollectionConfig,
  ApiParams,
  ApiPayload,
  ApiResponse,
  CommandConfig,
  DataProcessor,
  HeaderProcessor,
  HttpMethod,
  QueryConfig,
  RequestConfig,
  ResponseProcessor,
  RTCConnection,
  RTCTransport,
  SocketConfig,
  SubscriptionHandler,
  UnsubscribeFunction,
  UriPattern,
} from "./api";

// Types
export type {
  AppSettings,
  AppState,
  LinkParams,
  ModuleState,
  PageParams,
} from "./types/AppState";

export type {
  AuthContext,
  AuthOrganization,
  AuthProfile,
  AuthUser,
  RealmAccess,
  ResourceAccess,
  ResourceRoles,
} from "./types/AuthContext";

// Utils
export {
  isValidFragmentName,
  parseBrowserLocation,
  updateBrowserLocation,
  updateBrowserTitle,
} from "./utils/urlUtils";

// Contexts
export {
  PageLayoutContext,
  PageSlotContext,
  usePageContext,
} from "./contexts/LayoutContexts";

export type {
  PageLayoutContextType,
  PageSlotContextType,
} from "./contexts/LayoutContexts";

// Re-export types for convenience
export type { ErrorScreenProps } from "./components/ErrorScreen";
export type { PageLayoutProps } from "./components/PageLayout";
export type { PageParamsManagerProps } from "./components/PageParamsManager";
export type { ParsedUrl } from "./utils/urlUtils";
