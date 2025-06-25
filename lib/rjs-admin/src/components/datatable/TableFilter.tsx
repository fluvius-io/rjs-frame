import { Filter, Trash2, X } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ColumnConfig, TableFilterProps } from "../../types/datatable";
import { QueryFieldMetadata, QueryValue } from "../../types/querybuilder";
import { useDataTable } from "./DataTableContext";

export const TableFilter: React.FC<TableFilterProps> = ({
  allowSelection = false,
  className,
}) => {
  const {
    metadata,
    queryState,
    onQueryStateChange,
    openQueryBuilder,
    onShowHeaderFiltersChange,
  } = useDataTable();

  if (!metadata) {
    return null;
  }

  const fieldMap: Record<string, QueryFieldMetadata> = React.useMemo(
    () => Object.fromEntries(metadata.fields.map((f) => [f.name, f])),
    [metadata.fields]
  );

  // Generate column configurations from metadata and queryState
  const getColumns = (): ColumnConfig[] => {
    const selectedFields =
      queryState.select ||
      metadata.fields.filter((f) => !f.hidden).map((f) => f.name);

    return selectedFields.map((fieldKey) => {
      const field = fieldMap[fieldKey];
      return {
        key: fieldKey,
        label: field.label,
        sortable: field.sortable,
        hidden: false,
      };
    });
  };

  const columns = getColumns();

  // Get current filter value for a field (using noop operator)
  const getFieldFilterValue = (fieldKey: string): QueryValue => {
    const field = fieldMap[fieldKey];
    const noopOperator = `${fieldKey}.${field.noop}`;

    if (!queryState.query) return "";

    // Find the filter in the query array (FilterState format)
    for (const filterState of queryState.query) {
      if (filterState.type === "field" && filterState.field === fieldKey) {
        // Check if this matches the noop operator or its negated version
        const expectedOperator = `${fieldKey}.${field.noop}`;
        const negatedOperator = `${fieldKey}!${field.noop}`;

        if (
          filterState.operator === expectedOperator ||
          filterState.operator === negatedOperator
        ) {
          return filterState.value || "";
        }
      }
    }

    return "";
  };

  // Update filter value for a field
  const updateFieldFilter = (fieldKey: string, value: QueryValue) => {
    const field = fieldMap[fieldKey];
    const noopOperator = field.noop;
    const currentQuery = queryState.query || [];

    // Remove existing filters for this field
    let newQuery = currentQuery.filter((filterState) => {
      return !(filterState.type === "field" && filterState.field === fieldKey);
    });

    // Add new filter if value is not empty
    if (value && value !== "") {
      // Generate a unique ID for the new filter
      const newId = `filter-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      newQuery.push({
        id: newId,
        type: "field",
        field: fieldKey,
        operator: `${fieldKey}.${noopOperator}`,
        value: value,
      });
    }

    onQueryStateChange({
      ...queryState,
      query: newQuery,
    });
  };

  // Clear filter for a field
  const clearFieldFilter = (fieldKey: string) => {
    updateFieldFilter(fieldKey, "");
  };

  // Clear all filters
  const clearAllFilters = () => {
    onQueryStateChange({
      ...queryState,
      query: [],
    });
  };

  // Check if any filters are active
  const hasActiveFilters = (queryState.query?.length ?? 0) > 0;

  // Render input based on filter metadata
  const renderFilterInput = (column: ColumnConfig) => {
    const field = fieldMap[column.key];
    const filterKey = `${column.key}.${field.noop}`;
    const filterMetadata = metadata.filters[filterKey];
    const currentValue = getFieldFilterValue(column.key);

    if (!filterMetadata) {
      return null;
    }

    const inputConfig = filterMetadata.input;

    const handleChange = (newValue: QueryValue) => {
      updateFieldFilter(column.key, newValue);
    };

    const baseInputProps = {
      value: currentValue as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        handleChange(e.target.value),
      className: "dt-filter-input",
      placeholder: inputConfig.placeholder || `Filter ${column.label}...`,
    };

    switch (inputConfig.type) {
      case "number":
        return (
          <input
            {...baseInputProps}
            type="number"
            min={inputConfig.min}
            max={inputConfig.max}
            step={inputConfig.step}
          />
        );

      case "date":
        return <input {...baseInputProps} type="date" />;

      case "select":
        return (
          <select
            value={currentValue as string}
            onChange={(e) => handleChange(e.target.value)}
            className="dt-filter-input"
          >
            <option value="">All</option>
            {inputConfig.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return <input {...baseInputProps} type="text" />;
    }
  };

  return (
    <tr className={cn("dt-filter-row", className)}>
      {/* Selection column */}
      {allowSelection && (
        <td className="dt-filter-cell">
          <button
            className="p-1 hover:bg-gray-200 rounded"
            title="Select all"
            onClick={() => {
              openQueryBuilder(true);
            }}
          >
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        </td>
      )}

      {/* Filter inputs */}
      {columns.map((column) => (
        <td key={column.key} className="dt-filter-cell">
          <div className="relative">
            {renderFilterInput(column)}
            {getFieldFilterValue(column.key) && (
              <button
                onClick={() => clearFieldFilter(column.key)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
                title="Clear filter"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            )}
          </div>
        </td>
      ))}

      {/* Column manager column */}
      <td className="dt-filter-cell text-center">
        {(hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="p-1 hover:bg-gray-200 rounded"
            title="Clear all filters"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        )) || (
          <button
            onClick={() => onShowHeaderFiltersChange(false)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Hide Filters"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </td>
    </tr>
  );
};
