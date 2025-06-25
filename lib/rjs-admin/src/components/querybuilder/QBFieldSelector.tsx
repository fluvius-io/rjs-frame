import * as Checkbox from "@radix-ui/react-checkbox";
import * as Label from "@radix-ui/react-label";
import * as React from "react";
import { cn } from "../../lib/utils";
import { QueryFieldMetadata, QueryMetadata } from "../../types/querybuilder";

export interface QBFieldSelectorProps {
  select: string[];
  metadata: QueryMetadata;
  onSelectChange: (fields: string[]) => void;
}

export const QBFieldSelector: React.FC<QBFieldSelectorProps> = ({
  select,
  metadata,
  onSelectChange,
}) => {
  const handleFieldToggle = (fieldKey: string, checked: boolean) => {
    const newSelect = checked
      ? [...select, fieldKey]
      : select.filter((field) => field !== fieldKey);
    onSelectChange(newSelect);
  };

  // Drag state
  const dragFrom = React.useRef<number | null>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number>(-1);

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    dragFrom.current = index;
    e.dataTransfer.effectAllowed = "move";
    if (listRef.current) {
      const listHeight = listRef.current.offsetHeight;
      listRef.current.style.height = `${listHeight}px`;
    }
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (hoverIndex !== index) setHoverIndex(index);
  };

  const handleDragLeave = () => setHoverIndex(-1);

  const handleDrop = () => (e: React.DragEvent) => {
    e.preventDefault();

    const fromIndex = dragFrom.current;
    dragFrom.current = null;
    setHoverIndex(-1);
    if (listRef.current) {
      listRef.current.style.height = "auto";
    }

    if (fromIndex === null || fromIndex === hoverIndex) return;
    const newOrder = [...select];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(
      fromIndex > hoverIndex ? hoverIndex : hoverIndex - 1,
      0,
      moved
    );

    onSelectChange(newOrder);
  };

  const handleDragEnd = () => {
    dragFrom.current = null;
    setHoverIndex(-1);
  };

  const listRef = React.useRef<HTMLDivElement>(null);

  let unSelectedFields = metadata.fields.filter(
    (f) => !select.includes(f.name)
  );
  let showSeparator = unSelectedFields.length > 0 && select.length > 0;
  return (
    <div className="qb-field-selector qb-panel">
      <div className="qb-header">
        <Label.Root className="qb-label">Select Fields</Label.Root>
      </div>
      <div
        className="qb-list qb-field-cards"
        onDrop={handleDrop()}
        onDragOver={(e) => e.preventDefault()}
        ref={listRef}
      >
        {/* Selected fields with placeholder */}
        {select.map((fieldName, idx) => {
          const field = metadata.fields.find((f) => f.name === fieldName);
          if (!field) return null;
          const fieldMetadata = field as QueryFieldMetadata;
          const isSelected = true;
          const isPlaceholderBefore = hoverIndex === idx;
          return (
            <React.Fragment key={field.name}>
              {isPlaceholderBefore && (
                <div
                  onDrop={handleDrop()}
                  onDragOver={(e) => e.preventDefault()}
                  className="qb-field-card--placeholder"
                />
              )}
              {dragFrom.current === idx || (
                <div
                  className={cn(
                    "qb-field-card cursor-move",
                    isSelected && "qb-field-card--selected"
                  )}
                  draggable
                  onDragStart={handleDragStart(idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver(
                    isPlaceholderBefore ? idx + 1 : idx
                  )}
                  onDrop={handleDrop()}
                  onClick={() => handleFieldToggle(field.name, !isSelected)}
                >
                  {/* Checkbox */}
                  <Checkbox.Root
                    id={`field-${field.name}`}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleFieldToggle(field.name, checked === true)
                    }
                    className="qb-checkbox"
                  >
                    <Checkbox.Indicator className="qb-checkbox-indicator">
                      ✓
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  <div className="qb-field-card-content">
                    <div className="qb-field-name flex items-center flex-row justify-between">
                      {fieldMetadata.label}
                    </div>
                    {fieldMetadata.desc && (
                      <span className="qb-field-desc text-xs">
                        {fieldMetadata.desc}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        {hoverIndex !== -1 && hoverIndex >= select.length && (
          <div className="qb-field-card border-2 border-dashed border-gray-300 h-12 w-48" />
        )}
        {/* Unselected fields */}
        {showSeparator && (
          <div className="border-t-2 my-2 w-full border-gray-200 border-dashed"></div>
        )}
        {unSelectedFields.map((field) => {
          const isSelected = false;
          return (
            <div
              key={field.name}
              className={cn(
                "qb-field-card",
                isSelected && "qb-field-card--selected"
              )}
              onClick={() => handleFieldToggle(field.name, !isSelected)}
            >
              <Checkbox.Root
                id={`field-${field.name}`}
                checked={isSelected}
                onCheckedChange={(checked) =>
                  handleFieldToggle(field.name, checked === true)
                }
                className="qb-checkbox"
              >
                <Checkbox.Indicator className="qb-checkbox-indicator">
                  ✓
                </Checkbox.Indicator>
              </Checkbox.Root>
              <div className="qb-field-card-content">
                <span className="qb-field-name text-muted-foreground">
                  {field.label}
                </span>
                {field.desc && (
                  <span className="qb-field-desc text-xs text-muted-foreground">
                    {field.desc}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
