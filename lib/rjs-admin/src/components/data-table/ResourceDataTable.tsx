import React from "react";
import { APIManager } from "rjs-frame";
import { cn } from "../../lib/utils";
import { Button } from "../common/Button";
import { ResourceQuery, toResourceQuery } from "../query-builder/types";
import { DataTable } from "./DataTable";
import HeaderComponent from "./HeaderComponent";
import RowComponent from "./RowComponent";
import type { DataTableProps, PaginationConfig, SortConfig } from "./types";

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

/**
 * A convenience component that extends DataTable and fetches both metadata and data from API endpoints
 * This demonstrates the complete workflow of using API-driven metadata
 */
export class ResourceDataTable extends DataTable {
  private currentRequestRef: AbortController | null = null;
  private isInitialLoadRef: boolean = true;
  private previousDataRef: Array<Record<string, any>> = [];
  private previousPaginationRef: PaginationConfig;
  private previousQueryRef: ResourceQuery & { searchQuery?: string };

  constructor(props: DataTableProps) {
    // Create DataTable props with placeholder values for initial super() call
    const dataTableProps: DataTableProps = {
      ...props,
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      metadata: props.metadata || {
        fields: {},
        operators: {},
        sortables: [],
        default_order: [],
      },
      loading: false,
      backgroundLoading: false,
      error: null,
    };

    super(dataTableProps);

    // Override state with ResourceDataTable specific initial state
    this.state = {
      ...this.state,
      data: [],
      metadata: props.metadata || null,
      loading: false,
      backgroundLoading: false,
      error: null,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    };

    this.previousPaginationRef = this.state.pagination;
    this.previousQueryRef = this.state.queryState;
  }

