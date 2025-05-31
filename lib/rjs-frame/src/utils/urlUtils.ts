import type { PageParams } from '../types/PageState';

export interface ParsedUrl {
  pageName: string;
  pageParams: PageParams;
  linkParams: Record<string, string>;
}

export interface ParsedFragments {
  params: PageParams;
}

// Special separator between page name and URL fragments
export const URL_FRAGMENT_SEPARATOR = '/-/';

// Regex pattern for valid fragment argument names
// First character: letters, digits, or underscore only (no dash or dot)
// Subsequent characters: letters, digits, underscore, dot, or dash
export const FRAGMENT_NAME_PATTERN = /^[a-zA-Z0-9_]([a-zA-Z0-9_\.-]*)?$/;

/**
 * Validate fragment argument name against allowed pattern
 * @param name - The fragment name to validate
 * @returns true if valid, false otherwise
 */
export function isValidFragmentName(name: string): boolean {
  return FRAGMENT_NAME_PATTERN.test(name);
}

/**
 * Parse URL fragments into pageParams
 * Supports both ':' and '!' delimiters
 * Format: arg1:value1/arg2!value2/arg3:-/flag
 * - ':' or '!' separate name from value
 * - fragments without ':' are treated as boolean true (e.g., "debug" -> { debug: true })
 * - fragments with ':' but empty value are treated as boolean false (e.g., "debug:" -> { debug: false })
 * - fragment names must start with letter/digit/underscore, then can contain dots and dashes
 */
export function parseUrlFragments(fragments: string): ParsedFragments {
  if (!fragments) return { params: {} };
  
  const params: PageParams = {};
  const addParams = (name: string, value: string | boolean) => {
    if (!isValidFragmentName(name)) {
      console.warn(`[RJS-Frame] Invalid fragment name "${name}". Fragment names must start with letter/digit/underscore, then can contain dots and dashes`);
      return false; // Skip invalid fragment names
    }
    params[name] = value;
    return true;
  }
  
  fragments.split('/').filter(Boolean).forEach(fragment => {
    const colonIndex = fragment.indexOf(':');   
    
    if (colonIndex === -1) {
      // Colon found - split into name and value
      return addParams(fragment, true);
    }

    const name = fragment.substring(0, colonIndex);
    const valueString = fragment.substring(colonIndex + 1);
    return addParams(name, valueString !== '' ? valueString : false);
  });
  
  return { params };
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
    return { pageName: '', pageParams: {}, linkParams: {} };
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
    // No /-/ separator - entire path is the page name, no parameters
    pageName = urlPath.replace(/^\/+/, '');
    fragmentString = ''; // No parameters when there's no /-/ separator
  }

  const { params: pageParams } = parseUrlFragments(fragmentString);

  return {
    pageName,
    pageParams,
    linkParams: parseSearchParams(search)
  };
}

/**
 * Build URL fragments from pageParams
 * Uses ':' delimiter 
 * Boolean true values are output as flags without colons (e.g., { debug: true } -> "debug")
 * Boolean false values are output with empty value after colon (e.g., { debug: false } -> "debug:")
 * Fragment names must start with letter/digit/underscore, then can contain dots and dashes
 */
export function buildUrlFragments(params: PageParams): string {
  return Object.entries(params)
    .map(([key, value]) => {
      // Validate fragment name
      if (!isValidFragmentName(key)) {
        console.warn(`[RJS-Frame] Invalid fragment name "${key}". Fragment names must start with letter/digit/underscore, then can contain dots and dashes. Skipping this fragment.`);
        return null; // Skip invalid fragment names
      }
      
      if (value === true) {
        // Boolean true - output as flag without colon
        return key;
      } else if (value === false) {
        // Boolean false - output with empty value after colon
        return `${key}:`;
      } else if (value && value !== '') {
        // String value - output with colon
        return `${key}:${value}`;
      } else {
        // Empty string - output key only (treated as boolean true)
        return key;
      }
    })
    .filter(Boolean) // Remove null values (invalid names)
    .join('/');
}

