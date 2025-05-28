import { atom } from 'nanostores';
import { generate } from 'short-uuid';
import { PageState, PageArgument } from '../types/PageState';

const createInitialState = (): PageState => ({
  name: '',
  time: new Date().toISOString(),
  args: [],
  link_state: {},
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

// Parse URL path into page name and args array
function parseUrlPath(): { pageName: string; args: PageArgument[] } {
  if (typeof window === 'undefined') return { pageName: '', args: [] };
  const path = window.location.pathname;
  const fragments = path.split('/').filter(Boolean);
  
  if (fragments.length === 0) return { pageName: '', args: [] };
  
  // First fragment is the page name
  const pageName = fragments[0];
  
  // Rest are arguments
  const args = fragments.slice(1).map(fragment => {
    const [name, value] = fragment.split(':');
    return [name, value || ''] as PageArgument;
  });
  
  return { pageName, args };
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
  const search = params.toString() ? `?${params.toString()}` : '';
  updateUrl(search);
}

// Update URL path with page name and args
function updateUrlPath(pageName: string, args: PageArgument[]) {
  if (typeof window === 'undefined') return;
  const fragments = args.map(([name, value]) => `${name}:${value}`);
  const pathname = pageName 
    ? `/${pageName}${fragments.length ? '/' + fragments.join('/') : ''}`
    : '/';
  updateUrl(undefined, pathname);
}

// Update URL without replacing unspecified parts
function updateUrl(search?: string, pathname?: string) {
  if (typeof window === 'undefined') return;
  const currentUrl = new URL(window.location.href);
  const newUrl = new URL(window.location.href);
  
  if (pathname !== undefined) newUrl.pathname = pathname;
  if (search !== undefined) newUrl.search = search;
  
  if (currentUrl.toString() !== newUrl.toString()) {
    window.history.replaceState({}, '', newUrl.toString());
  }
}

export const pageStore = atom<PageState>(createInitialState());

export const updatePageState = (updater: (state: PageState) => PageState) => {
  const newState = updater(pageStore.get());
  pageStore.set(newState);
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

export const updateArgs = (newArgs: PageArgument[]) => {
  updatePageState(state => ({
    ...state,
    args: newArgs
  }));
};

export const setPageName = (pageName: string) => {
  updatePageState(state => ({
    ...state,
    name: pageName
  }));
};

export const resetPageState = () => {
  pageStore.set(createInitialState());
};

// Listen to URL changes (for back/forward navigation)
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    const { pageName, args } = parseUrlPath();
    updatePageState(state => ({
      ...state,
      name: pageName,
      args,
      link_state: parseUrlParams()
    }));
  });
} 