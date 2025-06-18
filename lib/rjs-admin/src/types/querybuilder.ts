/**
 * QueryBuilder Types
 * Type definitions for the query builder component based on metadata format
 */

// Basic data types for validation
export type DataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "uuid"
  | "text";

// Input configuration for filters
export interface FilterInputConfig {
  type: "text" | "number" | "select" | "date" | "checkbox" | "textarea";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  [key: string]: any;
}

// Field metadata structure
export interface QueryFieldMetadata {
  label: string;
  name: string;
  desc?: string | null;
  noop: string; // default query operation
  hidden: boolean;
  sortable: boolean;
  /**
   * Relative ordering for the column; lower numbers appear earlier. Negative
   * values allowed. Defaults to 0 if omitted.
   */
  order?: number;
}

// Filter metadata structure
export interface QueryFilterMetadata {
  field: string;
  label: string;
  dtype: DataType;
  input: FilterInputConfig;
}

// Composite operator metadata
export interface QueryCompositeMetadata {
  label: string;
}

// Main query metadata structure
export interface QueryMetadata {
  name: string;
  title: string;
  desc: string;
  /**
   * List of field metadata objects. Each must have a unique `name` property.
   */
  fields: QueryFieldMetadata[];
  filters: Record<string, QueryFilterMetadata>;
  composites: Record<string, QueryCompositeMetadata>;
  default_order?: string[];
  idfield?: string;
}

// Query value types
export type QueryValue = string | number | boolean | string[] | number[];

// Query statement structure
export interface QueryStatement {
  [key: string]: QueryValue | QueryStatement | QueryStatement[];
}

// Query state structure (input/output of the component)
export interface QueryState {
  query?: FilterState[];
  sort?: SortItem[];
  select?: string[];
  search?: string;
  selectedItems?: string[];
}

// Props for FilterInput component
export interface FilterInputProps {
  operator: string;
  metadata: QueryFilterMetadata;
  value: QueryValue;
  onChange: (value: QueryValue) => void;
  customConfig?: FilterInputConfig;
  className?: string;
}

// Props for QueryBuilder component
export interface QueryBuilderProps {
  metadata: QueryMetadata;
  queryState?: QueryState;
  onModalSubmit?: (state: QueryState) => void;
  customInput?: Record<string, FilterInputConfig>;
  className?: string;
  showDebug?: boolean;
}

// Props for QueryBuilderModal component
export interface QueryBuilderModalProps extends QueryBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

// Filter state for managing individual filters
export interface FilterState {
  id: string;
  type: "field" | "composite";
  operator?: string;
  field?: string;
  value?: QueryValue;
  children?: FilterState[];
}

// Sort item for managing sort configuration
export interface SortItem {
  field: string;
  direction: "asc" | "desc";
}
