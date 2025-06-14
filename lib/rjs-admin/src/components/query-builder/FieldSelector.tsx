import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../common/Button";
import { FieldSelectorProps } from "./types";
import { getAvailableFields } from "./utils";

const FieldSelector: React.FC<FieldSelectorProps> = ({
  metadata,
  selectedFields,
  onSelectedFieldsChange,
}) => {
  const availableFields = getAvailableFields(metadata);

  const handleFieldToggle = (fieldKey: string, isSelected: boolean) => {
    if (isSelected) {
      // Add to selected fields
      if (!selectedFields.some((field) => field.key === fieldKey)) {
        onSelectedFieldsChange([...selectedFields, metadata.fields[fieldKey]]);
      }
    } else {
      // Remove from selected fields
      onSelectedFieldsChange(
        selectedFields.filter((field) => field.key !== fieldKey)
      );
    }
    console.log("handleFieldToggle", fieldKey, isSelected, selectedFields);
  };

  const clearAllSelections = () => {
    onSelectedFieldsChange([]);
  };

  const selectAllFields = () => {
    onSelectedFieldsChange(
      availableFields.map((fieldKey) => metadata.fields[fieldKey])
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Field Selection ({selectedFields.length})
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAllFields}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={clearAllSelections}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Select Fields Section */}
        <div>
          <div className="max-h-48 overflow-y-auto border rounded p-2 bg-green-50/50">
            {availableFields.map((fieldKey) => {
              const fieldMeta = metadata.fields[fieldKey];
              const isSelected = selectedFields.some(
                (field) => field.key === fieldKey
              );

              return (
                <label
                  key={fieldKey}
                  className={cn(
                    "flex items-center gap-2 p-1 rounded text-sm cursor-pointer hover:bg-green-100",
                    isSelected && "bg-green-100"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) =>
                      handleFieldToggle(fieldKey, e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="font-mono text-xs">{fieldMeta.label}</span>
                  <span className="text-gray-600">({fieldKey})</span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-green-600 mt-1">
            If no fields selected, all fields will be included
          </p>
        </div>

        {/* Summary */}
      </div>
    </div>
  );
};

export default FieldSelector;
