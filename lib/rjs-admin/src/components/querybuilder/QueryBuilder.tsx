import * as Label from "@radix-ui/react-label";
import * as React from "react";
import { cn } from "../../lib/utils";
import {
  FilterState,
  QueryBuilderProps,
  QueryFieldMetadata,
  QueryMetadata,
  QueryStatement,
  QueryValue,
  SortItem,
} from "../../types/querybuilder";
import { QBFieldSelector } from "./QBFieldSelector";
import { QBFilterEditor } from "./QBFilterEditor";
import { QBSortEditor } from "./QBSortEditor";
import { QBTextInput } from "./QBTextInput";

// Helper functions for backward compatibility with QueryStatement format
const filterStateToQueryStatements = (
  filters: FilterState[]
): QueryStatement[] => {
  return filters.map((filter) => {
    if (filter.type === "composite") {
      return {
        [filter.operator!]: filter.children
          ? filterStateToQueryStatements(filter.children)
          : [],
      } as QueryStatement;
    } else {
      return { [filter.operator!]: filter.value } as QueryStatement;
    }
  });
};

const queryStatementsToFilterState = (
  statements: QueryStatement[],
  metadata: QueryMetadata
): FilterState[] => {
  return statements
    .map((statement, index) => {
      const entries = Object.entries(statement);
      if (entries.length === 0) return null;

      const [key, value] = entries[0];

      if (key.startsWith(".")) {
        // Composite operator
        return {
          id: `filter-${index}`,
          type: "composite" as const,
          operator: key,
          children: Array.isArray(value)
            ? queryStatementsToFilterState(value as QueryStatement[], metadata)
            : [],
        };
      } else {
        // Field filter
        let fieldKey: string;
        let operator: string;

        if (key.includes("!")) {
          // Negated operator: "field!op"
          const [field, op] = key.split("!");
          fieldKey = field;
          operator = key; // Keep the full negated operator
        } else if (key.includes(".")) {
          // Normal operator: "field.op"
          const [field, op] = key.split(".");
          fieldKey = field;
          operator = key;
        } else {
          // Field with default operator: "field"
          fieldKey = key;
          const fieldMeta = metadata.fields.find((f) => f.name === fieldKey) as
            | QueryFieldMetadata
            | undefined;
          operator = fieldMeta
            ? `${fieldKey}.${fieldMeta.noop}`
            : `${fieldKey}.eq`;
        }

        return {
          id: `filter-${index}`,
          type: "field" as const,
          field: fieldKey,
          operator,
          value: value as QueryValue,
        };
      }
    })
    .filter(Boolean) as FilterState[];
};

// Helper functions for sort conversion
const sortItemsToStrings = (items: SortItem[]): string[] => {
  return items.map((item) => `${item.field}.${item.direction}`);
};

const sortStringsToItems = (strings: string[]): SortItem[] => {
  return strings.map((str) => {
    const [field, direction] = str.split(".");
    return { field, direction: direction as "asc" | "desc" };
  });
};

// Main QueryBuilder Component
export const QueryBuilder: React.FC<QueryBuilderProps> = ({
  metadata,
  queryState = {},
  onQueryStateChange,
  customInput = {},
  className,
  showDebug = false,
}) => {
  // Early return if metadata is not available or invalid
  if (
    !metadata ||
    !metadata.fields ||
    !metadata.filters ||
    !metadata.composites
  ) {
    return (
      <div className={cn("query-builder query-builder--loading", className)}>
        <div className="qb-loading">
          <span>Loading query builder...</span>
        </div>
      </div>
    );
  }

  const getDefaultFields = () => {
    return metadata.fields.filter((f) => !f.hidden).map((f) => f.name);
  };

  const handleSearchChange = (search: string) => {
    onQueryStateChange?.({ ...queryState, search });
  };

  const handleSelectChange = (select: string[]) => {
    onQueryStateChange?.({ ...queryState, select });
  };

  const handleSortChange = (sort: SortItem[]) => {
    onQueryStateChange?.({ ...queryState, sort });
  };

  const handleFiltersChange = (query: FilterState[]) => {
    onQueryStateChange?.({ ...queryState, query });
  };

  // Convert legacy formats if needed
  const currentQuery = queryState.query || [];
  const currentSort = queryState.sort;
  const currentSelect = queryState.select || getDefaultFields();
  const currentSearch = queryState.search || "";

  return (
    <div className={cn("query-builder", className)}>
      <QBTextInput value={currentSearch} onChange={handleSearchChange} />

      <QBFieldSelector
        select={currentSelect}
        metadata={metadata}
        onSelectChange={handleSelectChange}
      />

      <QBFilterEditor
        filters={currentQuery}
        metadata={metadata}
        onFiltersChange={handleFiltersChange}
        customInput={customInput}
      />

      <QBSortEditor
        sort={currentSort || []}
        metadata={metadata}
        onSortChange={handleSortChange}
      />

      {showDebug && (
        <div className="qb-debug">
          <Label.Root className="qb-label">Debug Output</Label.Root>
          <pre className="qb-debug-output">
            {JSON.stringify(
              {
                query: currentQuery,
                sort: currentSort,
                select: currentSelect,
                search: currentSearch,
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

QueryBuilder.displayName = "QueryBuilder";
