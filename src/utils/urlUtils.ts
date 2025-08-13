import type { PageParams, AppState } from "../types/AppState";

export interface ParsedUrl {
  pagePath: string;
  pageParams: PageParams;
  linkParams: Record<string, string>;
  hashParams: Record<string, string>;
}

// Special separator between page name and URL fragments
const URL_FRAGMENT_SEPARATOR = "/-/";

// Regex pattern for valid fragment argument names
// First character: letters, digits, or underscore only (no dash or dot)
// Subsequent characters: letters, digits, underscore, dot, or dash
const FRAGMENT_NAME_PATTERN = /^[a-zA-Z0-9_]([a-zA-Z0-9_\.-]*)?$/;

/**
 * Generate a human-readable page title from appState
 * @param appState - The page state containing name and breadcrumbs
 * @returns A formatted title string
 */
export function updateBrowserTitle(appState: AppState): string {
  // Priority: breadcrumbs > name > fallback
  let title = appState.pageName || "Home";

  if (appState.breadcrumbs && appState.breadcrumbs.length > 0) {
    title = `${title} | ${appState.breadcrumbs.join(" > ")}`;
  }

  if (typeof document !== "undefined" && document.title != title) {
    document.title = title;
  }

  return title;
}

/**
 * Build URL path from appState, handling both new paths and fragment updates
 * Uses the /-/ separator pattern: /pagePath/-/fragments
 * Supports multi-segment paths like "dashboard/settings"
 * If appState contains a current path context, preserves path structure for fragment updates
 */
function buildPath(appState: AppState, currentPath: string): string {
  const { pageParams } = appState;

  // If we have a current path, check if it has fragments to update
  const sepIndex = currentPath.indexOf(URL_FRAGMENT_SEPARATOR);
  const fragments = buildUrlFragments(pageParams);
  let basePath = currentPath;

  if (sepIndex !== -1) {
    // Path has /-/ separator, replace everything after it
    basePath = currentPath.substring(0, sepIndex);
  }

  if (!fragments) {
    return basePath;
  }

  return `${basePath}${URL_FRAGMENT_SEPARATOR}${fragments}`;
}

function buildSearch(appState: AppState): string {
  const { linkParams } = appState;
  const searchParams = new URLSearchParams();
  Object.entries(linkParams).forEach(([key, value]) => {
    if (key) searchParams.set(key, value);
  });
  const params = searchParams.toString();
  return params ? "?" + params : "";
}

function buildHash(appState: AppState): string {
  return "";
}
/**
 * CENTRAL URL UPDATE METHOD
 * This is the only method that should modify window.location
 * All other URL update methods must call this method
 * @param appState - Required reference to current page state for title generation and history tracking
 */
export function updateBrowserLocation(appState: AppState): void {
  if (typeof window === "undefined") {
    return;
  }

  const { pageName, pageParams, linkParams } = appState;
  const currentPath = window.location.pathname;

  // Build the new URL using current path context for fragment updates
  const newPath = buildPath(appState, currentPath).replace(/^\/+/, "/");
  const newSearch = buildSearch(appState);
  const newHash = buildHash(appState);
  const newUrl = `${newPath}${newSearch}${newHash}`;

  // Generate title using appState
  const title = updateBrowserTitle(appState);

  const currentUrl =
    window.location.pathname + window.location.search + window.location.hash;

  // Only update history if URL actually changed
  if (newUrl === currentUrl) {
    return;
  }

  const historyState = {
    pageName,
    pagePath: newPath,
    location: currentUrl,
    pageParams,
    linkParams,
    breadcrumbs: appState.breadcrumbs || [],
  };

  // Use pushState for path changes, replaceState for fragment-only changes
  if (currentPath !== newPath) {
    window.history.pushState(historyState, title, newUrl);
  } else {
    window.history.replaceState(historyState, title, newUrl);
  }
}

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
function parseUrlFragments(fragments: string): PageParams {
  if (!fragments) return {};

  const params: PageParams = {};
  const addParams = (name: string, value: string | boolean) => {
    if (!isValidFragmentName(name)) {
      console.warn(
        `[RJS-Frame] Invalid fragment name "${name}". Fragment names must start with letter/digit/underscore, then can contain dots and dashes`
      );
      return false; // Skip invalid fragment names
    }
    params[name] = value;
    return true;
  };

  fragments
    .split("/")
    .filter(Boolean)
    .forEach((fragment) => {
      const colonIndex = fragment.indexOf(":");

      if (colonIndex === -1) {
        // Colon found - split into name and value
        return addParams(fragment, true);
      }

      const name = fragment.substring(0, colonIndex);
      const valueString = fragment.substring(colonIndex + 1);
      return addParams(name, valueString !== "" ? valueString : false);
    });

  return params;
}

/**
 * Parse search params into linkParams object
 */
function parseSearchParams(search: string): Record<string, string> {
  const params: Record<string, string> = {};
  new URLSearchParams(search).forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Parse URL path into page path and slot parameters
 * Supports the /-/ separator pattern: /pagePath/-/fragments
 * Example: /admin/-/arg1:value1/arg2:value2
 */
function parseUrl(pathname: string, search: string, hash: string): ParsedUrl {
  // Check if path contains the special separator /-/

  const urlPath = pathname.replace(/^\/+/, "");
  let pagePath = urlPath;
  let pathFragment = "";

  const separatorIndex = urlPath.indexOf(URL_FRAGMENT_SEPARATOR);

  if (separatorIndex !== -1) {
    // Path contains /-/ separator
    pagePath = urlPath.substring(0, separatorIndex);
    pathFragment = urlPath.substring(
      separatorIndex + URL_FRAGMENT_SEPARATOR.length
    );
  }

  return {
    pagePath,
    pageParams: parseUrlFragments(pathFragment),
    linkParams: parseSearchParams(search),
    hashParams: parseHashParams(hash),
  };
}

function parseHashParams(hash: string): Record<string, string> {
  const params: Record<string, string> = {};
  new URLSearchParams(hash).forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Convenience function that parses the current window location
 */
export function parseBrowserLocation(windowLocation: Location): ParsedUrl {
  return parseUrl(
    windowLocation.pathname,
    windowLocation.search,
    windowLocation.hash
  );
}

/**
 * Build URL fragments from pageParams
 * Uses ':' delimiter
 * Boolean true values are output as flags without colons (e.g., { debug: true } -> "debug")
 * Boolean false values are output with empty value after colon (e.g., { debug: false } -> "debug:")
 * Fragment names must start with letter/digit/underscore, then can contain dots and dashes
 */
function buildUrlFragments(params: PageParams): string {
  return Object.entries(params)
    .map(([key, value]) => {
      // Validate fragment name
      if (!isValidFragmentName(key)) {
        console.warn(
          `[RJS-Frame] Invalid fragment name "${key}". Fragment names must start with letter/digit/underscore, then can contain dots and dashes. Skipping this fragment.`
        );
        return null; // Skip invalid fragment names
      }

      if (value === true) {
        // Boolean true - output as flag without colon
        return key;
      } else if (value === false) {
        // Boolean false - output with empty value after colon
        return `${key}:`;
      } else if (value && value !== "") {
        // String value - output with colon
        return `${key}:${value}`;
      } else {
        // Empty string - output key only (treated as boolean true)
        return key;
      }
    })
    .filter(Boolean) // Remove null values (invalid names)
    .join("/");
}
