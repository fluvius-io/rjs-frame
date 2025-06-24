import { Filter, SidebarClose, SidebarOpen } from "lucide-react";
import React, { useState } from "react";
import { updatePageParams, usePageContext } from "rjs-frame";
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
    openQueryBuilder,
    showHeaderTitle,
    controlTitle,
    controlDescription,
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
      {showHeaderTitle && (
        <div className="dt-control-header">
          <div>
            <h2 className="dt-control-title">{title}</h2>
            {description && (
              <p className="text-sm text-gray-500 text-nowrap text-ellipsis overflow-hidden">
                {description}
              </p>
            )}
          </div>
          {renderStatuses()}
        </div>
      )}
      <div className="dt-control-body">
        <div className="dt-control-actions">
          {!showHeaderTitle && (
            <div className="flex gap-2 w-full items-center">
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
              <div className="flex flex-col gap-0 -mt-1">
                <h2 className="dt-control-title">{camelCaseToWords(title)}</h2>
                <div className="text-sm text-gray-500 text-nowrap text-ellipsis overflow-hidden">
                  {description}
                </div>
              </div>
            </div>
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
        </div>
        {actions && (
          <div className="dt-control-actions justify-end">{actions}</div>
        )}
      </div>
    </div>
  );
};
