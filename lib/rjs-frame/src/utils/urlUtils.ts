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

// Special separator between page name and URL fragments
export const URL_FRAGMENT_SEPARATOR = '/-/';

// Regex pattern for valid fragment argument names (letters, digits, underscore only)
export const FRAGMENT_NAME_PATTERN = /^[\w\d_]+$/;

/**
 * Validate fragment argument name against allowed pattern
 * @param name - The fragment name to validate
 * @returns true if valid, false otherwise
 */
export function isValidFragmentName(name: string): boolean {
  return FRAGMENT_NAME_PATTERN.test(name);
}

/**
 * Parse URL fragments into slotParams and slotStatus
 * Supports both ':' and '!' delimiters
 * Format: arg1:value1/arg2!value2/arg3:-/flag
 * - ':' or '!' separate name from value
 * - '-' value means hidden status, otherwise active
 * - fragments without ':' are treated as boolean true (e.g., "debug" -> { debug: true })
 * - fragment names must match pattern: [\w\d_]+ (letters, digits, underscore only)
 */
export function parseUrlFragments(fragments: string): ParsedFragments {
  if (!fragments) return { params: {}, statuses: {} };
  
  const params: SlotParams = {};
  const statuses: SlotStatus = {};
  
  fragments.split('/').filter(Boolean).forEach(fragment => {
    const colonIndex = fragment.indexOf(':');
    
    if (colonIndex === -1) {
      // No colon found - treat as boolean flag
      if (!isValidFragmentName(fragment)) {
        console.warn(`[RJS-Frame] Invalid fragment name "${fragment}". Fragment names must match pattern: [\w\d_]+ (letters, digits, underscore only)`);
        return; // Skip invalid fragment names
      }
      params[fragment] = true;
      statuses[fragment] = 'active';
    } else {
      // Colon found - split into name and value
      const name = fragment.substring(0, colonIndex);
      const value = fragment.substring(colonIndex + 1);
      
      if (name) {
        if (!isValidFragmentName(name)) {
          console.warn(`[RJS-Frame] Invalid fragment name "${name}". Fragment names must match pattern: [\w\d_]+ (letters, digits, underscore only)`);
          return; // Skip invalid fragment names
        }
        params[name] = value || '';
        statuses[name] = 'active';
      }
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
 * Supports the /-/ separator pattern: /pageName/-/fragments
 * Example: /admin/-/arg1:value1/arg2:value2
 * Works with both window.location and provided path string
 */
export function parseUrlPath(path?: string): ParsedUrl {
  if (typeof window === 'undefined' && !path) {
    return { pageName: '', slotParams: {}, slotStatus: {}, linkParams: {} };
  }

  const urlPath = path || window.location.pathname;
  const search = path ? '' : (window.location.search || '');
  
  // Check if path contains the special separator /-/
  const separatorIndex = urlPath.indexOf(URL_FRAGMENT_SEPARATOR);
  
  let pageName = '';
  let fragmentString = '';
  
  if (separatorIndex !== -1) {
    // Path contains /-/ separator
    const pageNamePart = urlPath.substring(0, separatorIndex);
    const fragmentsPart = urlPath.substring(separatorIndex + URL_FRAGMENT_SEPARATOR.length);
    
    // Extract page name (remove leading slash)
    pageName = pageNamePart.replace(/^\/+/, '');
    fragmentString = fragmentsPart;
  } else {
    // Legacy path format (no /-/ separator)
    const fragments = urlPath.split('/').filter(Boolean);
    
    if (fragments.length === 0) {
      return { 
        pageName: '', 
        slotParams: {}, 
        slotStatus: {}, 
        linkParams: parseSearchParams(search)
      };
    }

    pageName = fragments[0];
    fragmentString = fragments.slice(1).join('/');
  }

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
 * Boolean true values are output as flags without colons (e.g., { debug: true } -> "debug")
 * Fragment names must match pattern: [\w\d_]+ (letters, digits, underscore only)
 */
export function buildUrlFragments(params: SlotParams, statuses?: SlotStatus): string {
  return Object.entries(params)
    .map(([key, value]) => {
      // Validate fragment name
      if (!isValidFragmentName(key)) {
        console.warn(`[RJS-Frame] Invalid fragment name "${key}". Fragment names must match pattern: [\w\d_]+ (letters, digits, underscore only). Skipping this fragment.`);
        return null; // Skip invalid fragment names
      }
      
      if (value === true) {
        // Boolean true - output as flag without colon
        return key;
      } else if (value === false) {
        // Boolean false - skip entirely (don't include in URL)
        return null;
      } else if (value && value !== '') {
        // String value - output with colon
        return `${key}:${value}`;
      } else {
        // Empty string - output key only
        return key;
      }
    })
    .filter(Boolean) // Remove null values (false booleans and invalid names)
    .join('/');
}

/**
 * Build full URL path from page name and slot parameters
 * Uses the /-/ separator pattern: /pageName/-/fragments
 * Example: /admin/-/arg1:value1/arg2:value2
 */
export function buildUrlPath(pageName: string, params: SlotParams, statuses?: SlotStatus): string {
  if (!pageName) {
    // If no page name, return root path
    return '/';
  }
  
  const fragments = buildUrlFragments(params, statuses);
  
  if (!fragments) {
    // If no fragments, return just the page name
    return `/${pageName}`;
  }
  
  // Use the /-/ separator between page name and fragments
  return `/${pageName}${URL_FRAGMENT_SEPARATOR}${fragments}`;
}

/**
 * Update URL fragments while preserving the existing page name
 * This ensures that when adding/updating fragments, the page name is never accidentally changed
 */
export function updateUrlFragments(params: SlotParams, statuses?: SlotStatus): string {
  const currentUrl = parseUrlPath();
  return buildUrlPath(currentUrl.pageName, params, statuses);
}

/**
 * Add or update a single URL fragment while preserving page name and other fragments
 */
export function addUrlFragment(key: string, value: string): string {
  const currentUrl = parseUrlPath();
  const updatedParams = {
    ...currentUrl.slotParams,
    [key]: value
  };
  return buildUrlPath(currentUrl.pageName, updatedParams, currentUrl.slotStatus);
}

/**
 * Remove a URL fragment while preserving page name and other fragments
 */
export function removeUrlFragment(key: string): string {
  const currentUrl = parseUrlPath();
  const updatedParams = { ...currentUrl.slotParams };
  const updatedStatuses = { ...currentUrl.slotStatus };
  
  delete updatedParams[key];
  delete updatedStatuses[key];
  
  return buildUrlPath(currentUrl.pageName, updatedParams, updatedStatuses);
}

/**
 * Update browser URL with new path (client-side only)
 * Preserves the page name when updating fragments
 */
export function updateBrowserUrl(pageName: string, params: SlotParams, statuses?: SlotStatus, search?: string): void {
  if (typeof window === 'undefined') return;
  
  const newPath = buildUrlPath(pageName, params, statuses);
  const currentSearch = search || window.location.search;
  const newUrl = newPath + currentSearch;
  
  window.history.replaceState(null, '', newUrl);
}

/**
 * Update browser URL fragments while preserving the current page name
 */
export function updateBrowserUrlFragments(params: SlotParams, statuses?: SlotStatus, search?: string): void {
  if (typeof window === 'undefined') return;
  
  const currentUrl = parseUrlPath();
  updateBrowserUrl(currentUrl.pageName, params, statuses, search);
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