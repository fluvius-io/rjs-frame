import { atom } from 'nanostores';
import type { PageState, PageParams, SlotParams, SlotStatus, SlotStatusValues } from '../types/PageState';
import { 
  parseUrlPath, 
  parseSearchParams, 
  updateBrowserUrl, 
  updateBrowserSearchParams 
} from '../utils/urlUtils';

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