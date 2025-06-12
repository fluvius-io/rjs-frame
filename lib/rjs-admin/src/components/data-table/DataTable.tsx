import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
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
import type { DataTableProps, DataTableState, SortConfig } from "./types";

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

export class DataTable extends React.Component<DataTableProps, DataTableState> {
  constructor(props: DataTableProps) {
    super(props);
    this.state = {
      searchQuery: "",
      showFilterModal: false,
      currentSort: undefined,
      queryState: {
        select: [],
        sort: [],
        query: undefined,
        searchQuery: undefined,
      },
      data: props.data || [],
      metadata: props.metadata || null,
      loading: props.loading || false,
      backgroundLoading: props.backgroundLoading || false,
      error: props.error || null,
      pagination: props.pagination,
    };
  }

  componentDidMount() {
    this.initializeDefaultSort();
  }

  protected fetchData = async () => {};
  protected fetchMetadata = async () => {};
  protected setError = (error: string | null) => {
    this.setState({ error });
  };
  protected setLoading = (loading: boolean) => {
    this.setState({ loading });
  };
  protected setBackgroundLoading = (backgroundLoading: boolean) => {
    this.setState({ backgroundLoading });
  };

  componentDidUpdate(prevProps: DataTableProps) {
    // Re-initialize sort if metadata changes
    if (prevProps.metadata !== this.props.metadata) {
      this.initializeDefaultSort();
    }

    // Update state if props change
    if (prevProps.data !== this.props.data) {
      this.setState({ data: this.props.data || [] });
    }
    if (prevProps.metadata !== this.props.metadata) {
      this.setState({ metadata: this.props.metadata || null });
    }
    if (prevProps.loading !== this.props.loading) {
      this.setState({ loading: this.props.loading || false });
    }
    if (prevProps.backgroundLoading !== this.props.backgroundLoading) {
      this.setState({
        backgroundLoading: this.props.backgroundLoading || false,
      });
    }
    if (prevProps.error !== this.props.error) {
      this.setState({ error: this.props.error || null });
    }
    if (prevProps.pagination !== this.props.pagination) {
      this.setState({ pagination: this.props.pagination });
    }
  }

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

  protected sendQueryUpdate = (
    updates: Partial<ResourceQuery & { searchQuery?: string }>
  ) => {
    const newQuery = {
      ...this.state.queryState,
      ...updates,
    };
    this.setState({ queryState: newQuery });
    this.props.onQueryChange?.(newQuery);
  };

  protected handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    this.setState({ searchQuery: query });
    this.sendQueryUpdate({
      searchQuery: query || undefined,
    });
  };

  protected handleSort = (sort: SortConfig) => {
    this.setState({ currentSort: sort });
    this.sendQueryUpdate({
      sort: [`${sort.field}.${sort.direction}`],
    });
  };

  protected handleFilterApply = (queryBuilderState: QueryBuilderState) => {
    const resourceQuery = toResourceQuery(queryBuilderState);
    this.sendQueryUpdate({
      query: resourceQuery.query,
      sort: resourceQuery.sort,
    });
    // Reset to first page on filter changes
    this.props.onPageChange?.(1, this.state.pagination.pageSize);
  };

  protected handleFilterClose = () => {
    this.setState({ showFilterModal: false });
  };

  protected openFilterModal = () => {
    this.setState({ showFilterModal: true });
  };

  protected handlePageChange = (page: number, pageSize: number) => {
    this.props.onPageChange?.(page, pageSize);
  };

  protected getCurrentQueryBuilderState = (): QueryBuilderState => {
    const { queryState } = this.state;
    return fromResourceQuery({
      select: queryState.select,
      sort: queryState.sort,
      query: queryState.query,
    });
  };

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

  protected renderTableBody = () => {
    const { data, metadata, loading } = this.state;
    if (!metadata) return null;

    if (data.length === 0) {
      return (
        <tr>
          <td
            colSpan={metadata.fields ? Object.keys(metadata.fields).length : 1}
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

  protected renderTableContent = () => {
    const { error } = this.state;
    if (error) {
      return this.renderError();
    }
    return this.renderTableBody();
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

  protected renderActions = () => {
    const { actions } = this.props;
    if (!actions) return null;
    return <div className="data-table__actions">{actions}</div>;
  };

  protected renderSearchAndFilters = () => {
    const { showSearch, showFilters, searchPlaceholder } = this.props;
    const { searchQuery, queryState, metadata } = this.state;

    const hasFilters =
      metadata?.operators &&
      Object.values(metadata.operators).some(
        (param) => param.field_name !== ""
      );

    const currentFilterQuery = queryState.query;
    const hasActiveFilters =
      currentFilterQuery && currentFilterQuery.length > 0;

    if (!showSearch && !showFilters) return null;

    return (
      <>
        {(showSearch || showFilters) && (
          <div className="data-table__search-filter-row">
            {showSearch && (
              <div className="data-table__search">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="data-table__search-input"
                />
              </div>
            )}

            {showFilters && hasFilters && (
              <div className="data-table__filters">
                <button
                  onClick={this.openFilterModal}
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
                    <span className="data-table__filters-active">Active</span>
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
                onClick={() => this.sendQueryUpdate({ query: undefined })}
                className="data-table__active-filters-clear"
                title="Clear all filters"
              >
                <Cross2Icon className="data-table__active-filters-icon" />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  protected renderLayoutHeader = () => {
    const { title, subtitle, showSearch, showFilters, actions } = this.props;

    if (!title && !subtitle && !actions && !showSearch && !showFilters) {
      return null;
    }

    return (
      <div className="data-table__header">
        <div className="data-table__header-row">
          <div className="data-table__header-titles">
            {title && <h2 className="data-table__title">{title}</h2>}
            {subtitle && <p className="data-table__subtitle">{subtitle}</p>}
          </div>
          {this.renderActions()}
        </div>
        {this.renderSearchAndFilters()}
      </div>
    );
  };

  protected renderPagination = () => {
    const { pagination } = this.state;
    return (
      <PaginationControls
        pagination={pagination}
        onPageChange={this.handlePageChange}
      />
    );
  };

  protected renderFilterModal = () => {
    const { metadata } = this.state;
    const { showFilterModal } = this.state;
    if (!metadata) return null;

    return (
      <QueryBuilderModal
        isOpen={showFilterModal}
        metadata={metadata}
        currentQuery={this.getCurrentQueryBuilderState()}
        onClose={this.handleFilterClose}
        onApply={this.handleFilterApply}
      />
    );
  };

  render() {
    const { className } = this.props;
    const { metadata } = this.state;

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

    return (
      <>
        <div className={cn("data-table", className)}>
          {this.renderLayoutHeader()}
          {this.renderTable()}
          {this.renderPagination()}
        </div>
        {this.renderFilterModal()}
      </>
    );
  }
}

export default DataTable;
