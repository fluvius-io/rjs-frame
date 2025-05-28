import { atom } from 'nanostores';
import { generate } from 'short-uuid';
import { PageState } from '../types/PageState';

const createInitialState = (): PageState => ({
  name: '',
  time: new Date().toISOString(),
  args: [],
  link_state: parseUrlParams(),
  vars_state: {
    _id: generate()
  },
  priv_state: {},
  auth: {},
  other: {}
});

// Parse URL parameters into link_state
function parseUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

// Update URL with link_state
function updateUrlParams(linkState: Record<string, any>) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  Object.entries(linkState).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
}

export const pageStore = atom<PageState>(createInitialState());

export const updatePageState = (updater: (state: PageState) => PageState) => {
  const newState = updater(pageStore.get());
  pageStore.set(newState);
  updateUrlParams(newState.link_state);
};

export const updateLinkState = (updates: Record<string, any>) => {
  updatePageState(state => ({
    ...state,
    link_state: {
      ...state.link_state,
      ...updates
    }
  }));
};

export const resetPageState = () => {
  pageStore.set(createInitialState());
  updateUrlParams({});
};

// Listen to URL changes (for back/forward navigation)
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    updatePageState(state => ({
      ...state,
      link_state: parseUrlParams()
    }));
  });
} 