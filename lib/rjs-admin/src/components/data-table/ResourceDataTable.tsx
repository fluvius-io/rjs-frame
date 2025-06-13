import React from "react";
import { APIManager } from "rjs-frame";
import { cn } from "../../lib/utils";
import { ResourceQuery } from "../query-builder/types";
import { DataTable } from "./DataTable";
import type { DataTableProps, PaginationConfig } from "./types";

const TableLoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;
  return (
    <div className="data-table__loading-overlay">
      <div className="data-table__loading-spinner" />
    </div>
  );
};

/**
 * ResourceDataTable component that extends DataTable to fetch data from an API
 * @extends DataTable
 */
export class ResourceDataTable extends DataTable {
  private currentRequestRef: AbortController | null = null;
  private isInitialLoadRef: boolean = true;
  private previousQueryRef: ResourceQuery;

  constructor(props: DataTableProps) {
    // Pass the original props to the parent constructor
    super(props);
    this.previousQueryRef = this.state.queryState;
  }

  componentDidMount() {
    if (this.props.dataApi) {
      this.fetchMetadata();
    }
  }

  componentDidUpdate(prevProps: DataTableProps) {
    // Check if dataApi changed
    if (prevProps.dataApi !== this.props.dataApi) {
      this.fetchMetadata();
    }

    // Check if query state changed
    if (prevProps.onQueryChange !== this.props.onQueryChange) {
      this.sendQueryUpdate(this.state.queryState);
    }
  }

  componentWillUnmount() {
    if (this.currentRequestRef) {
      this.currentRequestRef.abort();
    }
  }

  // Fetch metadata from API
  protected fetchMetadata = async () => {
    if (!this.props.dataApi) {
      this.setError("No dataApi provided");
      return;
    }

    this.setLoading(true);

    try {
      let metadataResult = await APIManager.queryMeta(this.props.dataApi);
      this.setState({ metadata: metadataResult.data });
      // Initialize default sort after metadata is loaded
      this.initializeDefaultSort();
      // Fetch initial data
      this.fetchData();
    } catch (error) {
      this.setError(
        error instanceof Error ? error.message : "Failed to fetch metadata"
      );
    } finally {
      this.setLoading(false);
    }
  };

  private buildSearchParams = (query: ResourceQuery) => {
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
  protected fetchData = async () => {
    console.log("fetchData", this.state.pagination);
    if (!this.props.dataApi) {
      this.setError("No dataApi provided");
      return;
    }

    // Cancel previous request if still in progress
    if (this.currentRequestRef) {
      this.currentRequestRef.abort();
    }

    // Create new AbortController for this request
    this.currentRequestRef = new AbortController();

    const isInitialLoad = this.isInitialLoadRef;
    if (isInitialLoad) {
      this.setLoading(true);
      this.isInitialLoadRef = false;
    } else {
      this.setBackgroundLoading(true);
    }

    try {
      const params = this.buildSearchParams(this.state.queryState);

      const result = await APIManager.query(this.props.dataApi, {
        search: params,
      });

      // Handle different response formats
      if (!result) {
        throw new Error("No data received from API");
      }

      const meta = result.meta || {};
      this.setState({
        data: result.data,
        pagination: {
          page: meta.page_no || 1,
          pageSize: meta.limit || 10,
          total: meta.total_items || 0,
        },
      });
    } catch (error) {
      console.error("❌ ResourceDataTable: Failed to fetch data:", error);
      this.setError(
        error instanceof Error ? error.message : "Failed to fetch data"
      );
    } finally {
      this.setLoading(false);
      this.setBackgroundLoading(false);
      this.currentRequestRef = null;
    }
  };

  protected setPagination = (pagination: PaginationConfig) => {
    this.setState({ pagination }, () => {
      // This callback runs after the state has been updated
      console.log("Pagination updated:", this.state.pagination);
    });
  };

  protected handlePageChange = (page: number, pageSize: number) => {
    this.setPagination({
      page,
      pageSize,
      total: this.state.pagination.total,
    });
    // Move fetchData to the setState callback to ensure it uses the updated pagination
    this.setState({}, () => {
      this.fetchData();
    });
  };

  render() {
    const { className } = this.props;
    const { loading, backgroundLoading } = this.state;

    return (
      <>
        <div className={cn("data-table", className)}>
          {this.renderLayoutHeader()}
          <div className="data-table__table-container">
            <TableLoadingOverlay loading={loading} />
            <div className="overflow-x-auto">
              <table className="w-full">
                {this.renderTableHeader()}
                <tbody>{this.renderTableContent()}</tbody>
              </table>
            </div>
          </div>
          {this.renderPagination()}
        </div>
      </>
    );
  }
}

export default ResourceDataTable;
