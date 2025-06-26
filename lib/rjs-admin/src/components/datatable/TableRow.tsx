import * as Checkbox from "@radix-ui/react-checkbox";
import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { useAppContext } from "rjs-frame";
import { cn } from "../../lib/utils";
import { TableRowProps } from "../../types/datatable";
import { EntityFormat } from "../entity";
import { renderActions } from "./DataTable";
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
  fieldMap,
}) => {
  const { customFormatters, rowActions } = useDataTable();
  const { config } = useAppContext();
  const [forceUpdateCounter, setForceUpdate] = useState(0);
  const dateFormat = config?.get("sys.format.date") || "yyyy-MM-dd";
  const datetimeFormat =
    config?.get("sys.format.datetime") || "yyyy-MM-dd HH:mm";

  const forceUpdate = () => {
    setForceUpdate(forceUpdateCounter + 1);
  };

  // Format cell value for display
  const stringValue = (value: any, dtype: string = "string"): string => {
    if (value === null || value === undefined) {
      return EMPTY_VALUE;
    }

    switch (dtype) {
      case "boolean":
        return value ? "Y" : "N";

      case "float":
      case "integer":
      case "number":
        if (value === 0) {
          return "-";
        }

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
          const datetime =
            typeof value === "string" ? parseISO(value) : new Date(value);
          return format(datetime, datetimeFormat);
        } catch (error) {
          console.warn(`Failed to format datetime value: ${value}`, error);
          return String(value);
        }
      case "enum":
        return value;
      case "string":
        return value;
      case "uuid":
        return value;
      case "json":
        return JSON.stringify(value);
      case "array":
        return value.join(", ");
      default:
        console.warn(`Unknown dtype: ${dtype}`);
        return String(value);
    }
  };

  const formatCellValue = (
    value: any,
    columnKey: string,
    truncate: boolean = true
  ): React.ReactNode => {
    const formatter = customFormatters?.[columnKey];
    if (formatter) {
      return formatter(value);
    }

    const field = fieldMap[columnKey];
    let strValue = String(value);
    if (!field) {
      return strValue;
    }
    strValue = stringValue(value, field.dtype);
    if (truncate) {
      strValue = truncateText(strValue);
    }

    console.log("field", field, field.ftype);
    switch (field.ftype) {
      case "enum":
        return (
          <span className="text-gray-500 text-xs bg-gray-100 p-1 border border-gray-300 rounded">
            {strValue}
          </span>
        );
      case "user-profile":
        return EntityFormat.formatEntity("user-profile", value);

      default:
        return strValue;
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
        const cellNode = formatCellValue(cellValue, column.key);
        const cellTitle = cellNode == cellValue ? undefined : cellValue;

        return (
          <td key={column.key} className="dt-td" title={cellTitle}>
            {cellNode}
          </td>
        );
      })}
      <td className="dt-td px-1">
        <div className="flex gap-0 justify-between items-center w-full">
          {renderActions(rowActions, row, false, forceUpdate)}
        </div>
      </td>
    </tr>
  );
};
