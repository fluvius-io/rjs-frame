/**
 * API Configuration for RJS Admin
 * 
 * This utility ensures that all API calls use the correct base URL
 * depending on the environment (development, Storybook, production)
 */

// Get the API base URL from environment or default to /api for proxy
const getApiBaseUrl = (): string => {
  // In Storybook and development, use /api which will be proxied
  if (typeof window !== 'undefined') {
    // Check if we're running in Storybook
    if (window.location.port === '6006') {
      console.log('🔧 API Config: Running in Storybook, using /api proxy');
      return '/api';
    }
    
    // Check if we're in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('🔧 API Config: Running in development, using /api proxy');
      return '/api';
    }
  }
  
  // For production or other environments, use the environment variable or default
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '/api';
  console.log('🔧 API Config: Using base URL:', baseUrl);
  return baseUrl;
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Create a full API URL from a path
 */
export const createApiUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const fullUrl = `${API_BASE_URL}/${cleanPath}`;
  console.log('🌐 API: Creating URL:', path, '→', fullUrl);
  return fullUrl;
};

/**
 * Enhanced fetch function that automatically uses the correct API base URL
 */
export const apiFetch = async (path: string, options?: RequestInit): Promise<Response> => {
  const url = createApiUrl(path);
  console.log('📡 API: Making request to:', url, options?.method || 'GET');
  
  try {
    const response = await fetch(url, options);
    console.log('✅ API: Response received:', response.status, response.statusText, 'for', url);
    return response;
  } catch (error) {
    console.error('❌ API: Request failed:', error, 'for', url);
    throw error;
  }
};

/**
 * Fetch JSON data from API
 */
export const fetchJson = async <T = any>(path: string, options?: RequestInit): Promise<T> => {
  const response = await apiFetch(path, options);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log('📊 API: JSON data received for', path, data);
  return data;
};

/**
 * Common API endpoints
 */
export const endpoints = {
  metadata: (entity: string) => `_info/${entity}`,
  data: (entity: string) => `${entity}/`,
  userMetadata: () => '_info/idm.user',
  userData: () => 'idm.user/',
  organizationMetadata: () => '_info/idm.organization/',
  organizationData: () => 'idm.organization/',
} as const; 