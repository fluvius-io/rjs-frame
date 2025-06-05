import { QueryMetadata } from '../data-table/types';
import { QueryBuilderState, ResourceQuery } from './types';

/**
 * Transform UI state to backend query format
 */
export declare function transformToBackendQuery(state: QueryBuilderState): ResourceQuery;
/**
 * Transform backend query to UI state
 */
export declare function transformFromBackendQuery(query: Partial<ResourceQuery>): QueryBuilderState;
/**
 * Generate unique ID for filter rules
 */
export declare function generateFilterId(): string;
/**
 * Get available operators for a field
 */
export declare function getOperatorsForField(field: string, metadata: QueryMetadata): string[];
/**
 * Get all available fields from metadata
 */
export declare function getAvailableFields(metadata: QueryMetadata): string[];
/**
 * Get sortable fields from metadata
 */
export declare function getSortableFields(metadata: QueryMetadata): string[];
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
