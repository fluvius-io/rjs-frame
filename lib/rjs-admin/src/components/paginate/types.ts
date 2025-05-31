export interface FieldMetadata {
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  format?: (value: any) => string | React.ReactNode;
  className?: string;
}

export interface QueryOperator {
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: Array<{ value: any; label: string }>;
  placeholder?: string;
}

export interface PaginatedListMetadata {
  fields: Record<string, FieldMetadata>;
  operators?: Record<string, QueryOperator>;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
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

export interface PaginatedListProps {
  metadata: PaginatedListMetadata;
  data: Array<Record<string, any>>;
  pagination: PaginationConfig;
  loading?: boolean;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  searchPlaceholder?: string;
  onSort?: (sort: SortConfig) => void;
  onFilter?: (filters: FilterConfig[]) => void;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  actions?: React.ReactNode;
  className?: string;
}

export interface HeaderComponentProps {
  metadata: PaginatedListMetadata;
  sort?: SortConfig;
  onSort?: (sort: SortConfig) => void;
}

export interface RowComponentProps {
  metadata: PaginatedListMetadata;
  data: Record<string, any>;
  index: number;
}

export interface PaginationControlsProps {
  pagination: PaginationConfig;
  onPageChange?: (page: number, pageSize: number) => void;
  loading?: boolean;
} 