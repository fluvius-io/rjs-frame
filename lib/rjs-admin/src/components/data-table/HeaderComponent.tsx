import React from "react";
import { cn } from "../../lib/utils";
import "../../styles/components/DataTable.css";
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
    return fieldMeta.identifier
      ? "data-table-header__cell--center"
      : "data-table-header__cell--left";
  };

  // Return empty header if no metadata or fields
  if (!metadata?.fields) {
    return (
      <thead className="data-table-header">
        <tr className="data-table-header__row">
          <th className="data-table-header__cell">Loading...</th>
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
    <thead className="data-table-header">
      <tr className="data-table-header__row">
        {visibleFields.map((fieldMeta) => (
          <th
            key={fieldMeta.key}
            className={cn(
              "data-table-header__cell",
              getAlignmentClass(fieldMeta),
              fieldMeta.sortable &&
                onSort &&
                "data-table-header__cell--sortable"
            )}
            onClick={() => handleSort(fieldMeta)}
          >
            <div className="data-table-header__content">
              <span className="data-table-header__label">
                {fieldMeta.label}
              </span>
              {fieldMeta.sortable && onSort && (
                <span className="data-table-header__sort-icon">
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
