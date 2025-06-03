import { QueryBuilderState, FrontendQuery, SortRule, FilterRule } from './types';
import { PaginatedListMetadata } from '../paginate/types';

/**
 * Transform UI state to backend query format
 */
export function transformToBackendQuery(state: QueryBuilderState): FrontendQuery {
  const query: FrontendQuery = {
    limit: state.limit,
    page: state.page,
  };

  // Add select fields if any are specified
  if (state.selectedFields.length > 0) {
    query.select = state.selectedFields;
  }

  // Add deselect fields if any are specified
  if (state.deselectedFields.length > 0) {
    query.deselect = state.deselectedFields;
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
  query: Partial<FrontendQuery>, 
  metadata: PaginatedListMetadata
): QueryBuilderState {
  const state: QueryBuilderState = {
    limit: query.limit || 10,
    page: query.page || 1,
    selectedFields: query.select || [],
    deselectedFields: query.deselect || [],
    sortRules: [],
    filterRules: [],
  };

  // Parse sort rules
  if (query.sort) {
    state.sortRules = query.sort.map(sortStr => {
      const [field, direction] = sortStr.split(':');
      return {
        field,
        direction: direction as 'asc' | 'desc',
      };
    });
  }

  // Parse filter rules from query string
  if (query.query) {
    state.filterRules = parseQueryString(query.query, metadata);
  }

  return state;
}

/**
 * Build query string from filter rules
 * Groups filters by field_name and handles negation
 */
export function buildQueryString(filterRules: FilterRule[]): string {
  const queryParts: string[] = [];

  filterRules.forEach(rule => {
    if (!rule.value) return;

    const separator = rule.negate ? '!' : ':';
    const queryPart = `${rule.operator}${separator}${rule.value}`;
    queryParts.push(queryPart);
  });

  return queryParts.join(' AND ');
}

/**
 * Parse query string into filter rules
 */
export function parseQueryString(queryString: string, metadata: PaginatedListMetadata): FilterRule[] {
  const filterRules: FilterRule[] = [];
  
  // Split by AND/OR operators (simplified parsing)
  const parts = queryString.split(/\s+(AND|OR)\s+/i);
  
  parts.forEach((part, index) => {
    if (part.toUpperCase() === 'AND' || part.toUpperCase() === 'OR') return;
    
    // Parse individual filter: operator:value or operator!value
    const negateMatch = part.match(/^(.+?)!(.+)$/);
    const normalMatch = part.match(/^(.+?):(.+)$/);
    
    if (negateMatch) {
      const [, operator, value] = negateMatch;
      const field = extractFieldFromOperator(operator, metadata);
      filterRules.push({
        id: `filter_${index}`,
        field,
        operator,
        value,
        negate: true,
      });
    } else if (normalMatch) {
      const [, operator, value] = normalMatch;
      const field = extractFieldFromOperator(operator, metadata);
      filterRules.push({
        id: `filter_${index}`,
        field,
        operator,
        value,
        negate: false,
      });
    }
  });

  return filterRules;
}

/**
 * Extract field name from operator (e.g., "name__family:eq" -> "name__family")
 */
function extractFieldFromOperator(operator: string, metadata: PaginatedListMetadata): string {
  // Check if the operator matches any field-based operators in metadata
  if (metadata.operators) {
    for (const [opKey] of Object.entries(metadata.operators)) {
      const fieldMatch = opKey.match(/^(.+?):(.+)$/);
      if (fieldMatch && operator.includes(fieldMatch[1])) {
        return fieldMatch[1];
      }
    }
  }
  
  // Fallback: assume the field is the first part before the last colon
  const parts = operator.split(':');
  return parts.length > 1 ? parts.slice(0, -1).join(':') : operator;
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
export function getOperatorsForField(field: string, metadata: PaginatedListMetadata): string[] {
  if (!metadata.operators) return [];
  
  return Object.keys(metadata.operators).filter(key => {
    const fieldMatch = key.match(/^(.+?):(.+)$/);
    return fieldMatch && fieldMatch[1] === field;
  });
}

/**
 * Get all available fields from metadata
 */
export function getAvailableFields(metadata: PaginatedListMetadata): string[] {
  return Object.keys(metadata.fields);
}

/**
 * Get sortable fields from metadata
 */
export function getSortableFields(metadata: PaginatedListMetadata): string[] {
  return Object.entries(metadata.fields)
    .filter(([, fieldMeta]) => fieldMeta.sortable)
    .map(([fieldName]) => fieldName);
} 