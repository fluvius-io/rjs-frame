import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../common/Button";
import FieldFilter from "./FieldFilter";
import { AddFilterDropdown } from "./FilterBuilder";
import {
  CompositeFilterGroupProps,
  CompositeFilterRule,
  FieldFilterRule,
  FilterRule,
} from "./types";
import {
  generateFilterId,
  getAvailableFields,
  getOperatorsForField,
} from "./utils";

const CompositeFilterGroup = memo<CompositeFilterGroupProps>(
  ({
    metadata,
    filter,
    onFilterChange,
    onRemove,
    depth = 0,
    isRoot = false,
  }) => {
    const maxDepth = 5; // Prevent infinite nesting
    const availableFields = getAvailableFields(metadata);
    const hasCompositeOperators =
      metadata.operators &&
      Object.values(metadata.operators).some(
        (param: any) => param.field_name === ""
      );

    // Use refs to capture latest values without causing re-renders
    const filterRef = useRef(filter);
    const onFilterChangeRef = useRef(onFilterChange);

    useEffect(() => {
      filterRef.current = filter;
      onFilterChangeRef.current = onFilterChange;
    }, [filter, onFilterChange]);

    const addFieldFilter = useCallback(
      (fieldName: string) => {
        const availableOperators = getOperatorsForField(fieldName, metadata);

        const newFilter: FieldFilterRule = {
          id: generateFilterId(),
          type: "field",
          field: fieldName,
          operator: availableOperators[0] || "",
          value: "",
          negate: false,
        };

        onFilterChangeRef.current({
          ...filterRef.current,
          children: [...filterRef.current.children, newFilter],
        });
      },
      [metadata]
    );

    const addCompositeFilter = useCallback((operator: ":and" | ":or") => {
      const newFilter: CompositeFilterRule = {
        id: generateFilterId(),
        type: "composite",
        operator,
        children: [],
        negate: false,
      };

      onFilterChangeRef.current({
        ...filterRef.current,
        children: [...filterRef.current.children, newFilter],
      });
    }, []);

    const updateChild = useCallback(
      (index: number, updatedChild: FilterRule) => {
        const newChildren = [...filterRef.current.children];
        newChildren[index] = updatedChild;
        onFilterChangeRef.current({
          ...filterRef.current,
          children: newChildren,
        });
      },
      []
    );

    const removeChild = useCallback((index: number) => {
      const newChildren = filterRef.current.children.filter(
        (_, i) => i !== index
      );
      onFilterChangeRef.current({
        ...filterRef.current,
        children: newChildren,
      });
    }, []);

    const toggleNegate = useCallback(() => {
      onFilterChangeRef.current({
        ...filterRef.current,
        negate: !filterRef.current.negate,
      });
    }, []);

    const changeOperator = useCallback((newOperator: ":and" | ":or") => {
      onFilterChangeRef.current({
        ...filterRef.current,
        operator: newOperator,
      });
    }, []);

    const operatorDisplay = filter.operator === ":and" ? "AND" : "OR";
    const alternateOperator = filter.operator === ":and" ? ":or" : ":and";
    const alternateDisplay = alternateOperator === ":and" ? "AND" : "OR";

    return (
      <div className={cn(depth > 0 && "ml-4")}>
        {/* Header with operator and controls */}
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-3">
            {/* Operator Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeOperator(alternateOperator)}
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded border",
                  "transition-colors hover:bg-gray-100",
                  filter.operator === ":and"
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "bg-green-100 border-green-300 text-green-700"
                )}
                title={`Click to change to ${alternateDisplay}`}
              >
                {operatorDisplay}
              </button>
              <div>
                <AddFilterDropdown
                  metadata={metadata}
                  onAddFilter={addFieldFilter}
                  onAddGroup={
                    hasCompositeOperators && depth < maxDepth
                      ? addCompositeFilter
                      : undefined
                  }
                  disabled={availableFields.length === 0}
                  showGroupOptions={hasCompositeOperators && depth < maxDepth}
                />

                {depth >= maxDepth && (
                  <span className="text-xs text-gray-500">
                    Maximum nesting depth reached
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isRoot && (
            <div className="flex gap-2">
              <button
                onClick={toggleNegate}
                className={cn(
                  "p-1 rounded border px-2",
                  filter.negate
                    ? "bg-orange-100 border-orange-300 text-orange-600"
                    : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
                )}
                title={
                  filter.negate ? "Remove NOT condition" : "Add NOT condition"
                }
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
              </button>
              <Button variant="outline" size="sm" onClick={onRemove}>
                Remove Group
              </Button>
            </div>
          )}
        </div>

        {/* Children */}
        <div
          className={cn(
            "space-y-2 rounded-md border p-3",
            (filter.negate && "bg-red-50") || "bg-gray-100 "
          )}
        >
          {filter.children.length === 0 && (
            <div className="text-sm text-gray-500 italic text-center py-2">
              This group is empty. Add some filters below.
            </div>
          )}

          {filter.children.map((child, index) => (
            <div key={child.id} className="space-y-2">
              {/* Child filter */}
              {child.type === "field" ? (
                <FieldFilter
                  metadata={metadata}
                  filter={child}
                  onFilterChange={(updatedChild: FieldFilterRule) =>
                    updateChild(index, updatedChild)
                  }
                  onRemove={() => removeChild(index)}
                />
              ) : (
                <CompositeFilterGroup
                  metadata={metadata}
                  filter={child}
                  onFilterChange={(updatedChild: CompositeFilterRule) =>
                    updateChild(index, updatedChild)
                  }
                  onRemove={() => removeChild(index)}
                  depth={depth + 1}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CompositeFilterGroup.displayName = "CompositeFilterGroup";

export default CompositeFilterGroup;
