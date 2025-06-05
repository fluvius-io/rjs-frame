/**
 * API Configuration for RJS Admin
 *
 * This utility ensures that all API calls use the correct base URL
 * depending on the environment (development, Storybook, production)
 */
export declare const API_BASE_URL = "";
/**
 * Create a full API URL from a path
 */
export declare const createApiUrl: (path: string) => string;
/**
 * Enhanced fetch function that automatically uses the correct API base URL
 */
export declare const apiFetch: (path: string, options?: RequestInit) => Promise<Response>;
/**
 * Fetch JSON data from API
 */
export declare const fetchJson: <T = any>(path: string, options?: RequestInit) => Promise<T>;
/**
 * Common API endpoints
 */
export declare const endpoints: {
    readonly metadata: (entity: string) => string;
    readonly data: (entity: string) => string;
    readonly userMetadata: () => string;
    readonly userData: () => string;
    readonly organizationMetadata: () => string;
    readonly organizationData: () => string;
};
