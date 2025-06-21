import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import React from "react";
import { APIManager } from "rjs-frame";
import { cn, queryStateToApiParams } from "../../lib/utils";
import {
  DataRow,
  DataTableProps,
  DataTableQueryState,
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
  showHeaderTitle: propShowHeaderTitle = true,
  allowSelection: propAllowSelection = true,
  resourceName,
  queryState: propQueryState,
  pagination: propPagination,
  className,
  debug = false,
  debounceDelay = 0,
  actions,
  onActivate,
}) => {
  // Internal state for data and metadata
  const [data, setData] = React.useState<DataRow[]>([]);
  const [metadata, setMetadata] = React.useState(propMetadata);
  const [loading, setLoading] = React.useState<LoadingState>({
    data: "initializing",
    meta: "initializing",
  });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [showHeaderFilters, setShowHeaderFilters] = React.useState(
    propShowHeaderFilters
  );

  // Internal query state if not controlled
  const [internalQueryState, setInternalQueryState] =
    React.useState<DataTableQueryState>(() => ({
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
      limit: 25,
      total: 0,
      ...propPagination,
    }));

  const setPagination = (newPagination: PaginationState) => {
    if (
      newPagination.page !== internalPagination.page ||
      newPagination.limit !== internalPagination.limit ||
      newPagination.total !== internalPagination.total
    ) {
      setInternalPagination(newPagination);
    }
  };

  const handleQueryStateChange = (newState: Partial<DataTableQueryState>) => {
    setInternalQueryState((prev) => ({ ...prev, ...newState }));
  };

  const handlePaginationChange = (newPagination: PaginationState) => {
    if (
      newPagination.page !== internalPagination.page ||
      newPagination.limit !== internalPagination.limit
    ) {
      debouncedFetchData(newPagination);
    }
  };

  // Fetch metadata
  const fetchMetadata = React.useCallback(async () => {
    if (!resourceName || propMetadata) return;

    if (loading.meta === false) {
      setLoading((prev) => ({ ...prev, meta: true }));
    }
    try {
      const response = await APIManager.queryMeta(resourceName);
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
      setLoading((prev) => ({ ...prev, meta: false }));
    }
  }, [resourceName, propMetadata, propQueryState]);

  // Fetch data (non-debounced)
  const fetchData = React.useCallback(
    async (pagination?: PaginationState) => {
      if (!resourceName) return;

      if (loading.data === false) {
        setLoading((prev) => ({ ...prev, data: true }));
      }
      pagination = pagination || internalPagination;
      try {
        // Build query parameters from current state
        const apiParams = queryStateToApiParams(internalQueryState);
        const urlParams = {
          search: {
            page: pagination.page,
            limit: pagination.limit,
            ...apiParams,
          },
        };

        const response = await APIManager.query(resourceName, urlParams);

        if (response.data) {
          setData(response.data);
        }

        // Update pagination total if not controlled
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, data: false }));
      }
    },
    [resourceName, internalQueryState]
  );

  // Create debounced versions of metadata and data fetchers
  const debouncedFetchMetadata = useDebouncedCallback(
    fetchMetadata,
    debounceDelay
  );
  const debouncedFetchData = useDebouncedCallback(fetchData, debounceDelay);

  const handleActivate = (id: string, row: DataRow) => {
    handleQueryStateChange({ activeItem: id });
    onActivate?.(id, row);
  };

  // Initial fetch
  React.useEffect(() => {
    debouncedFetchMetadata();
  }, [debouncedFetchMetadata]);

  React.useEffect(() => {
    if (metadata) {
      debouncedFetchData();
    }
  }, [debouncedFetchData, metadata]);

  const clearSelection = () => {
    handleQueryStateChange({ selectedItems: [] });
  };

  if (loading.meta === "initializing" || loading.data === "initializing") {
    return (
      <div className={cn("dt-container", className)}>
        <div className="dt-loading">
          <Loader2 className="dt-loading-spinner" />
          <span className="dt-loading-text">Loading...</span>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="dt-empty">
        <div className="flex flex-col items-center">
          <AlertCircle className="dt-empty-icon text-orange-300" />
          <div className="dt-empty-text">No metadata available</div>
          <div className="dt-empty-subtext">
            The resource name is not valid or the metadata is not available.
          </div>
        </div>
      </div>
    );
  }

  const PaginationComponent = Pagination;
  const TableControlComponent = TableControl;

  const contextValue = {
    data,
    debug,
    metadata,
    loading,
    queryState: internalQueryState,
    pagination: internalPagination,
    fetchData: debouncedFetchData,
    fetchMetadata: debouncedFetchMetadata,
    onQueryStateChange: handleQueryStateChange,
    onRefresh: () => debouncedFetchData(),
    openQueryBuilder: setModalOpen,
    onShowHeaderFiltersChange: setShowHeaderFilters,
    onActivate: handleActivate,
    TableFilterComponent: TableFilter,
    TableHeaderComponent: TableHeader,
    TableRowComponent: TableRow,
    showHeaderFilters,
    showHeaderTitle: propShowHeaderTitle,
  };

  const renderSelectionBanner = () => {
    const selectedItems = internalQueryState.selectedItems || [];
    if (!propAllowSelection || selectedItems.length === 0) return null;
    return (
      <div
        className="dt-selection-header border-t-1"
        style={{
          backgroundColor: "var(--rjs-warning-border)",
          color: "var(--rjs-warning-foreground)",
        }}
      >
        <span className="flex items-center border-b-1 text-sm gap-1 p-3">
          {selectedItems.length.toLocaleString()} entries selected
          <button
            type="button"
            onClick={clearSelection}
            title="Clear selection"
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </button>
        </span>
      </div>
    );
  };

  return (
    <DataTableProvider value={contextValue}>
      <div className={cn("dt-container", className)}>
        <TableControlComponent actions={actions} />

        <TableView />
        {renderSelectionBanner()}
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
        {modalOpen && (
          <QueryBuilderModal
            metadata={metadata}
            queryState={internalQueryState}
            onModalSubmit={handleQueryStateChange}
            open={modalOpen}
            onOpenChange={setModalOpen}
            showDebug={debug}
          />
        )}

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

DataTable.displayName = "DataTable";
