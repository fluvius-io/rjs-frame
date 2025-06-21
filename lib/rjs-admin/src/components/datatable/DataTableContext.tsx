import React from "react";
import {
  DataRow,
  DataTableQueryState,
  LoadingState,
  PaginationState,
  TableFilterProps,
  TableHeaderProps,
  TableRowProps,
} from "../../types/datatable";
import { QueryMetadata } from "../../types/querybuilder";

export interface DataTableContextValue {
  data: DataRow[];
  metadata: QueryMetadata | null;
  loading: LoadingState;
  queryState: DataTableQueryState;
  pagination: PaginationState;
  fetchData: () => Promise<void>;
  fetchMetadata: () => Promise<void>;
  debug?: boolean;
  onQueryStateChange: (state: Partial<DataTableQueryState>) => void;
  onActivate: (id: string, row: DataRow) => void;
  onRefresh: () => void;
  openQueryBuilder: (open: boolean) => void;
  onShowHeaderFiltersChange: (show: boolean) => void;
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

export const DataTableProvider: React.FC<{
  value: DataTableContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <DataTableContext.Provider value={value}>
      {children}
    </DataTableContext.Provider>
  );
};
