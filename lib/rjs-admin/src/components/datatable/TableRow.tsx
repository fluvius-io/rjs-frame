import React from "react";
import { cn } from "../../lib/utils";
import { TableRowProps } from "../../types/datatable";

export const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  rowIndex,
  className,
}) => {
  // Format cell value for display
  const formatCellValue = (value: any, columnKey: string): string => {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
      // Handle arrays
      if (Array.isArray(value)) {
        return value.join(", ");
      }

      // Handle objects (try to display as JSON or extract meaningful value)
      try {
        return JSON.stringify(value);
      } catch {
        return "[Object]";
      }
    }

    if (typeof value === "number") {
      // Basic number formatting
      return value.toLocaleString();
    }

    // Handle dates
    if (typeof value === "string") {
      // Try to detect ISO date strings
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (dateRegex.test(value)) {
        try {
          const date = new Date(value);
          return date.toLocaleString();
        } catch {
          return value;
        }
      }
    }

    return String(value);
  };

  // Truncate long text with ellipsis
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <tr className={cn("dt-tr", className)}>
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

      {/* Empty cell for column toggle column */}
      <td className="dt-td w-10"></td>
    </tr>
  );
};
