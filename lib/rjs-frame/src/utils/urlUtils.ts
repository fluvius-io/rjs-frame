import type { SlotParams, SlotStatus } from '../types/PageState';

export interface ParsedUrl {
  pageName: string;
  slotParams: SlotParams;
  slotStatus: SlotStatus;
  linkParams: Record<string, string>;
}

export interface ParsedFragments {
  params: SlotParams;
  statuses: SlotStatus;
}

/**
 * Parse URL fragments into slotParams and slotStatus
 * Supports both ':' and '!' delimiters
 * Format: arg1:value1/arg2!value2/arg3:-
 * - ':' or '!' separate name from value
 * - '-' value means hidden status, otherwise active
 */
export function parseUrlFragments(fragments: string): ParsedFragments {
  if (!fragments) return { params: {}, statuses: {} };
  
  const params: SlotParams = {};
  const statuses: SlotStatus = {};
  
  fragments.split('/').filter(Boolean).forEach(fragment => {
    const [name, value] = fragment.split(':');
    if (name) {
      params[name] = value || '';
      statuses[name] = 'active';
    }
  });
  
  return { params, statuses };
}

/**
 * Parse search params into linkParams object
 */
export function parseSearchParams(search: string): Record<string, string> {
  const params: Record<string, string> = {};
  new URLSearchParams(search).forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Parse full URL path into page name and slot parameters
 * Works with both window.location and provided path string
 */
export function parseUrlPath(path?: string): ParsedUrl {
  if (typeof window === 'undefined' && !path) {
    return { pageName: '', slotParams: {}, slotStatus: {}, linkParams: {} };
  }

  const urlPath = path || window.location.pathname;
  const search = path ? '' : (window.location.search || '');
  
  const fragments = urlPath.split('/').filter(Boolean);
  
  if (fragments.length === 0) {
    return { 
      pageName: '', 
      slotParams: {}, 
      slotStatus: {}, 
      linkParams: parseSearchParams(search)
    };
  }

  const pageName = fragments[0];
  const fragmentString = fragments.slice(1).join('/');
  const { params: slotParams, statuses: slotStatus } = parseUrlFragments(fragmentString);

  return {
    pageName,
    slotParams,
    slotStatus,
    linkParams: parseSearchParams(search)
  };
}

/**
 * Build URL fragments from slotParams and slotStatus
 * Uses ':' delimiter and '-' for hidden status
 */
export function buildUrlFragments(params: SlotParams, statuses?: SlotStatus): string {
  return Object.entries(params)
    .map(([key, value]) => {
      return value && value !== '' ? `${key}:${value}` : key;
    })
    .join('/');
}

/**
 * Build full URL path from page name and slot parameters
 */
export function buildUrlPath(pageName: string, params: SlotParams, statuses?: SlotStatus): string {
  const fragments = buildUrlFragments(params, statuses);
  return `/${pageName}${fragments ? '/' + fragments : ''}`;
}

/**
 * Update browser URL with new path (client-side only)
 */
export function updateBrowserUrl(pageName: string, params: SlotParams, statuses?: SlotStatus, search?: string): void {
  if (typeof window === 'undefined') return;
  
  const newPath = buildUrlPath(pageName, params, statuses);
  const currentSearch = search || window.location.search;
  const newUrl = newPath + currentSearch;
  
  window.history.replaceState(null, '', newUrl);
}

/**
 * Update browser search params (client-side only)
 */
export function updateBrowserSearchParams(params: Record<string, string>): void {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const newSearch = searchParams.toString();
  const newUrl = `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`;
  window.history.replaceState(null, '', newUrl);
} 