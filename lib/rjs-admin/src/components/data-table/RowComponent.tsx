import React from "react";
import { cn } from "../../lib/utils";
import "../../styles/components/DataTable.css";
import { QueryFieldMetadata, RowComponentProps } from "./types";

const RowComponent: React.FC<RowComponentProps> = ({
  metadata,
  data,
  index,
  queryState,
}) => {
  const getAlignmentClass = (fieldMeta: QueryFieldMetadata) => {
    return fieldMeta.identifier
      ? "data-table-row__cell--center"
      : "data-table-row__cell--left";
  };

  const formatValue = (value: any, fieldMeta: QueryFieldMetadata) => {
    // Simple formatting for common data types
    if (value === null || value === undefined) {
      return "-";
    }

    if (fieldMeta.dtype === "date") {
      return new Date(value).toLocaleDateString();
    }

    if (typeof value === "boolean") {
      return value ? "✓" : "✗";
    }

    if (typeof value === "number") {
      return value.toLocaleString();
    }

    return String(value);
  };

  // Return empty row if no metadata or fields
  if (!metadata?.fields) {
    return (
      <tr
        className={cn(
          "data-table-row",
          index % 2 === 0 ? "data-table-row--even" : "data-table-row--odd"
        )}
      >
        <td className="data-table-row__cell data-table-row__loading">
          Loading...
        </td>
      </tr>
    );
  }

  // Filter out hidden fields
  const visibleFields =
    queryState.visibleFields.length > 0
      ? queryState.visibleFields
      : Object.values(metadata.fields);

  return (
    <tr
      className={cn(
        "data-table-row",
        index % 2 === 0 ? "data-table-row--even" : "data-table-row--odd"
      )}
    >
      {visibleFields.map((fieldMeta) => (
        <td
          key={fieldMeta.key}
          className={cn("data-table-row__cell", getAlignmentClass(fieldMeta))}
        >
          {formatValue(data[fieldMeta.key], fieldMeta)}
        </td>
      ))}
    </tr>
  );
};

export default RowComponent;
