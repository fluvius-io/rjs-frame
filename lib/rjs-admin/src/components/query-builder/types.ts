import { PaginatedListMetadata } from '../paginate/types';

// Backend query format
export interface FrontendQuery {
  limit: number;
  page: number;
  select?: string[];
  deselect?: string[];
  sort?: string[];
  query?: string;
}

// UI state for building queries
export interface QueryBuilderState {
  limit: number;
  page: number;
  selectedFields: string[];
  deselectedFields: string[];
  sortRules: SortRule[];
  filterRules: FilterRule[];
}

export interface SortRule {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterRule {
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
  metadata: PaginatedListMetadata;
  selectedFields: string[];
  deselectedFields: string[];
  onSelectedFieldsChange: (fields: string[]) => void;
  onDeselectedFieldsChange: (fields: string[]) => void;
}

// Sort builder component props
export interface SortBuilderProps {
  metadata: PaginatedListMetadata;
  sortRules: SortRule[];
  onSortRulesChange: (rules: SortRule[]) => void;
}

// Filter builder component props
export interface FilterBuilderProps {
  metadata: PaginatedListMetadata;
  filterRules: FilterRule[];
  onFilterRulesChange: (rules: FilterRule[]) => void;
}

// Query display component props
export interface QueryDisplayProps {
  query: FrontendQuery;
  onQueryChange?: (query: FrontendQuery) => void;
} 