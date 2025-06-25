import React from "react";
import { DataTableContextValue } from "../../types/datatable";

export const DataTableContext =
  React.createContext<DataTableContextValue | null>(null);

export const useDataTable = () => {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within a DataTableProvider");
  }
  return context;
};
