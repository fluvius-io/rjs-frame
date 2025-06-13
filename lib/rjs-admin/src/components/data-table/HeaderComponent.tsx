import React from "react";
import { cn } from "../../lib/utils";
import { HeaderComponentProps, QueryFieldMetadata } from "./types";

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  metadata,
  queryState,
  onSort,
}) => {
  const handleSort = (fieldMeta: QueryFieldMetadata) => {
    if (!fieldMeta?.sortable || !onSort) return;

    const currentSort = queryState.sortRules[0];
    const newDirection =
      currentSort?.field === fieldMeta.key && currentSort.direction === "asc"
        ? "desc"
        : "asc";

    onSort({ field: fieldMeta.key, direction: newDirection });
  };

  const getSortIcon = (fieldMeta: QueryFieldMetadata) => {
    if (!fieldMeta?.sortable) return null;

    const currentSort = queryState.sortRules[0];
    if (currentSort?.field === fieldMeta.key) {
      return currentSort.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  const getAlignmentClass = (fieldMeta: QueryFieldMetadata) => {
    if (fieldMeta.identifier) return "text-center";
    return "text-left";
  };

  // Return empty header if no metadata or fields
  if (!metadata?.fields) {
    return (
      <thead className="bg-muted/50">
        <tr className="border-b">
          <th className="px-4 py-3 font-medium text-sm text-muted-foreground">
            Loading...
          </th>
        </tr>
      </thead>
    );
  }

  // Filter out hidden fields and only show selected fields
  const visibleFields =
    queryState.visibleFields.length > 0
      ? queryState.visibleFields
      : Object.values(metadata.fields);

  return (
    <thead className="bg-muted/50">
      <tr className="border-b">
        {visibleFields.map((fieldMeta) => (
          <th
            key={fieldMeta.key}
            className={cn(
              "px-4 py-3 font-medium text-sm text-muted-foreground",
              getAlignmentClass(fieldMeta),
              fieldMeta.sortable &&
                onSort &&
                "cursor-pointer hover:text-foreground transition-colors"
            )}
            onClick={() => handleSort(fieldMeta)}
          >
            <div className="flex items-center gap-2">
              <span>{fieldMeta.label}</span>
              {fieldMeta.sortable && onSort && (
                <span className="text-xs opacity-60">
                  {getSortIcon(fieldMeta)}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default HeaderComponent;
