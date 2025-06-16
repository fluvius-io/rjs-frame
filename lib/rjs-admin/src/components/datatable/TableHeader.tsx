import * as Checkbox from "@radix-ui/react-checkbox";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Eye,
  EyeOff,
} from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ColumnConfig, TableHeaderProps } from "../../types/datatable";

export const TableHeader: React.FC<TableHeaderProps> = ({
  metadata,
  queryState,
  onQueryStateChange,
  className,
}) => {
  // Generate column configurations from metadata and queryState
  const getColumns = (): ColumnConfig[] => {
    const selectedFields =
      queryState.select ||
      Object.keys(metadata.fields).filter(
        (key) => !metadata.fields[key].hidden
      );

    return selectedFields.map((fieldKey: string) => {
      const field = metadata.fields[fieldKey];
      return {
        key: fieldKey,
        label: field.label,
        sortable: field.sortable,
        hidden: false, // These are already filtered by queryState.select
      };
    });
  };

  const columns = getColumns();

  // Get sort information for a field
  const getSortInfo = (fieldKey: string) => {
    const sort = queryState.sort || [];
    const sortIndex = sort.findIndex((sortItem) => sortItem.field === fieldKey);

    if (sortIndex === -1) return { direction: null, order: -1 };

    const sortItem = sort[sortIndex];
    return { direction: sortItem.direction, order: sortIndex };
  };

  // Handle column sort
  const handleSort = (fieldKey: string) => {
    const field = metadata.fields[fieldKey];
    if (!field.sortable) return;

    const currentSort = queryState.sort || [];
    const { direction } = getSortInfo(fieldKey);

    let newSort = [...currentSort];

    if (!direction) {
      // Not currently sorted, add ascending
      newSort.push({ field: fieldKey, direction: "asc" });
    } else if (direction === "asc") {
      // Currently ascending, change to descending
      const sortIndex = newSort.findIndex(
        (sortItem) => sortItem.field === fieldKey
      );
      if (sortIndex !== -1) {
        newSort[sortIndex] = { field: fieldKey, direction: "desc" };
      }
    } else {
      // Currently descending, remove from sort
      newSort = newSort.filter((sortItem) => sortItem.field !== fieldKey);
    }

    onQueryStateChange({
      ...queryState,
      sort: newSort,
    });
  };

  // Handle column visibility toggle
  const handleColumnToggle = (fieldKey: string, visible: boolean) => {
    const currentSelect =
      queryState.select ||
      Object.keys(metadata.fields).filter(
        (key) => !metadata.fields[key].hidden
      );

    let newSelect: string[];
    if (visible) {
      newSelect = [...currentSelect, fieldKey];
    } else {
      newSelect = currentSelect.filter((key: string) => key !== fieldKey);
    }

    onQueryStateChange({
      ...queryState,
      select: newSelect,
    });
  };

  // Render sort indicator
  const renderSortIndicator = (fieldKey: string) => {
    const { direction, order } = getSortInfo(fieldKey);

    if (!direction) {
      return <ChevronsUpDown className="h-4 w-4 dt-sort-indicator" />;
    }

    const Icon = direction === "asc" ? ChevronUp : ChevronDown;
    return (
      <div className="flex items-center">
        <Icon className="h-4 w-4 dt-sort-indicator active" />
        {order >= 0 && queryState.sort && queryState.sort.length > 1 && (
          <span className="text-xs ml-1 text-gray-500">{order + 1}</span>
        )}
      </div>
    );
  };

  // Get all available fields for column toggle
  const allFields = Object.entries(metadata.fields).map(
    ([key, field]: [string, any]) => ({
      key,
      label: field.label,
      visible: columns.some((col) => col.key === key),
      hidden: field.hidden,
    })
  );

  return (
    <tr className={cn("dt-header-row", className)}>
      {columns.map((column) => {
        const field = metadata.fields[column.key];
        const { direction } = getSortInfo(column.key);

        return (
          <th
            key={column.key}
            className={cn("dt-th group", column.sortable && "dt-th-sortable")}
            onClick={() => column.sortable && handleSort(column.key)}
          >
            <div className="dt-th-content">
              <span className="font-medium">{column.label}</span>
              <div className="flex items-center">
                {column.sortable && renderSortIndicator(column.key)}

                {/* Column visibility toggle */}
                <div className="dt-column-toggle ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColumnToggle(column.key, false);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={`Hide ${column.label} column`}
                  >
                    <EyeOff className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </th>
        );
      })}

      {/* Column manager column */}
      <th className="dt-th w-10">
        <div className="flex justify-center">
          <details className="relative">
            <summary className="cursor-pointer p-1 hover:bg-gray-200 rounded list-none">
              <Eye className="h-4 w-4 text-gray-400" />
            </summary>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  Show/Hide Columns
                </div>
                {allFields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox.Root
                      id={`column-${field.key}`}
                      checked={field.visible}
                      onCheckedChange={(checked) =>
                        handleColumnToggle(field.key, checked === true)
                      }
                      className="flex items-center justify-center w-4 h-4 border border-gray-300 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    >
                      <Checkbox.Indicator>
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label
                      htmlFor={`column-${field.key}`}
                      className="text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </th>
    </tr>
  );
};
