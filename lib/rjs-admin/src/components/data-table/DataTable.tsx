import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import QueryBuilderModal from "../query-builder/QueryBuilderModal";
import {
  fromResourceQuery,
  QueryBuilderState,
  ResourceQuery,
  toResourceQuery,
} from "../query-builder/types";
import HeaderComponent from "./HeaderComponent";
import PaginationControls from "./PaginationControls";
import RowComponent from "./RowComponent";
import type { DataTableProps, SortConfig } from "./types";

const TableLoadingOverlay: React.FC<{ loading: boolean }> = ({
  loading = false,
}) =>
  loading && (
    <div className="table-loading-overlay">
      <div className="table-loading-overlay__content">
        <div className="table-loading-overlay__spinner"></div>
        Loading...
      </div>
    </div>
  );

const DataTable: React.FC<DataTableProps> = (props) => {
  const {
    data,
    pagination,
    loading = false,
    backgroundLoading = false,
    title,
    subtitle,
    showSearch = false,
    showFilters = false,
    searchPlaceholder = "Search...",
    onQueryChange,
    onPageChange,
    actions,
    className,
    metadata,
  } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortConfig>();

  // Current query state (without pagination)
  const [queryState, setQueryState] = useState<
    ResourceQuery & { searchQuery?: string }
  >({
    select: [],
    sort: [],
    query: undefined,
    searchQuery: undefined,
  });

  // Handle metadata initialization
  useEffect(() => {
    if (
      metadata?.default_order &&
      metadata.default_order.length > 0 &&
      !currentSort
    ) {
      const defaultOrder = metadata.default_order[0];
      const [field, direction] = defaultOrder.split(":");
      const newSort = {
        field,
        direction: direction === "desc" ? "desc" : "asc",
      } as SortConfig;
      setCurrentSort(newSort);

      // Initialize with default sort
      const initialQuery = {
        ...queryState,
        sort: [`${field}:${direction}`],
      };
      setQueryState(initialQuery);
    }
  }, [metadata, queryState]);

  // Helper function to send query update
  const sendQueryUpdate = useCallback(
    (updates: Partial<ResourceQuery & { searchQuery?: string }>) => {
      const newQuery = {
        ...queryState,
        ...updates,
      };
      setQueryState(newQuery);
      onQueryChange?.(newQuery);
    },
    [queryState, onQueryChange]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    sendQueryUpdate({
      searchQuery: query || undefined,
    });
  };

  const handleSort = (sort: SortConfig) => {
    setCurrentSort(sort);
    sendQueryUpdate({
      sort: [`${sort.field}:${sort.direction}`],
    });
  };

  // Handle filter modal apply - convert QueryBuilderState to ResourceQuery
  const handleFilterApply = useCallback(
    (queryBuilderState: QueryBuilderState) => {
      const resourceQuery = toResourceQuery(queryBuilderState);
      sendQueryUpdate({
        query: resourceQuery.query,
        sort: resourceQuery.sort,
      });
      // Reset to first page on filter changes
      onPageChange?.(1, pagination.pageSize);
    },
    [sendQueryUpdate, pagination.pageSize, onPageChange]
  );

  // Handle filter modal close
  const handleFilterClose = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  // Open filter modal
  const openFilterModal = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  // Handle pagination changes
  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      onPageChange?.(page, pageSize);
    },
    [onPageChange]
  );

  // Convert current state to QueryBuilderState for the modal
  const currentQueryBuilderState = useMemo((): QueryBuilderState => {
    return fromResourceQuery({
      select: queryState.select,
      sort: queryState.sort,
      query: queryState.query,
    });
  }, [queryState]);

  // Get current filter query string for display
  const currentFilterQuery = queryState.query;
  const hasActiveFilters = currentFilterQuery && currentFilterQuery.length > 0;

  // Show loading state while fetching metadata
  if (!metadata) {
    return (
      <div className={cn("data-table data-table--loading", className)}>
        <div className="data-table__loading-message">
          <div className="data-table__loading-text">Loading metadata...</div>
        </div>
      </div>
    );
  }

  const hasFilters =
    metadata.operators &&
    Object.values(metadata.operators).some((param) => param.field_name !== "");

  return (
    <>
      <div className={cn("data-table", className)}>
        {/* Header Section */}
        {(title || subtitle || actions || showSearch || showFilters) && (
          <div className="data-table__header">
            <div className="data-table__header-row">
              <div className="data-table__header-titles">
                {title && <h2 className="data-table__title">{title}</h2>}
                {subtitle && <p className="data-table__subtitle">{subtitle}</p>}
              </div>
              <div className="data-table__actions">{actions}</div>
            </div>

            {(showSearch || showFilters) && (
              <div className="data-table__search-filter-row">
                {showSearch && (
                  <div className="data-table__search">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                      className="data-table__search-input"
                    />
                  </div>
                )}

                {showFilters && hasFilters && (
                  <div className="data-table__filters">
                    <button
                      onClick={openFilterModal}
                      className={cn(
                        "data-table__filters-btn",
                        hasActiveFilters
                          ? "data-table__filters-btn--active"
                          : "data-table__filters-btn--inactive"
                      )}
                    >
                      <MixerHorizontalIcon className="data-table__filters-icon" />
                      Filters
                      {hasActiveFilters && (
                        <span className="data-table__filters-active">
                          Active
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="data-table__active-filters">
                <div className="data-table__active-filters-row">
                  <div className="data-table__active-filters-labels">
                    <span className="data-table__active-filters-label">
                      Active Filters:
                    </span>
                    <span className="data-table__active-filters-query">
                      {currentFilterQuery}
                    </span>
                  </div>
                  <button
                    onClick={() => sendQueryUpdate({ query: undefined })}
                    className="data-table__active-filters-clear"
                    title="Clear all filters"
                  >
                    <Cross2Icon className="data-table__active-filters-icon" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="relative">
          {/* Full loading overlay - only for initial loads */}
          <TableLoadingOverlay loading={loading} />

          <div className="overflow-x-auto">
            <table className="w-full">
              <HeaderComponent
                metadata={metadata}
                sort={currentSort}
                onSort={handleSort}
              />
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        metadata?.fields
                          ? Object.keys(metadata.fields).length
                          : 1
                      }
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {loading ? "Loading..." : "No data available"}
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <RowComponent
                      key={index}
                      metadata={metadata}
                      data={row}
                      index={index}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <PaginationControls
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading || backgroundLoading}
        />
      </div>

      {/* Filter Modal */}
      <QueryBuilderModal
        isOpen={showFilterModal}
        metadata={metadata}
        currentQuery={currentQueryBuilderState}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
      />
    </>
  );
};

export default DataTable;
