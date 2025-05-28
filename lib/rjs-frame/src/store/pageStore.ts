import { atom } from 'nanostores';
import type { PageState, PageParams, SlotParams, SlotStatus, SlotStatusValues } from '../types/PageState';

// Initialize page store with default values
const initialState: PageState = {
  name: '',
  time: new Date().toISOString(),
  pageParams: {},
  linkParams: {},
  slotParams: {},
  slotStatus: {},
  pageState: { _id: '' },
  privState: {},
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

// Parse URL parameters into linkParams
function parseUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

// Parse URL path into page name and slotParams
function parseUrlPath(): { pageName: string; slotParams: SlotParams; slotStatus: SlotStatus } {
  if (typeof window === 'undefined') return { pageName: '', slotParams: {}, slotStatus: {} };

  const path = window.location.pathname;
  const fragments = path.split('/').filter(Boolean);

  if (fragments.length === 0) return { pageName: '', slotParams: {}, slotStatus: {} as SlotStatus  };

  const pageName = fragments[0];

  // Parse remaining fragments into slotParams
  const slotParams: SlotParams = {};
  const slotStatus: SlotStatus = {};
  fragments.slice(1).forEach(fragment => {
    const [name = '', value = ''] = fragment.split(':');
    if (name) slotParams[name] = value;
    if (name) slotStatus[name] = (value == '-') ? 'hidden' : 'active';
  });

  return { pageName, slotParams, slotStatus };
}

// Update URL with linkParams
function updateUrlParams(params: Record<string, string>) {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  const newSearch = searchParams.toString();
  const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
  window.history.replaceState(null, '', newUrl);
}

// Update URL path with page name and slotParams
function updateUrlPath(pageName: string, params: SlotParams) {
  if (typeof window === 'undefined') return;
  const fragments = Object.entries(params).map(([key, value]) => `${key}:${value}`);
  const newPath = `/${pageName}${fragments.length ? '/' + fragments.join('/') : ''}`;
  window.history.replaceState(null, '', newPath + window.location.search);
}

// Create the page store
export const pageStore = atom<PageState>(initialState);

// Update page state
export const updatePageState = (
  updater: (state: PageState) => PageState
) => {
  const oldState = pageStore.get();
  let newState = updater(oldState);
  pageStore.set(newState);
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
  updateUrlParams(newParams);
};

// Update slotParams
export const updateSlotParams = (newParams: SlotParams) => {
  updatePageState(state => ({
    ...state,
    slotParams: newParams
  }));
  updateUrlPath(pageStore.get().name, newParams);
};

// Set page name while preserving existing parameters
export const setPageName = (pageName: string) => {
  const currentState = pageStore.get();
  updatePageState(state => ({
    ...state,
    name: pageName,
    slotParams: currentState.slotParams // Preserve existing slot parameters
  }));
  updateUrlPath(pageName, currentState.slotParams);
};

// Initialize page state from URL
export const initializeFromUrl = () => {
  const { pageName, slotParams, slotStatus } = parseUrlPath();
  updatePageState(state => ({
    ...state,
    name: pageName,
    slotParams,
    slotStatus,
    linkParams: parseUrlParams(),
    pageParams: {}  
  }));
}; 