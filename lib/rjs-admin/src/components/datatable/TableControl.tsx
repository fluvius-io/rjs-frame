import { Filter, RefreshCw } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { TableControlProps } from "../../types/datatable";
import { useDataTable } from "./DataTableContext";

export const TableControl: React.FC<TableControlProps> = ({
  className,
  actions,
}) => {
  const {
    metadata,
    queryState,
    onQueryStateChange,
    onRefresh,
    openQueryBuilder,
    loading,
    showHeaderTitle,
  } = useDataTable();

  if (!metadata) {
    return null;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryStateChange({
      ...queryState,
      text: e.target.value,
    });
  };
  // Count active filters
  const activeFiltersCount = queryState.query?.length || 0;
  const activeSortCount = queryState.sort?.length || 0;
  const hasActiveSearch = Boolean(queryState.text?.trim());
  const renderStatuses = () => {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {activeFiltersCount > 0 && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
            {activeFiltersCount} Filter
            {activeFiltersCount !== 1 ? "s" : ""}
          </span>
        )}
        {activeSortCount > 0 && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            {activeSortCount} Sort{activeSortCount !== 1 ? "s" : ""}
          </span>
        )}
        {hasActiveSearch && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Search: "{queryState.text}"
          </span>
        )}
      </div>
    );
  };
  const camelCaseToWords = (s: string) => {
    const result = s.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };
  return (
    <div className={cn("dt-control", className)}>
      {showHeaderTitle && (
        <div className="dt-control-header">
          <div>
            <h2 className="dt-control-title">{metadata.title}</h2>
            {metadata.desc && (
              <p className="text-sm text-gray-500 mt-1">{metadata.desc}</p>
            )}
          </div>
          {renderStatuses()}
        </div>
      )}
      <div className="dt-control-body">
        <div className="dt-control-actions">
          {!showHeaderTitle && (
            <h2 className="dt-control-title">
              {camelCaseToWords(metadata.title)}
            </h2>
          )}
          <input
            type="text"
            placeholder="Search..."
            value={queryState.text || ""}
            onChange={handleSearchChange}
            className="dt-search-box"
          />
          <button
            className="dt-query-builder-trigger"
            onClick={() => openQueryBuilder(true)}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button
            className="dt-query-builder-trigger"
            onClick={onRefresh}
            disabled={loading.data !== false || loading.meta !== false}
          >
            <RefreshCw
              className={cn("h-4 w-4", {
                "animate-spin":
                  loading.data !== false || loading.meta !== false,
              })}
            />
            <span>Refresh</span>
          </button>
        </div>
        <div className="flex flex-col items-end gap-2">
          {actions && (
            <div className="dt-control-actions justify-end">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
};
