/**
 * API Configuration for RJS Admin
 *
 * This utility ensures that all API calls use the correct base URL
 * depending on the environment (development, Storybook, production)
 */

import { APIManager, type ApiCollectionConfig } from "rjs-frame";

// Set up IdmCollection
const idmCollectionConfig: ApiCollectionConfig = {
  name: "idm",
  baseUrl: "/api",
  debug: true,
  queries: {
    user: "/idm.user/",
    organization: {
      path: "/idm.organization/",
      meta: "/_meta/idm.organization/",
    },
  },
};

// Create and register the IdmCollection
APIManager.registerConfig(idmCollectionConfig);
const TRADE_APIS = [
  "signal",
  "data",
  "algo",
  "bot",
  "manager",
  "market-data",
  "executor",
  "market",
];
for (const api_name of TRADE_APIS) {
  APIManager.registerConfig({
    name: `trade-${api_name}`,
    dynamic: true,
    baseUrl: "/api",
  });
}
// Get the API base URL from environment or default to / for proxy

export const API_BASE_URL = "";

/**
 * Create a full API URL from a path
 */
export const createApiUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

/**
 * Enhanced fetch function that automatically uses the correct API base URL
 */
export const apiFetch = async (
  path: string,
  options?: RequestInit
): Promise<Response> => {
  const url = createApiUrl(path);

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch JSON data from API
 */
export const fetchJson = async <T = any>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const response = await apiFetch(path, options);

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("📊 API: JSON data received for", path, data);
  return data;
};

/**
 * Common API endpoints
 */
export const endpoints = {
  metadata: (entity: string) => `_meta/${entity}`,
  data: (entity: string) => `${entity}/`,
  userMetadata: () => "_meta/idm.user/",
  userData: () => "idm.user/",
  organizationMetadata: () => "_meta/idm.organization/",
  organizationData: () => "idm.organization/",
} as const;
