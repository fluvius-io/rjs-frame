import { useEffect, useState } from "react";
import { DataGrid, SortColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { APIManager } from "rjs-frame";
import { Spinner } from "../components/common/Spinner";
import type { QueryMetadata } from "../components/data-table/types";
import { QueryBuilderState } from "../components/query-builder/types";
import "../lib/api";

interface DataGridExampleProps {
  dataApi: string;
  title?: string;
}

interface SortDirection {
  columnKey: string;
  direction: "ASC" | "DESC";
}

export function DataGridExample({ dataApi, title }: DataGridExampleProps) {
  const [metadata, setMetadata] = useState<QueryMetadata | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [queryState, setQueryState] = useState<QueryBuilderState>({
    visibleFields: [],
    sortRules: [],
    filterRules: [],
    universalQuery: "",
  });

  // Fetch metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const result = await APIManager.queryMeta(dataApi);
        setMetadata(result.data);

        // Initialize visible fields from metadata
        setQueryState((prev) => ({
          ...prev,
          visibleFields: Object.values(result.data.fields),
        }));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch metadata")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [dataApi]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!metadata) return;

      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (queryState.visibleFields.length > 0) {
          params.append(
            "select",
            queryState.visibleFields.map((field) => field.key).join(",")
          );
        }

        if (queryState.sortRules.length > 0) {
          params.append(
            "sort",
            queryState.sortRules
              .map((rule) => `${rule.field} ${rule.direction}`)
              .join(",")
          );
        }

        if (queryState.filterRules.length > 0) {
          const query = queryState.filterRules
            .map((rule) => {
              if ("field" in rule) {
                return `${rule.field} ${rule.operator} ${rule.value}`;
              }
              return "";
            })
            .filter(Boolean)
            .join(" AND ");
          params.append("q", query);
        }

        const result = await APIManager.query(dataApi, params);
        setData(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch data")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataApi, metadata, queryState]);

  // Transform metadata into DataGrid columns
  const columns = metadata
    ? Object.values(metadata.fields).map((field) => ({
        key: field.key,
        name: field.label,
        sortable: field.sortable,
        resizable: true,
        width: 150,
      }))
    : [];

  if (loading && !data.length) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="fill-grid">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <DataGrid
        columns={columns}
        rows={data}
        className="fill-grid rdg-light"
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        sortColumns={
          queryState.sortRules.length > 0
            ? [
                {
                  columnKey: queryState.sortRules[0].field,
                  direction:
                    queryState.sortRules[0].direction === "asc"
                      ? "ASC"
                      : "DESC",
                },
              ]
            : []
        }
        onSortColumnsChange={(sortColumns: readonly SortColumn[]) => {
          if (sortColumns.length > 0) {
            setQueryState((prev) => ({
              ...prev,
              sortRules: [
                {
                  field: sortColumns[0].columnKey,
                  direction:
                    sortColumns[0].direction === "ASC" ? "asc" : "desc",
                },
              ],
            }));
          } else {
            setQueryState((prev) => ({
              ...prev,
              sortRules: [],
            }));
          }
        }}
      />
    </div>
  );
}
