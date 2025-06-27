import { Filter, SidebarClose, SidebarOpen } from "lucide-react";
import React, { useState } from "react";
import { updatePageParams, usePageContext } from "rjs-frame";
import { cn } from "../../lib/utils";
import { TableControlProps } from "../../types/datatable";
import { renderActions } from "./DataTable";
import { useDataTable } from "./DataTableContext";

export const TableControl: React.FC<TableControlProps> = ({ className }) => {
  const {
    data,
    metadata,
    queryState,
    onQueryStateChange,
    openQueryBuilder,
    controlTitle,
    controlDescription,
    tableActions,
  } = useDataTable();
  const pageContext = usePageContext();
  const [showSidebar, setShowSidebar] = useState(
    pageContext.pageParams.sidebar
  );

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
          <span className="dt-status-label bg-yellow-100 text-yellow-800">
            {activeFiltersCount} Filter
            {activeFiltersCount !== 1 ? "s" : ""}
          </span>
        )}
        {activeSortCount > 0 && (
          <span className="dt-status-label bg-green-100 text-green-800">
            {activeSortCount} Sort{activeSortCount !== 1 ? "s" : ""}
          </span>
        )}
        {hasActiveSearch && (
          <span className="dt-status-label bg-blue-100 text-blue-800">
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
  const toggleSidebar = () => {
    const newShowSidebar = !showSidebar;
    setShowSidebar(newShowSidebar);
    updatePageParams({
      sidebar: newShowSidebar,
    });
  };

  const title = controlTitle || metadata.title || "";
  const description = controlDescription || metadata.desc || "";

  return (
    <div className={cn("dt-control", className)}>
      <div className="dt-control-body">
        <div className="dt-control-title">
          <div>
            {showSidebar ? (
              <SidebarClose
                className="w-6 h-6 cursor-pointer"
                onClick={toggleSidebar}
              />
            ) : (
              <SidebarOpen
                className="w-6 h-6 cursor-pointer"
                onClick={toggleSidebar}
              />
            )}
          </div>
          <div className="flex flex-col gap-0">
            <h2>{camelCaseToWords(title)}</h2>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </div>
        <div className="dt-control-actions">
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
            {renderStatuses()}
          </button>
          {tableActions && tableActions.length > 0 && (
            <div className="border-l-2 border-gray-300 pl-2 dt-user-actions">
              {renderActions(tableActions, data)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
