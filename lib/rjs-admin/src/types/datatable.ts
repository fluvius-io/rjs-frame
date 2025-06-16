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

  // Styling
  className?: string;
}

// Props for sub-components
export interface TableControlProps {
  metadata: QueryMetadata;
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  loading: boolean;
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
}

export interface TableHeaderProps {
  metadata: QueryMetadata;
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  className?: string;
}

export interface TableFilterProps {
  metadata: QueryMetadata;
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  className?: string;
}

export interface TableRowProps {
  row: DataRow;
  columns: ColumnConfig[];
  rowIndex: number;
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
  queryState: QueryState;
  onQueryStateChange: (state: QueryState) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
