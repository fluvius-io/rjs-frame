import React from "react";
import { cn } from "../../lib/utils";
import { QueryFieldMetadata, RowComponentProps } from "./types";

const RowComponent: React.FC<RowComponentProps> = ({
  metadata,
  data,
  index,
  queryState,
}) => {
  const getAlignmentClass = (fieldMeta: QueryFieldMetadata) => {
    if (fieldMeta.identifier) return "text-center";
    return "text-left";
  };

  const formatValue = (value: any, fieldMeta: QueryFieldMetadata) => {
    // Simple formatting for common data types
    if (value === null || value === undefined) {
      return "-";
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
          "border-b hover:bg-muted/30 transition-colors",
          index % 2 === 0 ? "bg-background" : "bg-muted/10"
        )}
      >
        <td className="px-4 py-3 text-sm text-muted-foreground">Loading...</td>
      </tr>
    );
  }

  // Filter out hidden fields
  const visibleFields =
    queryState.visibleFields.length > 0
      ? queryState.visibleFields
      : Object.values(metadata.fields);

  console.log("visibleFields", visibleFields);

  return (
    <tr
      className={cn(
        "border-b hover:bg-muted/30 transition-colors",
        index % 2 === 0 ? "bg-background" : "bg-muted/10"
      )}
    >
      {visibleFields.map((fieldMeta) => (
        <td
          key={fieldMeta.key}
          className={cn("px-4 py-3 text-sm", getAlignmentClass(fieldMeta))}
        >
          {formatValue(data[fieldMeta.key], fieldMeta.key)}
        </td>
      ))}
    </tr>
  );
};

export default RowComponent;
