import { atom } from 'nanostores';
import type { PageState, PageParams, SlotParams, SlotStatus, SlotStatusValues } from '../types/PageState';
import { 
  parseUrlPath, 
  parseSearchParams, 
  updateBrowserUrl, 
  updateBrowserSearchParams 
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
  name: '',
  time: new Date().toISOString(),
  pageParams: {},
  linkParams: {},
  slotParams: {},
  slotStatus: {},
  globalState: loadPersistedGlobalState(),
  moduleState: loadPersistedModuleState(),
  auth: {},
  other: {}
};

// Helper function to validate slot status
export const setSlotStatus = (slotName: string, status: SlotStatusValues) => {
  updatePageState(state => ({
    ...state,
    slotStatus: {
      ...state.slotStatus,
      [slotName]: status
    }
  }));
};

// Helper function to get slot status
export const getSlotStatus = (slotName: string): SlotStatusValues => {
  const state = pageStore.get();
  return state.slotStatus[slotName] || 'active';
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
  updateBrowserSearchParams(newParams);
};

// Update slotParams
export const updateSlotParams = (newParams: SlotParams) => {
  const currentState = pageStore.get();
  updatePageState(state => ({
    ...state,
    slotParams: newParams
  }));
  updateBrowserUrl(currentState.name, newParams, currentState.slotStatus);
};

// Set page name while preserving existing parameters
export const setPageName = (pageName: string) => {
  const currentState = pageStore.get();
  updatePageState(state => ({
    ...state,
    name: pageName,
    slotParams: currentState.slotParams // Preserve existing slot parameters
  }));
  updateBrowserUrl(pageName, currentState.slotParams, currentState.slotStatus);
};

// Initialize page state from URL
export const initializeFromUrl = () => {
  const { pageName, slotParams, slotStatus, linkParams } = parseUrlPath();
  updatePageState(state => ({
    ...state,
    name: pageName,
    slotParams,
    slotStatus,
    linkParams,
    pageParams: {}  
  }));
}; 