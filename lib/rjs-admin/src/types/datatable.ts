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
}

// Props for sub-components
export interface TableControlProps {
  metadata: QueryMetadata;
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  onRefresh: () => void;
  openQueryBuilder: (open: boolean) => void;
  loading: boolean;
  debug?: boolean;
  className?: string;
}

export interface TableViewProps {
  data: DataRow[];
  metadata: QueryMetadata;
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  customTableHeader?: React.ComponentType<TableHeaderProps>;
  customTableRow?: React.ComponentType<TableRowProps>;
  className?: string;
  allowSelection?: boolean;
}

export interface TableHeaderProps {
  metadata: QueryMetadata;
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  allowSelection?: boolean;
  /**
   * Tri-state value for the header checkbox. Should be `false`, `true`, or
   * "indeterminate" (per Radix Checkbox API). Determined by the parent
   * component, typically based on whether the current page's IDs are all / some
   * / none in the global `selectedItems` list.
   */
  selectAllState?: boolean | "indeterminate";
  onSelectAll?: () => void;
  onClearAll?: () => void;
  idField?: string;
  className?: string;
  /** Whether header filters (TableFilter row) are visible */
  showHeaderFilters?: boolean;
  /** Callback when the header filter visibility checkbox is toggled */
  onShowHeaderFiltersChange?: (visible: boolean) => void;
}

export interface TableFilterProps {
  metadata: QueryMetadata;
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  /** If the selection checkbox column is shown, add a padding cell */
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
  rowActions?: React.ComponentType<TableRowActionProps>[];
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
  /**
   * Number of currently selected entries (row-selection feature).
   * When provided and greater than zero, the pagination bar will show
   * "| N entries selected".
   */
  selectedCount?: number;
  /**
   * Callback to clear all selected entries when the user clicks the clear (×) button.
   */
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
