import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FilterState, QueryState } from "../types/querybuilder";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/**
 * Converts FilterState array to a query object for API parameters
 */
function convertFiltersToQuery(filters: FilterState[]): Record<string, any> {
  const query: Record<string, any> = {};

  filters.forEach((filter) => {
    if (filter.type === "field" && filter.operator && filter.field) {
      // Handle field filters - preserve the operator as-is (including negation)
      // Only add to query if value is not empty, undefined, or null
      if (
        filter.value !== undefined &&
        filter.value !== null &&
        filter.value !== ""
      ) {
        query[filter.operator] = filter.value;
      }
    } else if (filter.type === "composite" && filter.children) {
      // Handle composite filters (AND/OR)
      const compositeKey = filter.operator || ".and";
      const childrenQuery = convertFiltersToQuery(filter.children);

      if (Object.keys(childrenQuery).length > 0) {
        query[compositeKey] = childrenQuery;
      }
    }
  });

  return query;
}

/**
 * Converts QueryState to API query search parameters structure
 * @param queryState - The QueryState object to convert
 * @returns Object with query, select, and sort parameters formatted for API
 *
 * @example
 * ```typescript
 * const queryState: QueryState = {
 *   query: [
 *     {
 *       id: "filter-1",
 *       type: "field",
 *       operator: "_id.eq",
 *       field: "_id",
 *       value: "12939391"
 *     },
 *     {
 *       id: "filter-2",
 *       type: "field",
 *       operator: "name!eq",  // Negated operator
 *       field: "name",
 *       value: "test"
 *     }
 *   ],
 *   select: ["field1", "field2", "field3"],
 *   sort: [
 *     { field: "field1", direction: "asc" },
 *     { field: "field2", direction: "desc" }
 *   ]
 * };
 *
 * const apiParams = queryStateToApiParams(queryState);
 * // Result:
 * // {
 * //   query: '{"_id.eq":"12939391","name!eq":"test"}',
 * //   select: "field1,field2,field3",
 * //   sort: "field1.asc,field2.desc"
 * // }
 * ```
 */
export function queryStateToApiParams(queryState: QueryState): {
  query?: string;
  select?: string;
  sort?: string;
} {
  const result: {
    query?: string;
    select?: string;
    sort?: string;
  } = {};

  // Convert query filters to JSON string
  if (queryState.query && queryState.query.length > 0) {
    const queryObj = convertFiltersToQuery(queryState.query);
    if (Object.keys(queryObj).length > 0) {
      result.query = JSON.stringify(queryObj);
    }
  }

  // Convert select array to comma-separated string
  if (queryState.select && queryState.select.length > 0) {
    result.select = queryState.select.join(",");
  }

  // Convert sort array to comma-separated string
  if (queryState.sort && queryState.sort.length > 0) {
    result.sort = queryState.sort
      .map((item) => `${item.field}.${item.direction}`)
      .join(",");
  }

  return result;
}
