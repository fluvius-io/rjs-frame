import { atom } from 'nanostores';
import type { PageState, PageParams } from '../types/PageState';
import { 
  parseBrowserLocation, 
  updateBrowserLocation,
  updateBrowserTitle,
} from '../utils/urlUtils';

// LocalStorage keys
const GLOBAL_STATE_KEY = 'rjs-frame:globalState';
const MODULE_STATE_KEY = 'rjs-frame:moduleState';

// Helper functions for localStorage
const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === 'undefined') return defaultValue; // SSR safety
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (typeof window === 'undefined') return; // SSR safety
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// Load persisted state from localStorage
const loadPersistedGlobalState = () => {
  return loadFromLocalStorage(GLOBAL_STATE_KEY, { _id: '', xRay: false });
};

const loadPersistedModuleState = () => {
  return loadFromLocalStorage(MODULE_STATE_KEY, {});
};

// Initialize page store with default values and persisted state
const initialState: PageState = {
  pageName: '',
  initTime: new Date().toISOString(),
  breadcrumbs: [],
  pageParams: {},
  linkParams: {},
  globalState: loadPersistedGlobalState(),
  moduleState: loadPersistedModuleState(),
  auth: {},
  other: {}
};

// Create the page store
export const pageStore = atom<PageState>(initialState);

// Update page state
export const updatePageState = (
  updater: (state: PageState) => PageState
) => {
  const oldState = pageStore.get();
  let newState = updater(oldState);
  
  // Persist globalState and moduleState to localStorage when they change
  if (JSON.stringify(oldState.globalState) !== JSON.stringify(newState.globalState)) {
    saveToLocalStorage(GLOBAL_STATE_KEY, newState.globalState);
  }
  if (JSON.stringify(oldState.moduleState) !== JSON.stringify(newState.moduleState)) {
    saveToLocalStorage(MODULE_STATE_KEY, newState.moduleState);
  }
  
  pageStore.set(newState);
};

// Helper functions for managing globalState
export const updateGlobalState = (newGlobalState: Record<string, any>) => {
  updatePageState(state => ({
    ...state,
    globalState: {
      ...state.globalState,
      ...newGlobalState
    }
  }));
};

export const getGlobalState = <T = any>(key: string, defaultValue?: T): T => {
  const state = pageStore.get();
  return state.globalState[key] ?? defaultValue;
};

export const setGlobalState = <T = any>(key: string, value: T) => {
  updateGlobalState({ [key]: value });
};

// Helper functions for xRay flag specifically
export const getXRayEnabled = (): boolean => {
  return getGlobalState('xRay', false);
};

export const setXRayEnabled = (enabled: boolean) => {
  setGlobalState('xRay', enabled);
};

// Helper functions for managing moduleState
export const updateModuleState = (updates: Record<string, { component: string; [key: string]: any }>) => {
  updatePageState(state => ({
    ...state,
    moduleState: {
      ...state.moduleState,
      ...updates
    }
  }));
};

// Update linkParams
export const updateLinkParams = (newParams: Record<string, string>) => {
  updatePageState(state => ({
    ...state,
    linkParams: {
      ...state.linkParams,
      ...newParams
    }
  }));
  
  // Pass updated state to URL update function
  const updatedState = pageStore.get();
  updateBrowserLocation(updatedState);
};

// Update pageParams while preserving page name
export const updatePageParams = (newParams: PageParams) => {
  const currentState = pageStore.get();
  updatePageState(state => ({
    ...state,
    pageParams: newParams
  }));
  
  // Use the central updateBrowserLocation method
  const updatedState = pageStore.get();
  updateBrowserLocation(updatedState);
};

// Add or update a single page parameter while preserving page name and other params
export const addPageParam = (key: string, value: string) => {
  const currentState = pageStore.get();
  const updatedParams = {
    ...currentState.pageParams,
    [key]: value
  };
  updatePageState(state => ({
    ...state,
    pageParams: updatedParams
  }));
  
  // Pass updated state to URL function
  const updatedState = pageStore.get();
  updateBrowserLocation(updatedState);
};

// Remove a page parameter while preserving page name and other params
export const removePageParam = (key: string) => {
  const currentState = pageStore.get();
  const updatedParams = { ...currentState.pageParams };
  
  delete updatedParams[key];
  
  updatePageState(state => ({
    ...state,
    pageParams: updatedParams
  }));
  
  // Pass updated state to URL function
  const updatedState = pageStore.get();
  updateBrowserLocation(updatedState);
};

// Update multiple page parameters while preserving page name
export const updatePageParamsPartial = (paramsToUpdate: Partial<PageParams>) => {
  const currentState = pageStore.get();
  
  // Filter out undefined values to ensure type safety
  const filteredParams: PageParams = {};
  Object.entries(paramsToUpdate).forEach(([key, value]) => {
    if (value !== undefined) {
      filteredParams[key] = value;
    }
  });

  const updatedParams = {
    ...currentState.pageParams,
    ...filteredParams
  };
  updatePageState(state => ({
    ...state,
    pageParams: updatedParams
  }));
  
  // Pass updated state to URL function
  const updatedState = pageStore.get();
  updateBrowserLocation(updatedState);
};

// Set page name only (logical page identifier, doesn't update URL)
export const setPageName = (pageName: string) => {
  updatePageState(state => ({
    ...state,
    pageName: pageName // Set the logical page name
  }));
  updateBrowserTitle(pageStore.get());
};

// Breadcrumb management functions
export const setBreadcrumbs = (breadcrumbs: string[]) => {
  updatePageState(state => ({
    ...state,
    breadcrumbs: [...breadcrumbs.filter(Boolean)],
  }));
  updateBrowserTitle(pageStore.get());
};

export const pushBreadcrumb = (breadcrumb: string) => {
  const currentState = pageStore.get();
  const newBreadcrumbs = [...currentState.breadcrumbs, breadcrumb];
  setBreadcrumbs(newBreadcrumbs);
};

export const popBreadcrumb = () => {
  const currentState = pageStore.get();
  if (currentState.breadcrumbs.length > 0) {
    const newBreadcrumbs = currentState.breadcrumbs.slice(0, -1);
    setBreadcrumbs(newBreadcrumbs);
  }
};

export const getBreadcrumbs = (): string[] => {
  const state = pageStore.get();
  return state.breadcrumbs;
};

// Initialize page state from current URL (useful on app start)
export const initializeFromBrowserLocation = (windowLocation: Location) => {
  const { pagePath, pageParams, linkParams } = parseBrowserLocation(windowLocation);
  
  const breadcrumbs = pagePath.split('/').filter(Boolean);
  const pageName = breadcrumbs.pop() || '';
  
  const newState: PageState = {
    ...initialState,
    pageName,
    breadcrumbs,
    pageParams,
    linkParams,
    initTime: new Date().toISOString()
  };
  
  updatePageState(() => newState);
  updateBrowserTitle(newState);
  return newState;
}; 