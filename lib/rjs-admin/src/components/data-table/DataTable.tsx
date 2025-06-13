import React from "react";
import { cn } from "../../lib/utils";
import QueryBuilderModal from "../query-builder/QueryBuilderModal";
import { QueryBuilderState } from "../query-builder/types";
import HeaderComponent from "./HeaderComponent";
import PaginationControls from "./PaginationControls";
import RowComponent from "./RowComponent";
import { DataTableProps, DataTableState } from "./types";

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
      queryState: {
        visibleFields: [],
        sortRules: [],
        filterRules: [],
        searchQuery: "",
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

  async fetchData() {}

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
          searchQuery: query,
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

  sendQueryUpdate = () => {
    const { onQueryChange, onPageChange } = this.props;
    const { queryState } = this.state;
    onQueryChange?.(queryState);
    onPageChange?.(1, this.state.pagination.pageSize);
    this.fetchData();
  };

  protected setError = (error: string) => {
    this.setState({ error });
  };

  renderTableHeader() {
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

  renderTableBody() {
    const { data, metadata, queryState } = this.state;
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

  render() {
    const {
      metadata,
      loading,
      error,
      pagination,
      showFilterModal,
      queryState,
    } = this.state;
    const { className } = this.props;

    if (error) {
      return <div className="data-table__error">{error}</div>;
    }

    return (
      <div className={cn("data-table", className)}>
        <div className="data-table__toolbar">
          <div className="data-table__search">
            <input
              type="text"
              placeholder="Search..."
              value={queryState.searchQuery}
              onChange={this.handleSearchChange}
            />
          </div>
          {metadata?.operators &&
            Object.keys(metadata.operators).length > 0 && (
              <button
                className="data-table__filter-button"
                onClick={() => this.setState({ showFilterModal: true })}
              >
                Show Filters
              </button>
            )}
        </div>

        <div className="data-table__table-container">
          <table className="data-table__table">
            {this.renderTableHeader()}
            {this.renderTableBody()}
          </table>
        </div>

        <PaginationControls
          pagination={pagination}
          loading={loading}
          onPageChange={this.props.onPageChange}
        />

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
