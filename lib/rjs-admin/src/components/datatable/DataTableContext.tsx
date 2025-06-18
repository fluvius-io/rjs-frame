import React from "react";
import { DataRow, LoadingState, PaginationState } from "../../types/datatable";
import { QueryMetadata, QueryState } from "../../types/querybuilder";

export interface DataTableContextValue {
  data: DataRow[];
  metadata: QueryMetadata | null;
  loading: LoadingState;
  queryState: QueryState;
  setQueryState: (
    state: QueryState | ((prev: QueryState) => QueryState)
  ) => void;
  pagination: PaginationState;
  setPagination: (state: PaginationState) => void;
  fetchData: () => Promise<void>;
  fetchMetadata: () => Promise<void>;
  debug?: boolean;
  onQueryStateChange: (state: QueryState) => void;
  onRefresh: () => void;
  openQueryBuilder: (open: boolean) => void;
  onShowHeaderFiltersChange: (show: boolean) => void;
  showHeaderFilters: boolean;
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
