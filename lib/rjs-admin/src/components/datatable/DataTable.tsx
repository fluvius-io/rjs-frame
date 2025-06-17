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
import { Pagination } from "./Pagination";
import { TableControl } from "./TableControl";
import { TableView } from "./TableView";

export const DataTable: React.FC<DataTableProps> = ({
  data: propData,
  metadata: propMetadata,
  dataApi,
  queryState: propQueryState,
  pagination: propPagination,
  customTableHeader,
  customTableRow,
  customPagination: CustomPagination,
  className,
  debug = false,
}) => {
  // Internal state for data and metadata
  const [data, setData] = React.useState<DataRow[]>(propData || []);
  const [metadata, setMetadata] = React.useState(propMetadata);
  const [loading, setLoading] = React.useState<LoadingState>({
    data: false,
    metadata: false,
  });

  // Internal query state if not controlled
  const [internalQueryState, setInternalQueryState] =
    React.useState<QueryState>(() => ({
      query: [],
      sort: [],
      select: [],
      search: "",
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

  const handleQueryStateChange = (newState: QueryState) => {
    setInternalQueryState(newState);
  };

  const handlePaginationChange = (newPagination: PaginationState) => {
    if (
      newPagination.page !== internalPagination.page ||
      newPagination.pageSize !== internalPagination.pageSize
    ) {
      fetchData(newPagination);
    }
  };

  // Fetch metadata
  const fetchMetadata = React.useCallback(async () => {
    if (!dataApi || propMetadata) return;

    setLoading((prev) => ({ ...prev, metadata: true }));
    try {
      const response = await APIManager.queryMeta(dataApi);
      const metadata = response.data;

      setMetadata(metadata);

      // // Initialize query state with default values if not controlled
      if (!propQueryState && metadata) {
        const initialState: QueryState = {
          query: [],
          sort: parseSort(metadata.default_order || []),
          select: getDefaultSelect(metadata),
          search: "",
        };
        setInternalQueryState(initialState);
      }
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    } finally {
      setLoading((prev) => ({ ...prev, metadata: false }));
    }
  }, [dataApi, propMetadata, propQueryState]);

  // Fetch data
  const fetchData = React.useCallback(
    async (pagination?: PaginationState) => {
      if (!dataApi || propData) return;

      setLoading((prev) => ({ ...prev, data: true }));
      pagination = pagination || internalPagination;
      try {
        // Build query parameters from current state
        const queryParams = {
          page: pagination.page,
          limit: pagination.pageSize,
        };

        const response = await APIManager.query(dataApi, {
          search: queryParams,
        });

        if (response.data) {
          setData(response.data);
        }

        // Update pagination total if not controlled
        if (!propPagination) {
          const meta = response.meta;
          setInternalPagination((prev) => ({
            ...prev,
            total: meta?.total_items || 0,
            page: meta?.page_no || 1,
            pageSize: meta?.limit || 25,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, data: false }));
      }
    },
    [dataApi, internalQueryState]
  );

  // Initial fetch
  React.useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  React.useEffect(() => {
    if (metadata) {
      fetchData();
    }
  }, [fetchData, metadata]);

  // Update internal data when prop data changes
  React.useEffect(() => {
    if (propData) {
      setData(propData);
    }
  }, [propData]);

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

  const PaginationComponent = CustomPagination || Pagination;

  return (
    <div className={cn("dt-container", className)}>
      {/* Table Control */}
      <TableControl
        metadata={metadata}
        queryState={internalQueryState}
        onQueryStateChange={handleQueryStateChange}
        loading={loading.metadata}
        debug={debug}
      />

      {/* Table View */}
      <TableView
        data={data}
        metadata={metadata}
        queryState={internalQueryState}
        onQueryStateChange={handleQueryStateChange}
        customTableHeader={customTableHeader}
        customTableRow={customTableRow}
      />

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
  return Object.keys(metadata.fields).filter(
    (key) => !metadata.fields[key]?.hidden
  );
};
