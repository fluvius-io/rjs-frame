import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Label from "@radix-ui/react-label";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import {
  QueryFieldMetadata,
  QueryMetadata,
  SortItem,
} from "../../types/querybuilder";
import { Button } from "../common/Button";

export interface QBSortEditorProps {
  sort: SortItem[];
  metadata: QueryMetadata;
  onSortChange: (sort: SortItem[]) => void;
}

export const QBSortEditor: React.FC<QBSortEditorProps> = ({
  sort,
  metadata,
  onSortChange,
}) => {
  const addSortField = (fieldKey: string) => {
    const newSort = [...sort, { field: fieldKey, direction: "asc" as const }];
    onSortChange(newSort);
  };

  const removeSortField = (index: number) => {
    const newSort = sort.filter((_, i) => i !== index);
    onSortChange(newSort);
  };

  const toggleSortDirection = (index: number) => {
    const newSort = [...sort];
    newSort[index] = {
      ...newSort[index],
      direction: newSort[index].direction === "asc" ? "desc" : "asc",
    };
    onSortChange(newSort);
  };

  const moveSortField = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sort.length - 1)
    ) {
      return;
    }
    const newSort = [...sort];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSort[index], newSort[targetIndex]] = [
      newSort[targetIndex],
      newSort[index],
    ];
    onSortChange(newSort);
  };

  const availableFields = metadata.fields
    .filter((field) => {
      return field.sortable && !sort.some((s) => s.field === field.name);
    })
    .map((field) => ({
      key: field.name,
      label: field.label,
    }));

  return (
    <div className="qb-sort-editor qb-panel">
      <div className="qb-header">
        <Label.Root className="qb-label">Sort By</Label.Root>
        <div className="qb-sort-actions">
          {sort && sort.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => onSortChange([])}>
              Clear All
            </Button>
          )}
          {availableFields.length > 0 && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" size="sm">
                  Add Sort Field <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="qb-dropdown-content">
                <DropdownMenu.Label className="qb-dropdown-label">
                  Available Fields
                </DropdownMenu.Label>
                {availableFields.map(({ key, label }) => (
                  <DropdownMenu.Item
                    key={key}
                    onSelect={() => addSortField(key)}
                    className="qb-dropdown-item"
                  >
                    {label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </div>
      </div>

      <div className="qb-list">
        {sort.map((sortItem, index) => {
          const field = metadata.fields.find(
            (f) => f.name === sortItem.field
          ) as QueryFieldMetadata;

          return (
            <div
              key={`${sortItem.field}-${sortItem.direction}-${index}`}
              className="qb-sort-item"
            >
              <Button
                variant={sortItem.direction === "desc" ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSortDirection(index)}
                title="Toggle direction"
                className="min-w-32"
              >
                {sortItem.direction === "desc" ? "Descending" : "Ascending"}
              </Button>

              <span className="qb-sort-priority">{index + 1}.</span>
              <span className="qb-sort-field">
                {field?.label || sortItem.field} (
                {sortItem.direction.toUpperCase()})
              </span>
              <div className="qb-sort-controls">
                {index > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSortField(index, "up")}
                    title="Move up"
                  >
                    ↑
                  </Button>
                )}
                {index < sort.length - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSortField(index, "down")}
                    title="Move down"
                  >
                    ↓
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSortField(index)}
                title="Remove"
              >
                ✕
              </Button>
            </div>
          );
        })}

        {sort.length === 0 && (
          <div className="qb-sort-empty">
            No sort fields added. Use "Add Sort Field" to add sorting.
          </div>
        )}
      </div>
    </div>
  );
};
