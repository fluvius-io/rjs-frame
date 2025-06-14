import { APIManager } from "rjs-frame";
import { FilterRule, QueryBuilderState } from "../query-builder/types";
import { DataTable } from "./DataTable";
import type { DataTableProps } from "./types";

/**
 * ResourceDataTable component that extends DataTable to fetch data from an API
 * @extends DataTable
 */
export class ResourceDataTable extends DataTable {
  private currentRequestRef: AbortController | null = null;
  private previousQueryRef: QueryBuilderState;

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
      this.sendQueryUpdate();
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
      this.fetchData();
    } catch (error) {
      this.setError(
        error instanceof Error ? error.message : "Failed to fetch metadata"
      );
    } finally {
      this.setLoading(false);
    }
  };

  private buildSearchParams = (query: QueryBuilderState) => {
    const params: Record<string, string> = {
      page: String(this.state.pagination.page),
      limit: String(this.state.pagination.pageSize),
    };

    // Add sort parameters from ResourceQuery
    if (query.sortRules && query.sortRules.length > 0) {
      const sortString = query.sortRules
        .map((rule) => `${rule.field}.${rule.direction}`)
        .join(",");
      if (sortString && sortString !== "null" && sortString !== "undefined")
        params.sort = String(sortString);
    }

    // Add search query if provided
    if (
      query.universalQuery != null &&
      query.universalQuery !== undefined &&
      String(query.universalQuery).length > 0
    ) {
      params.search = String(query.universalQuery);
    }

    // Add filter query from ResourceQuery
    if (query.filterRules && query.filterRules.length > 0) {
      const processFilterRule = (rule: FilterRule): object | null => {
        if (rule.type === "field") {
          const value = rule.value != null ? String(rule.value) : "";
          if (value !== "") {
            return { [`${rule.field}.${rule.operator}`]: value };
          }
          return null;
        } else if (rule.type === "composite") {
          const processedChildren = rule.children
            .map(processFilterRule)
            .filter((child): child is object => child !== null);
          if (processedChildren.length > 0) {
            return {
              [rule.operator === ".and" ? "and" : "or"]: processedChildren,
            };
          }
          return null;
        }
        return null;
      };

      const filterObject = query.filterRules
        .map(processFilterRule)
        .filter((child): child is object => child !== null);

      if (Array.isArray(filterObject) && filterObject.length > 0) {
        const qString = JSON.stringify(filterObject);
        if (
          qString &&
          qString !== "null" &&
          qString !== "undefined" &&
          qString.length > 0
        ) {
          params.q = qString;
        }
      }
    }

    return params;
  };

  // Fetch data from API using ResourceQuery
  protected fetchData = async () => {
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

    try {
      const params = this.buildSearchParams(this.state.queryState);
      this.setLoading(true);

      const result = await APIManager.query(this.props.dataApi, {
        search: params,
      });

      // Handle different response formats
      if (!result) {
        throw new Error("No data received from API");
      }

      const meta = result.meta || {};
      this.setState(
        {
          data: result.data,
          pagination: {
            page: meta.page_no || 1,
            pageSize: meta.limit || 10,
            total: meta.total_items || 0,
          },
        },
        () => this.setError(null)
      );
    } catch (error) {
      this.setError(
        error instanceof Error ? error.message : "Failed to fetch data"
      );
    } finally {
      this.setLoading(false);
      this.currentRequestRef = null;
    }
  };
}

export default ResourceDataTable;
