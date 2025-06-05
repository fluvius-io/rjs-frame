import { Cross2Icon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import QueryBuilderModal from '../query-builder/QueryBuilderModal';
import { fromResourceQuery, QueryBuilderState, ResourceQuery, toResourceQuery } from '../query-builder/types';
import HeaderComponent from './HeaderComponent';
import PaginationControls from './PaginationControls';
import RowComponent from './RowComponent';
import type { DataTableProps, SortConfig } from './types';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortConfig>();
  
  // Current query state (without pagination)
  const [queryState, setQueryState] = useState<ResourceQuery & { searchQuery?: string }>({
    select: [],
    sort: [],
    query: undefined,
    searchQuery: undefined,
  });

  // Handle metadata initialization
  useEffect(() => {
    if (metadata?.default_order && metadata.default_order.length > 0 && !currentSort) {
      const defaultOrder = metadata.default_order[0];
      const [field, direction] = defaultOrder.split(':');
      const newSort = {
        field,
        direction: direction === 'desc' ? 'desc' : 'asc'
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
  const sendQueryUpdate = useCallback((updates: Partial<ResourceQuery & { searchQuery?: string }>) => {
    const newQuery = {
      ...queryState,
      ...updates,
    };
    setQueryState(newQuery);
    onQueryChange?.(newQuery);
  }, [queryState, onQueryChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    sendQueryUpdate({ 
      searchQuery: query || undefined
    });
  };

  const handleSort = (sort: SortConfig) => {
    setCurrentSort(sort);
    sendQueryUpdate({ 
      sort: [`${sort.field}:${sort.direction}`]
    });
  };

  // Handle filter modal apply - convert QueryBuilderState to ResourceQuery
  const handleFilterApply = useCallback((queryBuilderState: QueryBuilderState) => {
    const resourceQuery = toResourceQuery(queryBuilderState);
    sendQueryUpdate({ 
      query: resourceQuery.query,
      sort: resourceQuery.sort
    });
    // Reset to first page on filter changes
    onPageChange?.(1, pagination.pageSize);
  }, [sendQueryUpdate, pagination.pageSize, onPageChange]);

  // Handle filter modal close
  const handleFilterClose = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  // Open filter modal
  const openFilterModal = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  // Handle pagination changes
  const handlePageChange = useCallback((page: number, pageSize: number) => {
    onPageChange?.(page, pageSize);
  }, [onPageChange]);

  // Convert current state to QueryBuilderState for the modal
  const currentQueryBuilderState = useMemo((): QueryBuilderState => {
    return fromResourceQuery({
      select: queryState.select,
      sort: queryState.sort,
      query: queryState.query
    });
  }, [queryState]);

  // Get current filter query string for display
  const currentFilterQuery = queryState.query;
  const hasActiveFilters = currentFilterQuery && currentFilterQuery.length > 0;

  // Show loading state while fetching metadata
  if (!metadata) {
    return (
      <div className={cn("bg-background border rounded-lg shadow-sm", className)}>
        <div className="p-8 text-center">
          <div className="text-sm text-muted-foreground">Loading metadata...</div>
        </div>
      </div>
    );
  }

  const hasFilters = metadata.operators && Object.values(metadata.operators).some(param => param.field_name !== '');

  return (
    <>
      <div className={cn("bg-background border rounded-lg shadow-sm", className)}>
        {/* Header Section */}
        {(title || subtitle || actions || showSearch || showFilters) && (
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div>
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                {actions}
              </div>
            </div>

            {(showSearch || showFilters) && (
              <div className="flex items-center gap-4">
                {showSearch && (
                  <div className="flex-1 max-w-sm">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                      className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                    />
                  </div>
                )}

                {showFilters && hasFilters && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openFilterModal}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 text-sm border rounded font-medium",
                        hasActiveFilters 
                          ? "bg-blue-100 border-blue-300 text-blue-700" 
                          : "bg-white hover:bg-gray-50"
                      )}
                    >
                      <MixerHorizontalIcon className="w-4 h-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-1 px-1.5 py-0.5 bg-blue-200 text-blue-800 text-xs rounded-full">
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
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-700">Active Filters:</span>
                    <span className="text-sm text-blue-600 font-mono">{currentFilterQuery}</span>
                  </div>
                  <button
                    onClick={() => sendQueryUpdate({ query: undefined })}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                    title="Clear all filters"
                  >
                    <Cross2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="relative">
          {/* Full loading overlay - only for initial loads */}
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Loading...
                    </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <HeaderComponent metadata={metadata} sort={currentSort} onSort={handleSort} />
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={metadata?.fields ? Object.keys(metadata.fields).length : 1}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {loading ? 'Loading...' : 'No data available'}
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