/**
 * Build full URL path from page name and slot parameters
 * Uses the /-/ separator pattern: /pageName/-/fragments
 * Example: /admin/-/arg1:value1/arg2:value2
 */
export function buildUrlPath(pageName: string, params: PageParams): string {
  if (!pageName) {
    // If no page name, return root path
    return '/';
  }
  
  const fragments = buildUrlFragments(params);
  
  if (!fragments) {
    // If no fragments, return just the page name
    return `/${pageName}`;
  }
  
  // Use the /-/ separator between page name and fragments
  return `/${pageName}${URL_FRAGMENT_SEPARATOR}${fragments}`;
}

/**
 * Update URL fragments while preserving the existing path structure
 * Only manages fragments after the /-/ separator, doesn't rely on parsed pageName
 */
export function updateUrlFragments(params: PageParams): string {
  if (typeof window === 'undefined') return '/';
  
  const currentPath = window.location.pathname;
  const separatorIndex = currentPath.indexOf(URL_FRAGMENT_SEPARATOR);
  
  const fragments = buildUrlFragments(params);
  
  if (separatorIndex !== -1) {
    // Path has /-/ separator, replace everything after it
    const basePath = currentPath.substring(0, separatorIndex);
    return fragments ? `${basePath}${URL_FRAGMENT_SEPARATOR}${fragments}` : basePath;
  } else {
    // No /-/ separator in current path, append it if we have fragments
    return fragments ? `${currentPath}${URL_FRAGMENT_SEPARATOR}${fragments}` : currentPath;
  }
}

/**
 * Add or update a single URL fragment while preserving path structure and other fragments
 */
export function addUrlFragment(key: string, value: string): string {
  const currentUrl = parseUrlPath();
  const updatedParams = {
    ...currentUrl.pageParams,
    [key]: value
  };
  return updateUrlFragments(updatedParams);
}

/**
 * Remove a URL fragment while preserving path structure and other fragments
 */
export function removeUrlFragment(key: string): string {
  const currentUrl = parseUrlPath();
  const updatedParams = { ...currentUrl.pageParams };
  
  delete updatedParams[key];
  
  return updateUrlFragments(updatedParams);
}

/**
 * Update browser URL with new path (client-side only)
 * Preserves the page name when updating fragments
 * Automatically creates history entry if path changes, replaces if only search changes
 * @param pageName - The page name
 * @param params - Page parameters
 * @param search - Optional search string
 */
export function updateBrowserUrl(pageName: string, params: PageParams, search?: string): void {
  if (typeof window === 'undefined') return;
  
  const newPath = buildUrlPath(pageName, params);
  const currentSearch = search || window.location.search;
  const newUrl = newPath + currentSearch;
  
  // Create history entry if path changed, replace if only search changed
  const pathChanged = newPath !== window.location.pathname;
  
  if (pathChanged) {
    window.history.pushState(null, '', newUrl);
  } else {
    window.history.replaceState(null, '', newUrl);
  }
}

/**
 * Update browser URL fragments while preserving the current path structure
 * Only manages fragments after the /-/ separator (PageParams)
 * Preserves existing search parameters without modifying them
 * Creates history entry only if path actually changes
 * @param params - Page parameters
 */
export function updateBrowserUrlFragments(params: PageParams): void {
  if (typeof window === 'undefined') return;
  
  const newPath = updateUrlFragments(params);
  const currentSearch = window.location.search;
  const newUrl = newPath + currentSearch;
  
  // Only push state if the URL actually changed
  if (newUrl !== window.location.href) {
    window.history.pushState(null, '', newUrl);
  }
}

/**
 * Update browser search params (client-side only)
 * Only manages search parameters (LinkParams)
 * Preserves existing path parameters without modifying them
 * Replaces state only if URL actually changes
 * @param params - Search parameters
 */
export function updateBrowserSearchParams(params: Record<string, string>): void {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const newSearch = searchParams.toString();
  const currentPath = window.location.pathname;
  const newUrl = `${currentPath}${newSearch ? '?' + newSearch : ''}`;
  
  // Only replace state if the URL actually changed
  if (newUrl !== window.location.href) {
    window.history.replaceState(null, '', newUrl);
  }
} 