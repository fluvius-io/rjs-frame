import * as Checkbox from "@radix-ui/react-checkbox";
import { format, parseISO } from "date-fns";
import React from "react";
import { useAppContext } from "rjs-frame";
import { cn } from "../../lib/utils";
import { TableRowProps } from "../../types/datatable";
import { useDataTable } from "./DataTableContext";

const EMPTY_VALUE = "-";
export const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  rowIndex,
  className,
  onActivate,
  onSelect,
  selected,
  idValue,
  isActive,
  rowActions = [],
  fieldMap,
}) => {
  const { customFormatters } = useDataTable();
  const { config } = useAppContext();
  const dateFormat = config?.get("sys.format.date") || "yyyy-MM-dd";
  const datetimeFormat =
    config?.get("sys.format.datetime") || "yyyy-MM-dd HH:mm";

  // Format cell value for display
  const formatCellValue = (value: any, columnKey: string): string => {
    const formatter = customFormatters?.[columnKey];
    if (formatter) {
      return formatter(value);
    }

    if (value === null || value === undefined) {
      return EMPTY_VALUE;
    }

    const field = fieldMap[columnKey];

    if (!field) {
      return String(value);
    }

    const dtype = field.dtype;

    switch (dtype) {
      case "boolean":
        return value ? "Yes" : "No";
      case "number":
        return value.toLocaleString();
      case "date":
        try {
          const date =
            typeof value === "string" ? parseISO(value) : new Date(value);
          return format(date, dateFormat);
        } catch (error) {
          console.warn(`Failed to format date value: ${value}`, error);
          return String(value);
        }
      case "datetime":
        try {
          const date =
            typeof value === "string" ? parseISO(value) : new Date(value);
          return format(date, datetimeFormat);
        } catch (error) {
          console.warn(`Failed to format datetime value: ${value}`, error);
          return String(value);
        }
      default:
        console.warn(`Unknown dtype: ${dtype}`);
        return String(value);
    }
  };

  // Truncate long text with ellipsis
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const handleSelect = (checked: boolean) => {
    onSelect?.(idValue as string, checked, row);
  };

  const handleActivate = () => {
    onActivate?.(idValue as string, row);
  };

  return (
    <tr
      className={cn(
        "dt-tr",
        "cursor-pointer",
        className,
        isActive ? "dt-active" : ""
      )}
      onClick={handleActivate}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <td className="dt-td w-10">
          <Checkbox.Root
            checked={selected}
            onCheckedChange={handleSelect}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          >
            <Checkbox.Indicator className="text-white text-xs">
              ✓
            </Checkbox.Indicator>
          </Checkbox.Root>
        </td>
      )}
      {columns.map((column) => {
        const cellValue = row[column.key];
        const formattedValue = formatCellValue(cellValue, column.key);
        const displayValue = truncateText(formattedValue);

        return (
          <td
            key={column.key}
            className="dt-td"
            title={formattedValue !== displayValue ? formattedValue : undefined}
          >
            {displayValue}
          </td>
        );
      })}
      <td className="dt-td w-10">
        {rowActions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="text-gray-400 hover:text-gray-600"
          >
            {action.icon}
          </button>
        ))}
      </td>
    </tr>
  );
};
