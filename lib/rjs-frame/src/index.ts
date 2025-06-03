// Components
export { PageLayout } from './components/PageLayout';
export { PageLayoutOptions } from './components/PageLayoutOptions';
export { PageModule, RoutingModule } from './components/PageModule';
export { PageParamsManager } from './components/PageParamsManager';
export { PageSlot } from './components/PageSlot';
export { Navigate, RjsApp, Route, Router, Routes, useLocation, useNavigate } from './components/RjsApp';

// Store
export {
    addPageParam, getBreadcrumbs, getGlobalState, getXRayEnabled, initializeFromBrowserLocation, pageStore, popBreadcrumb, pushBreadcrumb, removePageParam, setBreadcrumbs, setGlobalState, setPageName, setXRayEnabled, updateGlobalState, updateLinkParams, updateModuleState, updatePageParams, updatePageParamsPartial, updatePageState
} from './store/pageStore';

// API Manager
export {
    APIManager,
    ApiError, ApiManagerExamples, ConfigurationError,
    RTCConnectionFactory, SSEConnection, ValidationError, WebSocketConnection
} from './api';

export type {
    ApiData, ApiManagerConfig, ApiParams, ApiResponse, CommandConfig, DataProcessor, DataSchema, DataValidator, HeaderConfig, HeaderGenerator, HttpMethod, QueryConfig, RTCConnection, RTCTransport, RequestConfig, ResponseProcessor, SocketConfig, SubscriptionHandler,
    UnsubscribeFunction, UriGenerator
} from './api';

// Types
export type {
    AuthState, GlobalState, LinkParams, ModuleState, PageParams, PageState
} from './types/PageState';

// Utils
export {
    FRAGMENT_NAME_PATTERN, URL_FRAGMENT_SEPARATOR, buildPathFromPageState, buildUrlFragments, isValidFragmentName, parseBrowserLocation, parseSearchParams, parseUrl, parseUrlFragments, updateBrowserLocation,
    updateBrowserTitle
} from './utils/urlUtils';

// Contexts
export {
    PageLayoutContext,
    PageSlotContext,
    usePageLayout
} from './contexts/LayoutContexts';
export type {
    PageLayoutContextType,
    PageSlotContextType
} from './contexts/LayoutContexts';

// Re-export types for convenience
export type { PageParamsManagerProps } from './components/PageParamsManager';
export type { ParsedUrl } from './utils/urlUtils';

