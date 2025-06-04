import { QueryMetadata } from '../paginate/types';

// Backend query format
export interface FrontendQuery {
  limit: number;
  page: number;
  select?: string[];
  sort?: string[];
  query?: string;
}

// UI state for building queries
export interface QueryBuilderState {
  limit: number;
  page: number;
  selectedFields: string[];
  sortRules: SortRule[];
  filterRules: FilterRule[];
}

export interface SortRule {
  field: string;
  direction: 'asc' | 'desc';
}

// Base filter interface
export interface BaseFilterRule {
  id: string;
  negate?: boolean;
}

// Simple field-based filter
export interface FieldFilterRule extends BaseFilterRule {
  type: 'field';
  field: string;
  operator: string;
  value: any;
}

// Composite filter (AND/OR)
export interface CompositeFilterRule extends BaseFilterRule {
  type: 'composite';
  operator: ':and' | ':or';
  children: FilterRule[];
}

// Union type for all filter rules
export type FilterRule = FieldFilterRule | CompositeFilterRule;

// Legacy interface for backward compatibility
export interface LegacyFilterRule {
  id: string;
  field: string;
  operator: string;
  value: any;
  negate: boolean;
}

// Query builder component props
export interface QueryBuilderProps {
  metadataApi: string;
  initialQuery?: Partial<FrontendQuery>;
  onQueryChange?: (query: FrontendQuery) => void;
  onExecute?: (query: FrontendQuery) => void;
  title?: string;
  className?: string;
}

// Field selection component props
export interface FieldSelectorProps {
  metadata: QueryMetadata;
  selectedFields: string[];
  onSelectedFieldsChange: (fields: string[]) => void;
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

// Query display component props
export interface QueryDisplayProps {
  query: FrontendQuery;
  onQueryChange?: (query: FrontendQuery) => void;
} 