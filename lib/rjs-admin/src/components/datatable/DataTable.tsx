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
import { QueryState } from "../../types/querybuilder";
import { Pagination } from "./Pagination";
import { TableControl } from "./TableControl";
import { TableView } from "./TableView";

export const DataTable: React.FC<DataTableProps> = ({
  data: propData,
  metadata: propMetadata,
  dataApi,
  queryState: propQueryState,
  onQueryStateChange,
  pagination: propPagination,
  onPaginationChange,
  customTableHeader,
  customTableRow,
  customPagination: CustomPagination,
  className,
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
    }));

  // Internal pagination state if not controlled
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>(() => ({
      page: 1,
      pageSize: 25,
      total: 0,
    }));

  // Use controlled or internal state
  const currentQueryState = propQueryState || internalQueryState;
  const currentPagination = propPagination || internalPagination;

  const handleQueryStateChange = React.useCallback(
    (newState: QueryState) => {
      if (onQueryStateChange) {
        onQueryStateChange(newState);
      } else {
        setInternalQueryState(newState);
      }
    },
    [onQueryStateChange]
  );

  const handlePaginationChange = React.useCallback(
    (newPagination: PaginationState) => {
      if (onPaginationChange) {
        onPaginationChange(newPagination);
      } else {
        setInternalPagination(newPagination);
      }
    },
    [onPaginationChange]
  );

  // Fetch metadata
  const fetchMetadata = React.useCallback(async () => {
    if (!dataApi || propMetadata) return;

    setLoading((prev) => ({ ...prev, metadata: true }));
    try {
      const response = await APIManager.queryMeta(dataApi);
      const metadata = response.data;

      setMetadata(metadata);

      // Initialize query state with default values if not controlled
      if (!propQueryState && metadata) {
        const initialState: QueryState = {
          query: [],
          sort: metadata.default_order || [],
          select: Object.keys(metadata.fields).filter(
            (key) => !metadata.fields[key]?.hidden
          ),
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
  const fetchData = React.useCallback(async () => {
    if (!dataApi || propData) return;

    setLoading((prev) => ({ ...prev, data: true }));
    try {
      // Build query parameters from current state
      const queryParams = {
        ...currentQueryState,
        page: currentPagination.page,
        pageSize: currentPagination.pageSize,
      };

      const response = await APIManager.query(dataApi, queryParams);

      if (response.data) {
        setData(response.data);
      }

      // Update pagination total if not controlled
      if (!propPagination) {
        setInternalPagination((prev) => ({
          ...prev,
          total:
            response.meta?.total ||
            (Array.isArray(response.data) ? response.data.length : 1),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, data: false }));
    }
  }, [dataApi, propData, currentQueryState, currentPagination, propPagination]);

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
        queryState={currentQueryState}
        onQueryStateChange={handleQueryStateChange}
        loading={loading.data || loading.metadata}
      />

      {/* Table View */}
      <TableView
        data={data}
        metadata={metadata}
        queryState={currentQueryState}
        onQueryStateChange={handleQueryStateChange}
        customTableHeader={customTableHeader}
        customTableRow={customTableRow}
      />

      {/* Pagination */}
      <PaginationComponent
        pagination={currentPagination}
        onChange={handlePaginationChange}
        loading={loading.data}
      />
    </div>
  );
};
