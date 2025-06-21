import { atom } from "nanostores";
import { AuthContext } from "../types/AuthContext";
import type {
  GlobalState,
  HashParams,
  LinkParams,
  ModuleState,
  PageParams,
  AppState,
} from "../types/AppState";
import { ParamSpec, matchParams } from "../utils/matchParams";
import { parseBrowserLocation, updateBrowserLocation } from "../utils/urlUtils";

// LocalStorage keys
const GLOBAL_STATE_KEY = "rjs-frame:globalState";
const MODULE_STATE_KEY = "rjs-frame:moduleState";

// Helper functions for localStorage
const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window === "undefined") return defaultValue; // SSR safety
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (typeof window === "undefined") return; // SSR safety
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// Initialize page store with default values and persisted state
const initialState: AppState = {
  pageName: "",
  initTime: new Date().toISOString(),
  breadcrumbs: [],
  pagePath: "",
  pageParams: {},
  linkParams: {},
  hashParams: {},
  globalState: loadFromLocalStorage(GLOBAL_STATE_KEY, {
    _id: crypto.randomUUID(),
    xRay: false,
  }),
  moduleState: loadFromLocalStorage(MODULE_STATE_KEY, {}),
  auth: null,
};

// Create the page store
const appStateStore = atom<AppState>(initialState);

// Update page state
const updateAppState = (updates: Partial<AppState>) => {
  const currentState = appStateStore.get();
  const updatedState = { ...currentState, ...updates };

  appStateStore.set(updatedState);

  // Persist globalState and moduleState to localStorage when they change
  if ("globalState" in updates) {
    saveToLocalStorage(GLOBAL_STATE_KEY, updates.globalState);
  }

  if ("moduleState" in updates) {
    saveToLocalStorage(MODULE_STATE_KEY, updates.moduleState);
  }

  if (
    "pageParams" in updates ||
    "hashParams" in updates ||
    "linkParams" in updates
  ) {
    updateBrowserLocation(updatedState);
  }

  return updatedState;
};

// Helper functions for managing globalState
export const updateGlobalState = (stateUpdates: Partial<GlobalState>) => {
  const currentState = appStateStore.get().globalState;
  updateAppState({
    globalState: {
      ...currentState,
      ...stateUpdates,
      _id: crypto.randomUUID(),
    },
  });
};

export const getGlobalStateValue = <T = any>(
  key: string,
  defaultValue?: T
): T => {
  const state = appStateStore.get();
  return state.globalState[key] ?? defaultValue;
};

// Helper functions for managing moduleState
export const updateModuleState = (
  moduleName: string,
  stateUpdates: Partial<ModuleState>
): ModuleState => {
  const currentState = appStateStore.get().moduleState[moduleName];
  const updatedState = {
    [moduleName]: {
      ...currentState,
      ...stateUpdates,
    },
  };
  updateAppState({ moduleState: updatedState });
  return updatedState;
};

// Add or update a single page parameter while preserving page name and other params
export const updatePageParams = (updateParams: Partial<PageParams>) => {
  const currentState = appStateStore.get().pageParams;
  const updatedParams = { ...currentState, ...updateParams } as PageParams;
  updateAppState({ pageParams: updatedParams });
  return updatedParams;
};

export const updateLinkParams = (updateParams: Partial<LinkParams>) => {
  const currentState = appStateStore.get().linkParams;
  const updatedParams = { ...currentState, ...updateParams } as LinkParams;
  updateAppState({ linkParams: updatedParams });
  return updatedParams;
};

export const updateHashParams = (updateParams: Partial<HashParams>) => {
  const currentState = appStateStore.get().hashParams;
  const updatedParams = { ...currentState, ...updateParams } as HashParams;
  updateAppState({ hashParams: updatedParams });
  return updatedParams;
};

export const setAuthContext = (authContext: AuthContext) => {
  updateAppState({ auth: authContext });
  return authContext;
};

export const pushBreadcrumb = (breadcrumb: string) => {
  const currentBreadcrumbs = appStateStore.get().breadcrumbs;
  updateAppState({ breadcrumbs: [...currentBreadcrumbs, breadcrumb] });
  return currentBreadcrumbs;
};

export const popBreadcrumb = () => {
  const currentBreadcrumbs = appStateStore.get().breadcrumbs;
  if (currentBreadcrumbs.length > 0) {
    const newBreadcrumbs = currentBreadcrumbs.slice(0, -1);
    updateAppState({ breadcrumbs: newBreadcrumbs });
    return newBreadcrumbs;
  }
  return currentBreadcrumbs;
};

export const getAppState = (): AppState => {
  return appStateStore.get();
};

export const setPageName = (pageName: string) => {
  updateAppState({ pageName });
};

export const matchPageParams = (
  paramSpec: ParamSpec | null | undefined,
  componentName: string,
  mandatory: boolean = false
) => {
  if (!paramSpec) {
    return mandatory ? false : true;
  }

  return matchParams(paramSpec, getAppState().pageParams, componentName);
};

export const subscribeToAppState = (callback: (state: AppState) => void) => {
  return appStateStore.subscribe(callback);
};

// Initialize page state from current URL (useful on app start)
export const initAppState = (windowLocation: Location): AppState => {
  const params = parseBrowserLocation(windowLocation);

  const breadcrumbs = params.pagePath.split("/").filter(Boolean);
  const pageName = breadcrumbs.pop() || "";

  const newState: AppState = {
    ...initialState,
    ...params,
    pageName,
    breadcrumbs,
    initTime: new Date().toISOString(),
  };

  return updateAppState(newState);
};
