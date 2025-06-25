/**
 * DataTable Types
 * Type definitions for the data table component
 */

import { ApiResponse } from "../../../rjs-frame/src/api/types";
import { QueryFieldMetadata, QueryMetadata, QueryState } from "./querybuilder";

// Data row type - flexible record structure
export interface DataRow {
  [key: string]: any;
}

export interface DataTableQueryState extends QueryState {
  resourceScope?: Record<string, string>;
  pathQuery?: Record<string, string>;
}

export interface DataTableSelectionState {
  selectedItems?: string[];
  activeItem?: string;
  activeColumn?: string;
}

// API response structure for data fetching
export interface DataResponse extends ApiResponse {
  data: DataRow[];
  meta?: {};
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Pagination state
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Loading states
export interface LoadingState {
  data: boolean | "initializing";
  meta: boolean | "initializing";
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
export type DataTableSource = string; // endpoint for data fetching or function

export interface DataTableContextValue {
  controlDescription?: string;
  controlTitle?: string;
  data: DataRow[];
  debug?: boolean;
  fetchData: () => Promise<void>;
  fetchMetadata: () => Promise<void>;
  loading: LoadingState;
  metadata: QueryMetadata | null;
  onActivate: (id: string, row: DataRow) => void;
  onQueryStateChange: (state: Partial<DataTableQueryState>) => void;
  onSelectionStateChange: (state: Partial<DataTableSelectionState>) => void;
  onShowHeaderFiltersChange: (show: boolean) => void;
  openQueryBuilder: (open: boolean) => void;
  pagination: PaginationState;
  queryState: DataTableQueryState;
  selectionState: DataTableSelectionState;
  showHeaderFilters: boolean;
  showHeaderTitle: boolean;
  TableFilterComponent: React.ComponentType<TableFilterProps>;
  TableHeaderComponent: React.ComponentType<TableHeaderProps>;
  TableRowComponent: React.ComponentType<TableRowProps>;
  rowActions: TableActionProps[];
  batchActions: TableActionProps[];
  tableActions: TableActionProps[];
  customFormatters?: Record<string, (value: any) => React.ReactNode>;
}

// Props for DataTable component
export interface DataTableProps {
  // Data and metadata
  metadata?: QueryMetadata;
  showHeaderFilters?: boolean;
  showHeaderTitle?: boolean;
  // API configuration
  resourceName?: DataTableSource; // endpoint for data fetching

  // State management
  queryState?: DataTableQueryState;
  onQueryStateChange?: (state: DataTableQueryState) => void;
  onActivate?: (id: string, row: DataRow) => void;

  // Pagination
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  customFormatters?: Record<string, (value: any) => React.ReactNode>;

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
  rowActions?: TableActionProps[];
  batchActions?: TableActionProps[];
  tableActions?: TableActionProps[];

  // Title and description
  title?: string;
  description?: string;
}

// Props for sub-components
export interface TableControlProps {
  className?: string;
}

export interface TableViewProps {
  className?: string;
  allowSelection?: boolean;
}

export interface TableHeaderProps {
  allowSelection?: boolean;
  selectAllState?: boolean | "indeterminate";
  onSelectAll?: () => void;
  onClearAll?: () => void;
  className?: string;
}

export interface TableFilterProps {
  allowSelection?: boolean;
  className?: string;
}

export interface TableRowProps {
  row: DataRow;
  columns: ColumnConfig[];
  fieldMap: Record<string, QueryFieldMetadata>;
  rowIndex: number;
  idValue?: string;
  selected?: boolean;
  isActive?: boolean;
  onSelect?: (id: string, selected: boolean, row: DataRow) => void;
  onActivate?: (id: string, row: DataRow) => void;
  className?: string;
}

export interface TableActionProps {
  label: string | ((dataTarget: any) => string);
  icon: React.ReactNode | ((dataTarget: any) => React.ReactNode);
  onClick: (e: React.MouseEvent<HTMLButtonElement>, dataTarget: any) => void;
  className?: string;
}

export interface PaginationProps {
  pagination: PaginationState;
  onChange: (pagination: PaginationState) => void;
  loading?: boolean;
  className?: string;
}

// Modal props for QueryBuilder integration
export interface QueryBuilderModalProps {
  metadata: QueryMetadata;
  queryState: DataTableQueryState;
  onQueryStateChange: (state: DataTableQueryState) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