  componentDidMount() {
    if (!this.state.metadata) {
      this.fetchMetadata();
    } else {
      this.initializeDefaultSort();
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps: DataTableProps) {
    // Type assertion for resource props
    const currentResourceProps = this.props as unknown as DataTableProps;
    const prevResourceProps = prevProps as unknown as DataTableProps;

    // Check if dataApi changed
    if (prevResourceProps.dataApi !== currentResourceProps.dataApi) {
      this.fetchMetadata();
      return;
    }

    // Call parent componentDidUpdate
    super.componentDidUpdate(prevProps);

    // Check pagination changes
    if (this.state.metadata) {
      const prevPagination = this.previousPaginationRef;
      const currentPagination = this.state.pagination;

      if (
        prevPagination.page !== currentPagination.page ||
        prevPagination.pageSize !== currentPagination.pageSize
      ) {
        console.log(
          "🔄 ResourceDataTable: Fetching data due to pagination change"
        );
        this.fetchData();
      }

      this.previousPaginationRef = currentPagination;
    }

    // Check query changes
    if (this.state.metadata) {
      const prevQuery = this.previousQueryRef;
      const currentQuery = this.state.queryState;

      if (
        prevQuery.query !== currentQuery.query ||
        prevQuery.searchQuery !== currentQuery.searchQuery ||
        JSON.stringify(prevQuery.sort) !== JSON.stringify(currentQuery.sort)
      ) {
        console.log("🔄 ResourceDataTable: Fetching data due to query change");

        // Reset pagination to page 1 when filter/search/sort changes
        this.setState({ pagination: { ...this.state.pagination, page: 1 } });
        this.fetchData();
      }

      this.previousQueryRef = currentQuery;
    }
  }

  componentWillUnmount() {
    // Cancel any pending requests
    if (this.currentRequestRef) {
      this.currentRequestRef.abort();
    }
  }

  // Override initializeDefaultSort to use state.metadata instead of props.metadata
  protected initializeDefaultSort = () => {
    const { metadata } = this.state;
    const { currentSort, queryState } = this.state;

    if (
      metadata?.default_order &&
      metadata.default_order.length > 0 &&
      !currentSort
    ) {
      const defaultOrder = metadata.default_order[0];
      const [field, direction] = defaultOrder.split(".");
      const newSort = {
        field,
        direction: direction === "desc" ? "desc" : "asc",
      } as SortConfig;

      // Initialize with default sort
      const initialQuery = {
        ...queryState,
        sort: [`${field}.${direction}`],
      };

      this.setState({
        currentSort: newSort,
        queryState: initialQuery,
      });
    }
  };

  // Override sendQueryUpdate to handle data fetching internally
  protected sendQueryUpdate = (
    updates: Partial<ResourceQuery & { searchQuery?: string }>
  ) => {
    const newQuery = {
      ...this.state.queryState,
      ...updates,
    };
    this.setState({ queryState: newQuery });
    // Handle data fetching internally instead of calling onQueryChange
  };

  // Override handleFilterApply to reset pagination
  protected handleFilterApply = (queryBuilderState: any) => {
    const resourceQuery = toResourceQuery(queryBuilderState);
    this.sendQueryUpdate({
      query: resourceQuery.query,
      sort: resourceQuery.sort,
    });
    // Reset to first page on filter changes
    this.setState({
      pagination: { ...this.state.pagination, page: 1 },
    });
  };

  // Override handlePageChange to update internal state
  protected handlePageChange = (page: number, pageSize: number) => {
    this.setState({
      pagination: { ...this.state.pagination, page, pageSize },
    });
  };

  // Fetch metadata from API
  private fetchMetadata = async () => {
    if (this.props.dataApi === undefined || this.props.dataApi === "") {
      this.setError("No dataApi provided");
      return;
    }

    this.setLoading(true);

    try {
      let metadataResult = await APIManager.queryMeta(this.props.dataApi!);
      this.setState({ metadata: metadataResult.data });
      // Initialize default sort after metadata is loaded
      this.initializeDefaultSort();

      // Fetch initial data after metadata is loaded
      this.fetchData();
    } catch (error) {
      this.setError(
        error instanceof Error ? error.message : "Failed to fetch metadata"
      );
    } finally {
      this.setLoading(false);
    }
  };

  private buildSearchParams = (
    query: ResourceQuery & { searchQuery?: string }
  ) => {
    const params: Record<string, any> = {
      page: this.state.pagination.page.toString(),
      limit: this.state.pagination.pageSize.toString(),
    };

    // Add sort parameters from ResourceQuery
    if (query.sort && query.sort.length > 0) {
      params.sort = query.sort[0]; // Take the first sort rule
    }

    // Add search query if provided
    if (query.searchQuery) {
      params.search = query.searchQuery;
    }

    // Add filter query from ResourceQuery
    if (query.query) {
      params.q = query.query;
    }

    return params;
  };

  // Fetch data from API using ResourceQuery
  private fetchData = async () => {
    if (this.props.dataApi === undefined || this.props.dataApi === "") {
      this.setError("No dataApi provided");
      return;
    }

    // Cancel previous request if still in progress
    if (this.currentRequestRef) {
      this.currentRequestRef.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    this.currentRequestRef = abortController;

    // Determine loading state: initial load shows full loading, subsequent loads show background loading
    const isInitialLoad = this.isInitialLoadRef;
    if (isInitialLoad) {
      this.setLoading(true);
      this.isInitialLoadRef = false;
    } else {
      this.setBackgroundLoading(true);
    }

    try {
      const params = this.buildSearchParams(this.state.queryState);

      const result = await APIManager.query(this.props.dataApi!, {
        search: params,
      });

      // Handle different response formats
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format: " + JSON.stringify(result));
      }

      // Check for meta object format: { data: [...], meta: { total_items, page_no, limit, ... } }
      this.setState({
        data: result.data,
        pagination: {
          ...this.state.pagination,
          page: result.meta?.page_no || this.state.pagination.page,
          pageSize: result.meta?.limit || this.state.pagination.pageSize,
          total: result.meta?.total_items || result.data.length,
        },
        error: null,
      });
    } catch (error) {
      console.error("❌ ResourceDataTable: Failed to fetch data:", error);
      console.error("❌ ResourceDataTable: Data fetch error details:", {
        dataApi: this.props.dataApi,
        pagination: this.state.pagination,
        query: this.state.queryState,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      this.setError(
        error instanceof Error ? error.message : "Failed to fetch data"
      );
    } finally {
      this.setLoading(false);
      this.setBackgroundLoading(false);
      this.currentRequestRef = null;
    }
  };

  // Override render methods to use state instead of props
  protected renderError = () => {
    const { metadata, error } = this.state;
    return (
      <tbody>
        <tr>
          <td
            colSpan={metadata?.fields ? Object.keys(metadata.fields).length : 1}
            className="px-4 py-8 text-center text-muted-foreground"
          >
            {error}
          </td>
        </tr>
      </tbody>
    );
  };

  protected renderBody = () => {
    const { data, metadata, loading } = this.state;

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={metadata?.fields ? Object.keys(metadata.fields).length : 1}
            className="px-4 py-8 text-center text-muted-foreground"
          >
            {loading ? "Loading..." : "No data available"}
          </td>
        </tr>
      );
    }

    return data.map((row, index) => (
      <RowComponent key={index} metadata={metadata} data={row} index={index} />
    ));
  };

  protected renderTableHeader = () => {
    const { metadata } = this.state;
    const { currentSort } = this.state;

    if (!metadata) return null;

    return (
      <HeaderComponent
        metadata={metadata}
        sort={currentSort}
        onSort={this.handleSort}
      />
    );
  };

  protected renderTable = () => {
    const { loading = false } = this.state;

    return (
      <div className="relative">
        <TableLoadingOverlay loading={loading} />
        <div className="overflow-x-auto">
          <table className="w-full">
            {this.renderTableHeader()}
            <tbody>{this.renderTableContent()}</tbody>
          </table>
        </div>
      </div>
    );
  };

  render() {
    const { error, loading, backgroundLoading, metadata } = this.state;
    const { className } = this.props;

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

    // Show error state with retry option
    if (error && !loading && !backgroundLoading) {
      return (
        <div className="p-8 text-center">
          <div className="text-destructive mb-4">{error}</div>
          <Button
            onClick={() => {
              this.fetchMetadata();
            }}
          >
            Retry
          </Button>
          <Button
            className="ml-2"
            onClick={() => {
              this.setState({
                queryState: {
                  select: [],
                  sort: [],
                  query: undefined,
                  searchQuery: undefined,
                },
              });
            }}
          >
            Reset
          </Button>
        </div>
      );
    }

    // Use parent render
    return super.render();
  }

  // Override props getter to provide DataTable props from state
  get props(): DataTableProps {
    const resourceProps = this.props as ResourceDataTableProps;
    return {
      ...resourceProps,
      metadata: this.state.metadata!,
      data: this.state.data,
      pagination: this.state.pagination,
      loading: this.state.loading,
      backgroundLoading: this.state.backgroundLoading,
      error: this.state.error,
    };
  }
}

export default ResourceDataTable;
