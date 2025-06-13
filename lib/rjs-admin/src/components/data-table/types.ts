import { ResourceQuery } from "../query-builder/types";

export interface FieldMetadata {
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  type?: "text" | "number" | "date" | "boolean" | "custom";
  format?: (value: any) => string | React.ReactNode;
  className?: string;
}

// Unified metadata format - matches API structure directly
export interface QueryFieldMetadata {
  label: string;
  sortable: boolean;
  hidden: boolean;
  identifier: boolean;
  factory: string | null;
  source: string | null;
}

export interface QueryParamMetadata {
  index: number;
  field_name: string;
  operator: string;
  widget: {
    name: string;
    desc: string | null;
    inversible: boolean;
    data_query: any | null;
  } | null;
}

export interface QueryMetadata {
  fields: Record<string, QueryFieldMetadata>;
  operators: Record<string, QueryParamMetadata>;
  sortables: string[];
  default_order: string[];
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface FilterConfig {
  field: string;
  operator: string;
  value: any;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

// Shared state interface used by both DataTable and ResourceDataTable
export interface DataTableState {
  searchQuery: string;
  showFilterModal: boolean;
  currentSort?: SortConfig;
  queryState: ResourceQuery;
  data: Array<Record<string, any>>;
  metadata: QueryMetadata | null;
  loading: boolean;
  backgroundLoading: boolean;
  error: string | null;
  pagination: PaginationConfig;
}

// Base props interface
export interface DataTableProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  searchPlaceholder?: string;
  onQueryChange?: (query: ResourceQuery) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  actions?: React.ReactNode;
  className?: string;
  data?: Array<Record<string, any>>;
  dataApi?: string;
  metadata?: QueryMetadata;
}

export interface HeaderComponentProps {
  metadata: QueryMetadata;
  sort?: SortConfig;
  onSort?: (sort: SortConfig) => void;
}

export interface RowComponentProps {
  metadata: QueryMetadata;
  data: Record<string, any>;
  index: number;
}

export interface PaginationControlsProps {
  pagination: PaginationConfig;
  onPageChange?: (page: number, pageSize: number) => void;
  loading?: boolean;
}
