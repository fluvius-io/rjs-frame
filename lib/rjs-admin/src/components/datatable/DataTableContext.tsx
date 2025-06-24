import React from "react";
import {
  DataRow,
  DataTableQueryState,
  DataTableSelectionState,
  LoadingState,
  PaginationState,
  TableFilterProps,
  TableHeaderProps,
  TableRowProps,
} from "../../types/datatable";
import { QueryMetadata } from "../../types/querybuilder";

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
}

export const DataTableContext =
  React.createContext<DataTableContextValue | null>(null);

export const useDataTable = () => {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return context;
};

