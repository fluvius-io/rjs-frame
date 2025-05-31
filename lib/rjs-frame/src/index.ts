// Components
export { PageLayout } from './components/PageLayout';
export { PageLayoutOptions } from './components/PageLayoutOptions';
export { PageModule } from './components/PageModule';
export { PageSlot } from './components/PageSlot';
export { PageParamsManager } from './components/PageParamsManager';

// Store
export { 
  pageStore,
  updatePageState,
  updateGlobalState,
  getGlobalState,
  setGlobalState,
  getXRayEnabled,
  setXRayEnabled,
  updateModuleState,
  updateLinkParams,
  updatePageParams,
  addPageParam,
  removePageParam,
  updatePageParamsPartial,
  setPageName,
  initializeFromUrl
} from './store/pageStore';

// Types
export type { 
  PageState, 
  PageParams, 
  AuthState,
  LinkParams,
  GlobalState,
  ModuleState
} from './types/PageState';

// Utils
export {
  parseUrlPath,
  parseUrlFragments,
  parseSearchParams,
  buildUrlFragments,
  buildUrlPath,
  updateUrlFragments,
  addUrlFragment,
  removeUrlFragment,
  updateBrowserUrl,
  updateBrowserUrlFragments,
  updateBrowserSearchParams,
  isValidFragmentName,
  URL_FRAGMENT_SEPARATOR,
  FRAGMENT_NAME_PATTERN
} from './utils/urlUtils';

// Contexts
export { 
  PageLayoutContext, 
  PageSlotContext 
} from './contexts/LayoutContexts';
export type { 
  PageLayoutContextType, 
  PageSlotContextType 
} from './contexts/LayoutContexts';

// Re-export types for convenience
export type { ParsedUrl, ParsedFragments } from './utils/urlUtils';
export type { PageParamsManagerProps } from './components/PageParamsManager'; 