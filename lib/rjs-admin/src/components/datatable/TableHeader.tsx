import * as Checkbox from "@radix-ui/react-checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronsUpDown, EyeOff, Menu } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ColumnConfig, TableHeaderProps } from "../../types/datatable";
import { QueryFieldMetadata, SortItem } from "../../types/querybuilder";
import { useDataTable } from "./DataTableContext";

export const TableHeader: React.FC<TableHeaderProps> = ({
  allowSelection = false,
  selectAllState = false,
  onSelectAll,
  onClearAll,
  idField,
  className,
}) => {
  const {
    metadata,
    queryState,
    onQueryStateChange,
    showHeaderFilters,
    onShowHeaderFiltersChange,
  } = useDataTable();

  if (!metadata) {
    return null;
  }

  // Normalize fields array
  const fieldArray = React.useMemo<QueryFieldMetadata[]>(() => {
    return metadata.fields as QueryFieldMetadata[];
  }, [metadata.fields]);

  // Create map for quick access to field metadata by name
  const fieldMap = React.useMemo(
    () => Object.fromEntries(fieldArray.map((f) => [f.name, f])),
    [fieldArray]
  );

  // Generate column configurations from metadata and queryState
  const getColumns = (): ColumnConfig[] => {
    const selectedFields =
      queryState.select ||
      fieldArray.filter((f) => !f.hidden).map((f) => f.name);

    return selectedFields.map<ColumnConfig>((fieldKey) => {
      const field = fieldMap[fieldKey] as QueryFieldMetadata;
      return {
        key: fieldKey,
        label: field.label,
        sortable: field.sortable,
        hidden: false,
      };
    });
  };

  const columns = getColumns();

  // Get sort info for a column
  const getSortInfo = (fieldKey: string) => {
    const sortItem = queryState.sort?.find((s) => s.field === fieldKey);
    return {
      direction: sortItem?.direction || null,
      index: sortItem ? queryState.sort?.indexOf(sortItem) : -1,
    };
  };

  // Handle sort click
  const handleSort = (fieldKey: string) => {
    const currentSort = queryState.sort || [];
    const currentIndex = currentSort.findIndex((s) => s.field === fieldKey);
    const currentDirection = currentSort[currentIndex]?.direction;

    let newSort: SortItem[];
    if (currentIndex === -1) {
      // Add new sort
      newSort = [{ field: fieldKey, direction: "asc" }];
    } else if (currentDirection === "asc") {
      // Change to desc
      newSort = currentSort.map((s, i) =>
        i === currentIndex ? { ...s, direction: "desc" } : s
      );
    } else {
      // Remove sort
      newSort = currentSort.filter((_, i) => i !== currentIndex);
    }

    onQueryStateChange({
      ...queryState,
      sort: newSort,
    });
  };

  // Handle column visibility toggle
  const handleColumnToggle = (fieldKey: string, visible: boolean) => {
    const currentSelect = queryState.select || [];
    let newSelect: string[];

    if (visible) {
      // Add column
      newSelect = [...currentSelect, fieldKey];
    } else {
      // Remove column
      newSelect = currentSelect.filter((f) => f !== fieldKey);
    }

    onQueryStateChange({
      ...queryState,
      select: newSelect,
    });
  };

  // Render sort indicator
  const renderSortIndicator = (fieldKey: string) => {
    const { direction, index } = getSortInfo(fieldKey);
    const field = fieldMap[fieldKey];
    if (!field.sortable) return null;
    if (!direction || index === undefined)
      return <ChevronsUpDown className="h-4 w-4 dt-sort-indicator" />;

    const multiSort = queryState.sort?.length && queryState.sort?.length > 1;

    return (
      <span
        className={cn("dt-sort-indicator", {
          active: direction,
        })}
        title={`Sort ${index + 1}`}
      >
        {direction === "asc" ? "↑" : "↓"}
        {multiSort && <span className="text-xs"> {index + 1}</span>}
      </span>
    );
  };

  // Get all available fields for column manager
  const allFields = React.useMemo(() => {
    return fieldArray.map((field) => ({
      key: field.name,
      label: field.label,
      visible: queryState.select?.includes(field.name) ?? !field.hidden,
    }));
  }, [fieldArray, queryState.select]);

  return (
    <tr>
      {/* Selection column */}
      {allowSelection && columns.length > 0 && (
        <th className="dt-th w-10">
          <div className="flex justify-center">
            <Checkbox.Root
              checked={selectAllState === true}
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  onSelectAll?.();
                } else {
                  onClearAll?.();
                }
              }}
              className="flex bg-white items-center justify-center w-4 h-4 border border-gray-300 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
          </div>
        </th>
      )}

      {/* Data columns */}
      {columns.map((column) => {
        const field = fieldMap[column.key];
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
                {column.sortable && renderSortIndicator(column.key)}
              </div>
            </div>
          </th>
        );
      })}

      {/* Column manager column */}
      <th className="dt-th w-10">
        <div className="flex justify-center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="cursor-pointer p-1 hover:bg-gray-200 rounded">
                <Menu className="h-4 w-4 text-gray-400" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <div className="p-2">
                <DropdownMenu.Label className="text-xs font-medium mb-2 text-gray-500">
                  Table Columns
                </DropdownMenu.Label>
                {allFields.map((field) => (
                  <DropdownMenu.Item
                    key={field.key}
                    className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-100 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      handleColumnToggle(field.key, !field.visible);
                    }}
                  >
                    <Checkbox.Root
                      id={`column-${metadata.name}-${field.key}`}
                      checked={field.visible}
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
                      htmlFor={`column-${metadata.name}-${field.key}`}
                      className="text-sm text-gray-700 capitalize cursor-pointer flex-1"
                    >
                      {field.label}
                    </label>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />
                <DropdownMenu.Label className="text-xs font-medium text-gray-500 mb-2">
                  Header Filters
                </DropdownMenu.Label>
                <DropdownMenu.Item
                  className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-gray-100 cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    onShowHeaderFiltersChange(!showHeaderFilters);
                  }}
                >
                  <Checkbox.Root
                    id={`header-filters-${metadata.name}`}
                    checked={showHeaderFilters}
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
                    htmlFor={`header-filters-${metadata.name}`}
                    className="text-sm text-gray-700 cursor-pointer flex-1 capitalize"
                  >
                    Show Header Filters
                  </label>
                </DropdownMenu.Item>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </th>
    </tr>
  );
};
