import { Loader2 } from "lucide-react";
import React from "react";
import { APIManager } from "rjs-frame";
import { cn } from "../../lib/utils";
import {
  DataRow,
  DataTableProps,
  LoadingState,
  PaginationState,
} from "../../types/datatable";
import { QueryMetadata, QueryState, SortItem } from "../../types/querybuilder";
import { QueryBuilderModal } from "../querybuilder/QueryBuilderModal";
import { DataTableProvider } from "./DataTableContext";
import { Pagination } from "./Pagination";
import { TableControl } from "./TableControl";
import { TableFilter } from "./TableFilter";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { TableView } from "./TableView";

// Debounce hook helper
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = React.useCallback(
    (...args: Parameters<T>) => {
      if (!delay || delay <= 20) {
        callbackRef.current(...args);
        return;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  // cleanup on unmount or delay change
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay]);

  // Cast to original type
  return debouncedFn as T;
}

export const DataTable: React.FC<DataTableProps> = ({
  metadata: propMetadata,
  showHeaderFilters: propShowHeaderFilters = false,
  dataSource,
  queryState: propQueryState,
  pagination: propPagination,
  className,
  debug = false,
  debounceDelay = 0,
  actions,
}) => {
  // Internal state for data and metadata
  const [data, setData] = React.useState<DataRow[]>([]);
  const [metadata, setMetadata] = React.useState(propMetadata);
  const [loading, setLoading] = React.useState<LoadingState>({
    data: false,
    metadata: false,
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [showHeaderFilters, setShowHeaderFilters] = React.useState(
    propShowHeaderFilters
  );

  // Internal query state if not controlled
  const [internalQueryState, setInternalQueryState] =
    React.useState<QueryState>(() => ({
      query: [],
      sort: [],
      select: [],
      text: "",
      ...propQueryState,
    }));

  // Internal pagination state if not controlled
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>(() => ({
      page: 1,
      pageSize: 25,
      total: 0,
      ...propPagination,
    }));

  const setPagination = (newPagination: PaginationState) => {
    if (
      newPagination.page !== internalPagination.page ||
      newPagination.pageSize !== internalPagination.pageSize ||
      newPagination.total !== internalPagination.total
    ) {
      setInternalPagination(newPagination);
    }
  };

  const handleQueryStateChange = (newState: QueryState) => {
    setInternalQueryState(newState);
  };

  const handlePaginationChange = (newPagination: PaginationState) => {
    if (
      newPagination.page !== internalPagination.page ||
      newPagination.pageSize !== internalPagination.pageSize
    ) {
      debouncedFetchData(newPagination);
    }
  };

  // Fetch metadata
  const fetchMetadata = React.useCallback(async () => {
    if (!dataSource || propMetadata) return;

    setLoading((prev) => ({ ...prev, metadata: true }));
    try {
      const response = await APIManager.queryMeta(dataSource);
      const metadata = response.data;

      setMetadata(metadata);

      // Initialize query state with default values if not controlled
      if (!propQueryState && metadata) {
        const initialState: QueryState = {
          query: [],
          sort: parseSort(metadata.default_order || []),
          select: getDefaultSelect(metadata),
          text: "",
        };
        setInternalQueryState(initialState);
      }
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    } finally {
      setLoading((prev) => ({ ...prev, metadata: false }));
    }
  }, [dataSource, propMetadata, propQueryState]);

  // Fetch data (non-debounced)
  const fetchData = React.useCallback(
    async (pagination?: PaginationState) => {
      if (!dataSource) return;

      setLoading((prev) => ({ ...prev, data: true }));
      pagination = pagination || internalPagination;
      try {
        // Build query parameters from current state
        const queryParams = {
          page: pagination.page,
          limit: pagination.pageSize,
        };

        const response = await APIManager.query(dataSource, {
          search: queryParams,
        });

        if (response.data) {
          setData(response.data);
        }

        // Update pagination total if not controlled
        if (response.meta) {
          const meta = response.meta;
          setPagination({
            total: meta?.total_items || internalPagination.total,
            page: meta?.page_no || internalPagination.page,
            pageSize: meta?.limit || internalPagination.pageSize,
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, data: false }));
      }
    },
    [dataSource, internalQueryState]
  );

  // Create debounced versions of metadata and data fetchers
  const debouncedFetchMetadata = useDebouncedCallback(
    fetchMetadata,
    debounceDelay
  );
  const debouncedFetchData = useDebouncedCallback(fetchData, debounceDelay);

  // Initial fetch
  React.useEffect(() => {
    debouncedFetchMetadata();
  }, [debouncedFetchMetadata]);

  React.useEffect(() => {
    if (metadata) {
      debouncedFetchData();
    }
  }, [debouncedFetchData, metadata]);

  // Show loading if metadata is not available
  if (!metadata) {
    return (
      <div className={cn("dt-container", className)}>
        <div className="dt-loading">
          <Loader2 className="dt-loading-spinner" />
          <span className="dt-loading-text">Loading...</span>
        </div>
      </div>
    );
  }

  const PaginationComponent = Pagination;
  const TableControlComponent = TableControl;

  const contextValue = {
    data,
    metadata,
    loading,
    queryState: internalQueryState,
    setQueryState: setInternalQueryState,
    pagination: internalPagination,
    setPagination: setInternalPagination,
    fetchData: debouncedFetchData,
    fetchMetadata: debouncedFetchMetadata,
    debug,
    onQueryStateChange: handleQueryStateChange,
    onRefresh: () => debouncedFetchData(),
    openQueryBuilder: setModalOpen,
    onShowHeaderFiltersChange: setShowHeaderFilters,
    TableFilterComponent: TableFilter,
    TableHeaderComponent: TableHeader,
    TableRowComponent: TableRow,
    showHeaderFilters,
  };

  return (
    <DataTableProvider value={contextValue}>
      <div className={cn("dt-container", className)}>
        {/* Table Control */}
        <TableControlComponent actions={actions} />

        {/* Table View */}
        <TableView />

        {/* Pagination */}
        <PaginationComponent
          pagination={internalPagination}
          onChange={handlePaginationChange}
          loading={loading.data}
          selectedCount={internalQueryState.selectedItems?.length || 0}
          onClearSelection={() =>
            setInternalQueryState((prev) => ({ ...prev, selectedItems: [] }))
          }
        />

        {/* Query Builder Modal */}
        <QueryBuilderModal
          metadata={metadata}
          queryState={internalQueryState}
          onModalSubmit={handleQueryStateChange}
          open={modalOpen}
          onOpenChange={setModalOpen}
          showDebug={debug}
        />

        {debug && (
          <div className="dt-debug border-t">
            <h3 className="text-sm bg-yellow-300 font-medium p-3">
              DataTable State
            </h3>
            <pre className="bg-gray-100 border-t p-3 text-xs overflow-auto max-h-64">
              {JSON.stringify(
                {
                  queryState: internalQueryState,
                  pagination: internalPagination,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </DataTableProvider>
  );
};

// Helper functions for conversion from legacy string-based sort format
const parseSort = (sort: string[]): SortItem[] => {
  if (sort.length === 0) return [];
  return sort
    .map((sortStr) => {
      const [field, direction] = sortStr.split(".");
      return { field, direction: direction as "asc" | "desc" };
    })
    .filter((s) => s.field);
};

const getDefaultSelect = (metadata: QueryMetadata) => {
  return metadata.fields.filter((f) => !f.hidden).map((f) => f.name);
};
