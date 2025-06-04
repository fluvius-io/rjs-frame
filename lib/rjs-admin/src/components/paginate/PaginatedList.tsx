import { Cross2Icon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import MetadataQueryBuilder from '../query-builder/MetadataQueryBuilder';
import { FrontendQuery } from '../query-builder/types';
import HeaderComponent from './HeaderComponent';
import PaginationControls from './PaginationControls';
import RowComponent from './RowComponent';
import { PaginatedListProps, SortConfig } from './types';

const PaginatedList: React.FC<PaginatedListProps> = (props) => {
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
    onSort,
    onFilter,
    onSearch,
    onPageChange,
    actions,
    className,
    metadata,
  } = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortConfig>();
  const [currentQuery, setCurrentQuery] = useState<FrontendQuery>({
    limit: pagination.pageSize,
    page: pagination.page,
  });

  // Handle metadata initialization
  useEffect(() => {
    if (metadata?.default_order && metadata.default_order.length > 0 && !currentSort) {
      const defaultOrder = metadata.default_order[0];
      const [field, direction] = defaultOrder.split(':');
      setCurrentSort({
        field,
        direction: direction === 'desc' ? 'desc' : 'asc'
      });
    }
  }, [metadata]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSort = (sort: SortConfig) => {
    setCurrentSort(sort);
    onSort?.(sort);
  };

  const handleQueryChange = useCallback((query: FrontendQuery) => {
    setCurrentQuery(query);
    
    // Convert FrontendQuery to the legacy FilterConfig format for backward compatibility
    if (query.query) {
      // Parse the query string into filter configs
      // For now, pass the raw query string - the parent component will handle the conversion
      onFilter?.({ query: query.query } as any);
    } else {
      onFilter?.([] as any);
    }
  }, [onFilter]);

  const hasActiveFilters = currentQuery.query && currentQuery.query.length > 0;

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
                      onClick={() => setShowFilterModal(true)}
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
                    <span className="text-sm text-blue-600 font-mono">{currentQuery.query}</span>
                  </div>
                  <button
                    onClick={() => handleQueryChange({ ...currentQuery, query: undefined })}
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
          {/* Background loading indicator - small and subtle */}
          {backgroundLoading && (
            <div className="absolute top-2 right-2 z-10">
              <div className="flex items-center gap-2 px-3 py-1 bg-background/90 border rounded-full text-xs text-muted-foreground">
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </div>
            </div>
          )}
          
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
          onPageChange={onPageChange}
          loading={loading || backgroundLoading}
        />
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Manage Filters</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <Cross2Icon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <MetadataQueryBuilder
                metadata={metadata}
                initialQuery={currentQuery}
                onQueryChange={handleQueryChange}
                title=""
                className="border-0 shadow-none"
                showFieldSelection={false}
                showSortRules={false}
                showFilterRules={true}
                showQueryDisplay={true}
              />
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowFilterModal(false)}
                className="inline-flex items-center px-3 py-1 text-sm border rounded bg-white hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="inline-flex items-center px-3 py-1 text-sm border rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaginatedList; 