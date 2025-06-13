import { QueryFieldMetadata, QueryMetadata } from "../data-table/types";

// UI state for building queries
export interface QueryBuilderState {
  visibleFields: QueryFieldMetadata[];
  sortRules: SortRule[];
  filterRules: FilterRule[];
  universalQuery?: string;
}

export interface SortRule {
  field: string;
  direction: "asc" | "desc";
}

// Base filter interface
export interface BaseFilterRule {
  id: string;
  type: "field" | "composite";
}

// Field filter rule
export interface FieldFilterRule extends BaseFilterRule {
  type: "field";
  field: string;
  operator: string;
  value: any;
}

// Composite filter (AND/OR)
export interface CompositeFilterRule extends BaseFilterRule {
  type: "composite";
  operator: ".and" | ".or";
  children: FilterRule[];
}

// Union type for all filter rules
export type FilterRule = FieldFilterRule | CompositeFilterRule;

// Query builder component props
export interface QueryBuilderProps {
  // Metadata source - provide metadata directly
  metadata: QueryMetadata;

  // Configuration
  initialQuery?: Partial<QueryBuilderState>;
  onQueryChange?: (state: QueryBuilderState) => void;
  onExecute?: (state: QueryBuilderState) => void;
  title?: string;
  className?: string;

  // Section visibility controls
  showFieldSelection?: boolean;
  showSortRules?: boolean;
  showFilterRules?: boolean;
  showQueryDisplay?: boolean;
}

// Field selection component props
export interface FieldSelectorProps {
  metadata: QueryMetadata;
  selectedFields: QueryFieldMetadata[];
  onSelectedFieldsChange: (fields: QueryFieldMetadata[]) => void;
}

// Sort builder component props
export interface SortBuilderProps {
  metadata: QueryMetadata;
  sortRules: SortRule[];
  onSortRulesChange: (rules: SortRule[]) => void;
}

// Filter builder component props
export interface FilterBuilderProps {
  metadata: QueryMetadata;
  filterRules: FilterRule[];
  onFilterRulesChange: (rules: FilterRule[]) => void;
}

// Composite filter group props
export interface CompositeFilterGroupProps {
  metadata: QueryMetadata;
  filter: CompositeFilterRule;
  onFilterChange: (filter: CompositeFilterRule) => void;
  onRemove: () => void;
  depth?: number;
  isRoot?: boolean;
}

// Field filter props
export interface FieldFilterProps {
  metadata: QueryMetadata;
  filter: FieldFilterRule;
  onFilterChange: (filter: FieldFilterRule) => void;
  onRemove: () => void;
}

// Query transformation functions
export function buildQueryString(filterRules: FilterRule[]): string {
  if (filterRules.length === 0) return "";

  const queryObject: Record<string, any> = {};

  function processFilter(filter: FilterRule): void {
    if (filter.type === "field") {
      const key = `${filter.field}.${filter.operator}`;
      queryObject[key] = filter.value;
    } else if (filter.type === "composite") {
      // For composite filters, we need to handle AND/OR logic
      // This is a simplified implementation - you may need to adjust based on your backend needs
      filter.children.forEach((child) => processFilter(child));
    }
  }

  filterRules.forEach((filter) => processFilter(filter));

  return JSON.stringify(queryObject);
}

export function parseQueryString(queryString: string): FilterRule[] {
  if (!queryString) return [];

  try {
    const queryObject = JSON.parse(queryString);
    const filterRules: FilterRule[] = [];

    Object.entries(queryObject).forEach(([key, value], index) => {
      const [field, operator] = key.split(".");
      if (field && operator) {
        filterRules.push({
          id: `filter-${index}`,
          type: "field",
          field,
          operator,
          value,
        } as FieldFilterRule);
      }
    });

    return filterRules;
  } catch (error) {
    console.warn("Failed to parse query string:", error);
    return [];
  }
}

// Transform QueryBuilderState to ResourceQuery
export function toResourceQuery(filterRules: FilterRule[]): ResourceQuery {
  const query: ResourceQuery = {};

  if (filterRules.length > 0) {
    query.query = buildQueryString(filterRules);
  }

  return query;
}

// Transform ResourceQuery to QueryBuilderState
export function fromResourceQuery(
  query: ResourceQuery,
  metadata: QueryMetadata
): QueryBuilderState {
  const state: QueryBuilderState = {
    visibleFields: query.select
      ? query.select.map((field) => metadata.fields[field])
      : [],
    sortRules: [],
    filterRules: [],
  };

  if (query.sort) {
    state.sortRules = query.sort.map((sortStr, index) => {
      const [field, direction] = sortStr.split(".");
      return {
        field: field || `field-${index}`,
        direction: (direction === "desc" ? "desc" : "asc") as "asc" | "desc",
      };
    });
  }

  if (query.query) {
    state.filterRules = parseQueryString(query.query);
  }

  return state;
}

// QueryBuilderModal props interface
export interface QueryBuilderModalProps {
  isOpen: boolean;
  metadata: QueryMetadata;
  currentQuery: QueryBuilderState;
  onClose: () => void;
  onApply: (queryState: QueryBuilderState) => void;
}

// Backend query format
export interface ResourceQuery {
  select?: string[];
  sort?: string[];
  query?: string;
}
