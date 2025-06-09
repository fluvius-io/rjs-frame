/**
 * RJS Frame - Comprehensive React/TypeScript Framework
 * Main entry point for all framework components and utilities
 */

// Import styles
import "./styles/index.css";

// Components
export { ErrorScreen } from "./components/ErrorScreen";
export { LoadingScreen } from "./components/LoadingScreen";
export { PageLayout } from "./components/PageLayout";
export { PageLayoutOptions } from "./components/PageLayoutOptions";
export { PageModule, RoutingModule } from "./components/PageModule";
export { PageParamsManager } from "./components/PageParamsManager";
export { PageSlot } from "./components/PageSlot";
export {
  Navigate,
  RjsApp,
  Route,
  Router,
  Routes,
  useAppConfig,
  useLocation,
  useNavigate,
} from "./components/RjsApp";

// Store
export {
  addPageParam,
  getBreadcrumbs,
  getGlobalState,
  getXRayEnabled,
  initializeFromBrowserLocation,
  pageStore,
  popBreadcrumb,
  pushBreadcrumb,
  removePageParam,
  setBreadcrumbs,
  setGlobalState,
  setPageName,
  setXRayEnabled,
  updateGlobalState,
  updateLinkParams,
  updateModuleState,
  updatePageParams,
  updatePageParamsPartial,
  updatePageState,
} from "./store/pageStore";

// Configuration Management
export { ConfigManager } from "./config/ConfigManager";
export type { ConfigManagerOptions } from "./config/ConfigManager";

// API Management
export {
  APICollection,
  ApiError,
  APIManager,
  ConfigurationError,
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
  UriGenerator,
} from "./api";

// Types
export type {
  AuthState,
  GlobalState,
  LinkParams,
  ModuleState,
  PageParams,
  PageState,
  TypedPageState,
} from "./types/PageState";

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
  buildPathFromPageState,
  buildUrlFragments,
  FRAGMENT_NAME_PATTERN,
  isValidFragmentName,
  parseBrowserLocation,
  parseSearchParams,
  parseUrl,
  parseUrlFragments,
  updateBrowserLocation,
  updateBrowserTitle,
  URL_FRAGMENT_SEPARATOR,
} from "./utils/urlUtils";

// Contexts
export {
  PageLayoutContext,
  PageSlotContext,
  usePageLayout,
} from "./contexts/LayoutContexts";
export type {
  PageLayoutContextType,
  PageSlotContextType,
} from "./contexts/LayoutContexts";

// Re-export types for convenience
export type { ErrorScreenProps } from "./components/ErrorScreen";
export type { LoadingScreenProps } from "./components/LoadingScreen";
export type { PageParamsManagerProps } from "./components/PageParamsManager";
export type { ParsedUrl } from "./utils/urlUtils";
