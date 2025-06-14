import React from "react";
import { cn } from "../../lib/utils";
import "../../styles/components/DataTable.css";
import QueryBuilderModal from "../query-builder/QueryBuilderModal";
import { QueryBuilderState } from "../query-builder/types";
import HeaderComponent from "./HeaderComponent";
import PaginationControls from "./PaginationControls";
import RowComponent from "./RowComponent";
import { DataTableProps, DataTableState } from "./types";

export class DataTable extends React.Component<DataTableProps, DataTableState> {
  constructor(props: DataTableProps) {
    super(props);
    this.state = {
      searchQuery: "",
      showFilterModal: false,
      queryState: {
        visibleFields: [],
        sortRules: [],
        filterRules: [],
        universalQuery: "",
      },
      data: [],
      metadata: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: DataTableProps, prevState: DataTableState) {
    if (
      prevProps.metadata !== this.props.metadata ||
      prevState.queryState !== this.state.queryState ||
      prevState.pagination.page !== this.state.pagination.page ||
      prevState.pagination.pageSize !== this.state.pagination.pageSize
    ) {
      this.fetchData();
    }
  }

  protected setLoading = (loading: boolean) => {
    this.setState({ loading });
  };

  protected async fetchData() {}

  private handlePageChange = (page: number, pageSize: number) => {
    this.setState(
      { pagination: { ...this.state.pagination, page, pageSize } },
      this.sendQueryUpdate
    );
  };

  private handleSort = (sort: { field: string; direction: "asc" | "desc" }) => {
    this.setState(
      (prevState) => ({
        queryState: {
          ...prevState.queryState,
          sortRules: [sort],
        },
      }),
      this.sendQueryUpdate
    );
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    this.setState(
      (prevState) => ({
        searchQuery: query,
        queryState: {
          ...prevState.queryState,
          universalQuery: query,
        },
      }),
      this.sendQueryUpdate
    );
  };

  handleFilterApply = (queryBuilderState: QueryBuilderState) => {
    this.setState(
      (prevState) => ({
        queryState: {
          ...prevState.queryState,
          ...queryBuilderState,
        },
      }),
      this.sendQueryUpdate
    );
  };

  protected sendQueryUpdate = () => {
    const { onQueryChange, onPageChange } = this.props;
    const { queryState } = this.state;
    onQueryChange?.(queryState);
    onPageChange?.(this.state.pagination.page, this.state.pagination.pageSize);
    this.fetchData();
  };

  protected setError = (error: string) => {
    this.setState({ error });
  };

  protected renderTableHeader() {
    const { metadata, queryState } = this.state;
    if (!metadata?.fields) return null;

    return (
      <HeaderComponent
        metadata={metadata}
        queryState={queryState}
        onSort={this.handleSort}
      />
    );
  }

  protected renderError() {
    const { error } = this.state;
    return (
      <tbody>
        <tr className="data-table-error">
          <td className="data-table-error__message">{error}</td>
        </tr>
      </tbody>
    );
  }

  protected renderTableBody() {
    const { data, metadata, queryState, error } = this.state;
    if (!data || !metadata?.fields) return null;

    return (
      <tbody>
        {data.map((row, index) => (
          <RowComponent
            key={row.id || index}
            metadata={metadata}
            queryState={queryState}
            data={row}
            index={index}
          />
        ))}
      </tbody>
    );
  }

  protected renderFrameTitle() {
    const { title, subtitle, actions } = this.props;
    if (!(title || subtitle || actions)) return null;
    return (
      <div className="data-table-header">
        <div className="data-table-header__content">
          <div className="data-table-header__title-section">
            {title && <h2 className="data-table-header__title">{title}</h2>}
            {subtitle && (
              <p className="data-table-header__subtitle">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="data-table-header__actions">{actions}</div>
          )}
        </div>
      </div>
    );
  }

  protected renderToolbar() {
    const { metadata, queryState } = this.state;
    if (!metadata?.operators) return null;

    const hasActiveFilters = queryState.filterRules.length > 0;
    const hasActiveSort = queryState.sortRules.length > 0;
    const hasActiveSearch = (queryState.universalQuery || "").length > 0;
    return (
      <div className="data-table-toolbar">
        <div className="data-table-toolbar__content">
          {/* Search Input */}
          <div className="data-table-toolbar__search">
            <input
              type="text"
              placeholder="Search..."
              value={queryState.universalQuery}
              onChange={this.handleSearchChange}
              className="data-table-toolbar__search-input"
            />
          </div>

          {/* Active Filters Status */}
          <div className="data-table-toolbar__status">
            {hasActiveFilters && (
              <span className="data-table-toolbar__status-badge data-table-toolbar__status-badge--filters">
                {queryState.filterRules.length} Filters
              </span>
            )}
            {hasActiveSort && (
              <span className="data-table-toolbar__status-badge data-table-toolbar__status-badge--sort">
                Sorted
              </span>
            )}
            {hasActiveSearch && (
              <span className="data-table-toolbar__status-badge data-table-toolbar__status-badge--search">
                Search Active
              </span>
            )}
          </div>
        </div>

        {/* Filter Button */}
        {metadata?.operators && Object.keys(metadata.operators).length > 0 && (
          <button
            className={cn(
              "data-table-toolbar__filter-button",
              hasActiveFilters && "data-table-toolbar__filter-button--active"
            )}
            onClick={() => this.setState({ showFilterModal: true })}
          >
            {hasActiveFilters ? "Edit Filters" : "Show Filters"}
          </button>
        )}

        {/* Refresh Button */}
        <button
          className="data-table-toolbar__refresh"
          onClick={() => this.fetchData()}
          title="Refresh"
        >
          &#x21bb; Refresh
        </button>
      </div>
    );
  }

  public render() {
    const {
      metadata,
      loading,
      pagination,
      showFilterModal,
      queryState,
      error,
    } = this.state;
    const { className } = this.props;

    return (
      <div className={cn("data-table-container", className)}>
        {/* Header Section */}
        {this.renderFrameTitle()}

        {this.renderToolbar()}

        {/* Table Container */}
        <div className="data-table-content">
          <table className="data-table">
            {this.renderTableHeader()}
            {error ? this.renderError() : this.renderTableBody()}
          </table>
          <div className="data-table-pagination">
            <PaginationControls
              pagination={pagination}
              loading={loading}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>

        {/* Pagination */}

        {/* Filter Modal */}
        {showFilterModal && metadata && (
          <QueryBuilderModal
            isOpen={showFilterModal}
            metadata={metadata}
            currentQuery={queryState}
            onClose={() => this.setState({ showFilterModal: false })}
            onApply={this.handleFilterApply}
          />
        )}
      </div>
    );
  }
}

export default DataTable;
