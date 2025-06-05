import { QueryMetadata } from './types';

/**
 * Checks if metadata is in the correct QueryMetadata format
 */
export declare function isQueryMetadata(metadata: any): metadata is QueryMetadata;
/**
 * Fetches metadata from API endpoint
 */
export declare function fetchMetadata(url: string): Promise<QueryMetadata>;
/**
 * Gets default sort configuration from QueryMetadata
 */
export declare function getDefaultSort(metadata: QueryMetadata): {
    field: string;
    direction: 'asc' | 'desc';
} | undefined;
