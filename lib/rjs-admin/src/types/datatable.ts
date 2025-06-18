/**
 * DataTable Types
 * Type definitions for the data table component
 */

import { QueryMetadata, QueryState } from "./querybuilder";

// Data row type - flexible record structure
export interface DataRow {
  [key: string]: any;
}

// API response structure for data fetching
export interface DataResponse {
  data: DataRow[];
  total: number;
  page: number;
  pageSize: number;
}

// Pagination state
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// Loading states
export interface LoadingState {
  data: boolean;
  metadata: boolean;
}

// Column configuration for table display
export interface ColumnConfig {
  key: string;
  label: string;
  sortable: boolean;
  hidden: boolean;
  width?: number;
  minWidth?: number;
}

// Props for DataTable component
export interface DataTableProps {
  // Data and metadata
  data?: DataRow[];
  metadata?: QueryMetadata;

  // API configuration
  dataApi?: string; // endpoint for data fetching

  // State management
  queryState?: QueryState;
  onQueryStateChange?: (state: QueryState) => void;

  // Pagination
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;

  // Customization
  customTableHeader?: React.ComponentType<TableHeaderProps>;
  customTableRow?: React.ComponentType<TableRowProps>;
  customPagination?: React.ComponentType<PaginationProps>;

  // Debug
  debug?: boolean;

  // Selection feature
  allowSelection?: boolean;

  /**
   * Debounce delay in milliseconds for automatic data fetching when table
   * state changes (pagination, etc.). Set to 0 or a negative number to disable
   * debouncing entirely.
   */
  debounceDelay?: number;

  // Styling
  className?: string;

  // Actions
  actions?: React.ReactNode;
}

// Props for sub-components
export interface TableControlProps {
  className?: string;
  actions?: React.ReactNode;
}

export interface TableViewProps {
  customTableHeader?: React.ComponentType<TableHeaderProps>;
  customTableRow?: React.ComponentType<TableRowProps>;
  className?: string;
  allowSelection?: boolean;
}

export interface TableHeaderProps {
  allowSelection?: boolean;
  selectAllState?: boolean | "indeterminate";
  onSelectAll?: () => void;
  onClearAll?: () => void;
  idField?: string;
  className?: string;
}

export interface TableFilterProps {
  allowSelection?: boolean;
  className?: string;
}

export interface TableRowProps {
  row: DataRow;
  columns: ColumnConfig[];
  rowIndex: number;
  idValue?: string;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  className?: string;
  rowActions?: TableRowActionProps[];
}

export interface TableRowActionProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface PaginationProps {
  pagination: PaginationState;
  onChange: (pagination: PaginationState) => void;
  loading?: boolean;
  selectedCount?: number;
  onClearSelection?: () => void;
  className?: string;
}

// Modal props for QueryBuilder integration
export interface QueryBuilderModalProps {
  metadata: QueryMetadata;
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
