import { fetchJson } from '../../lib/api';
import { QueryMetadata } from '../data-table/types';
import { QueryBuilderState, ResourceQuery, buildQueryString, parseQueryString } from './types';

/**
 * Transform UI state to backend query format
 */
export function transformToBackendQuery(state: QueryBuilderState): ResourceQuery {
  const query: ResourceQuery = {};

  // Add select fields if any are specified
  if (state.selectedFields.length > 0) {
    query.select = state.selectedFields;
  }

  // Add sort rules
  if (state.sortRules.length > 0) {
    query.sort = state.sortRules.map(rule => `${rule.field}:${rule.direction}`);
  }

  // Transform filter rules to query string
  if (state.filterRules.length > 0) {
    query.query = buildQueryString(state.filterRules);
  }

  return query;
}

/**
 * Transform backend query to UI state
 */
export function transformFromBackendQuery(
  query: Partial<ResourceQuery>
): QueryBuilderState {
  const state: QueryBuilderState = {
    selectedFields: query.select || [],
    sortRules: [],
    filterRules: [],
  };

  // Parse sort rules
  if (query.sort) {
    state.sortRules = query.sort.map((sortStr: string) => {
      const [field, direction] = sortStr.split(':');
      return {
        field,
        direction: direction as 'asc' | 'desc',
      };
    });
  }

  // Parse filter rules from query string
  if (query.query) {
    state.filterRules = parseQueryString(query.query);
  }

  return state;
}

/**
 * Generate unique ID for filter rules
 */
export function generateFilterId(): string {
  return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get available operators for a field
 */
export function getOperatorsForField(field: string, metadata: QueryMetadata): string[] {
  if (!metadata.operators) return [];
  
  return Object.entries(metadata.operators)
    .filter(([, paramMeta]) => paramMeta.field_name === field)
    .map(([, paramMeta]) => paramMeta.operator);
}

/**
 * Get all available fields from metadata
 */
export function getAvailableFields(metadata: QueryMetadata): string[] {
  return Object.entries(metadata.fields)
    .filter(([, fieldMeta]) => !fieldMeta.hidden)
    .map(([fieldName]) => fieldName);
}

/**
 * Get sortable fields from metadata
 */
export function getSortableFields(metadata: QueryMetadata): string[] {
  return Object.entries(metadata.fields)
    .filter(([, fieldMeta]) => fieldMeta.sortable && !fieldMeta.hidden)
    .map(([fieldName]) => fieldName);
}

/**
 * Checks if metadata is in the correct QueryMetadata format
 */
export function isQueryMetadata(metadata: any): metadata is QueryMetadata {
  return metadata && 
    typeof metadata === 'object' && 
    'operators' in metadata && 
    'sortables' in metadata && 
    'default_order' in metadata &&
    metadata.fields &&
    Object.values(metadata.fields).some((field: any) => 
      'hidden' in field && 'identifier' in field
    );
}

/**
 * Fetches metadata from API endpoint
 */
export async function fetchMetadata(url: string): Promise<QueryMetadata> {
  try {
    const metadata = await fetchJson<QueryMetadata>(url);
    
    if (!isQueryMetadata(metadata)) {
      throw new Error('Invalid metadata format received from API');
    }
    
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}

/**
 * Gets default sort configuration from QueryMetadata
 */
export function getDefaultSort(metadata: QueryMetadata): { field: string; direction: 'asc' | 'desc' } | undefined {
  if (metadata.default_order && metadata.default_order.length > 0) {
    const defaultOrder = metadata.default_order[0];
    const [field, direction] = defaultOrder.split(':');
    return {
      field,
      direction: direction === 'desc' ? 'desc' : 'asc'
    };
  }
  return undefined;
} 