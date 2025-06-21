import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Label from "@radix-ui/react-label";
import { AlertCircle, ChevronDown, FilterX, TextSearch } from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { APIManager } from "rjs-frame";
import { cn } from "../../lib/utils";
import {
  FilterInputConfig,
  FilterState,
  QueryMetadata,
  QueryValue,
} from "../../types/querybuilder";
import { Button } from "../common/Button";
import { FilterInput } from "./FilterInput";

export interface QueryBuilderPanelProps {
  /**
   * List of field names to render as filter inputs
   * e.g., ["name", "email", "age"]
   */
  fields: string[];
  /**
   * Query metadata source (e.g., "idm:organization")
   */
  metaSource: string;
  /**
   * Current filter states for each field
   */
  filterStates?: Record<string, FilterState>;
  /**
   * Callback when filter states change
   */
  onFilterStatesChange?: (filterStates: Record<string, FilterState>) => void;
  /**
   * Custom input configurations for specific operators
   */
  customInput?: Record<string, FilterInputConfig>;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Title for the panel
   */
  title?: string;
}

export const QueryBuilderPanel: React.FC<QueryBuilderPanelProps> = ({
  fields,
  metaSource,
  filterStates: propFilterStates = {},
  onFilterStatesChange,
  customInput = {},
  className,
  title = "Filters",
}) => {
  const [metadata, setMetadata] = useState<QueryMetadata | null>(null);
  const [filterStates, setFilterStates] =
    useState<Record<string, FilterState>>(propFilterStates);

  // Build fieldMap for fast field metadata lookup
  const fieldMap = useMemo(() => {
    if (!metadata?.fields) return new Map();

    return new Map(metadata.fields.map((field) => [field.name, field]));
  }, [metadata?.fields]);

  const fetchMetadata = useCallback(async () => {
    try {
      const response = await APIManager.queryMeta(metaSource);
      setMetadata(response.data as QueryMetadata);
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    }
  }, [metaSource]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // Initialize filter states when metadata is loaded
  useEffect(() => {
    if (!metadata?.fields || !metadata?.filters) return;

    const newFilterStates: Record<string, FilterState> = {};

    fields.forEach((fieldName) => {
      const field = fieldMap.get(fieldName);
      if (!field) return;

      // Check if there's already a filter state for this field
      const existingFilterState = filterStates[fieldName];

      if (existingFilterState) {
        newFilterStates[fieldName] = existingFilterState;
      } else {
        // Create new filter state with default operator
        newFilterStates[fieldName] = {
          id: `filter-${fieldName}`,
          type: "field",
          field: fieldName,
          operator: `${fieldName}.${field.noop}`,
          value: undefined,
        };
      }
    });

    setFilterStates(newFilterStates);
  }, [metadata, fieldMap, fields]);

  // Early return if metadata is not available
  if (!metadata || !metadata.filters || !metadata.fields) {
    return (
      <div className={cn("qb-panel qb-panel--loading", className)}>
        <div className="qb-loading">
          <span>Loading query panel...</span>
        </div>
      </div>
    );
  }

  const getDefaultOperatorForField = (fieldName: string): string => {
    const field = fieldMap.get(fieldName);
    if (!field) return `${fieldName}.eq`;

    return `${fieldName}.${field.noop}`;
  };

  const getAvailableOperators = (fieldName: string): string[] => {
    return Object.keys(metadata.filters).filter((operator) => {
      const filter = metadata.filters[operator];
      return filter && filter.field === fieldName;
    });
  };

  const handleValueChange = (fieldName: string, value: QueryValue) => {
    const currentFilterState = filterStates[fieldName];
    if (!currentFilterState) return;

    const newFilterState: FilterState = {
      ...currentFilterState,
      value:
        value === undefined || value === null || value === ""
          ? undefined
          : value,
    };

    const newFilterStates = {
      ...filterStates,
      [fieldName]: newFilterState,
    };

    setFilterStates(newFilterStates);
    onFilterStatesChange?.(newFilterStates);
  };

  const handleOperatorChange = (fieldName: string, newOperator: string) => {
    const currentFilterState = filterStates[fieldName];
    if (!currentFilterState) return;

    const newFilterState: FilterState = {
      ...currentFilterState,
      operator: newOperator,
    };

    const newFilterStates = {
      ...filterStates,
      [fieldName]: newFilterState,
    };

    setFilterStates(newFilterStates);
    onFilterStatesChange?.(newFilterStates);
  };

  const handleNegationToggle = (fieldName: string) => {
    const currentFilterState = filterStates[fieldName];
    if (!currentFilterState) return;

    let newOperator: string;
    if (currentFilterState.operator?.includes("!")) {
      // Remove negation
      newOperator = currentFilterState.operator.replace("!", ".");
    } else {
      // Add negation
      newOperator =
        currentFilterState.operator?.replace(".", "!") ||
        getDefaultOperatorForField(fieldName);
    }

    const newFilterState: FilterState = {
      ...currentFilterState,
      operator: newOperator,
    };

    const newFilterStates = {
      ...filterStates,
      [fieldName]: newFilterState,
    };

    setFilterStates(newFilterStates);
    onFilterStatesChange?.(newFilterStates);
  };

  const handleClearAll = () => {
    // Reset all filter states to default values
    const clearedFilterStates: Record<string, FilterState> = {};

    fields.forEach((fieldName) => {
      const field = fieldMap.get(fieldName);
      if (!field) return;

      clearedFilterStates[fieldName] = {
        id: `filter-${fieldName}`,
        type: "field",
        field: fieldName,
        operator: `${fieldName}.${field.noop}`,
        value: undefined,
      };
    });

    setFilterStates(clearedFilterStates);
    onFilterStatesChange?.(clearedFilterStates);
  };

  // Check if any filters have values
  const hasActiveFilters = Object.values(filterStates).some(
    (filterState) => filterState.value !== undefined && filterState.value !== ""
  );

  const getFilterMetadata = (operator: string) => {
    return metadata.filters[operator.replace("!", ".")];
  };

  const renderFieldInput = (fieldName: string) => {
    const field = fieldMap.get(fieldName);
    if (!field) {
      console.warn(`Field not found in metadata: ${fieldName}`);
      return null;
    }

    const filterState = filterStates[fieldName];
    if (!filterState) return null;

    const currentOperator =
      filterState.operator || getDefaultOperatorForField(fieldName);
    const filterMetadata = getFilterMetadata(currentOperator);

    if (!filterMetadata) {
      console.warn(
        `Filter metadata not found for operator: ${currentOperator}`
      );
      return null;
    }

    const currentValue = filterState.value;
    const availableOperators = getAvailableOperators(fieldName);
    const isNegated = currentOperator.includes("!");

    return (
      <div key={fieldName} className="qb-panel-item">
        <div className="qb-panel-header">
          <Label.Root className="qb-label text-ellipsis text-nowrap">
            {field.label}
          </Label.Root>

          <div className="qb-panel-controls">
            {availableOperators.length > 1 && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="qb-operator-dropdown-trigger">
                    <span className="qb-operator-current">
                      {isNegated ? "Not " : ""}
                      {filterMetadata.label}
                    </span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="qb-dropdown-content">
                  {availableOperators.map((operator) => {
                    const operatorFilter = metadata.filters[operator];
                    const operatorIsNegated = operator.includes("!");

                    if (!operatorFilter) return null;

                    return (
                      <DropdownMenu.Item
                        key={operator}
                        onSelect={() =>
                          handleOperatorChange(fieldName, operator)
                        }
                        className={cn(
                          "qb-dropdown-item",
                          operator === currentOperator &&
                            "qb-dropdown-item--selected"
                        )}
                      >
                        {operatorIsNegated && "Not "}
                        {operatorFilter?.label || operator}
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}

            <button
              onClick={() => handleNegationToggle(fieldName)}
              className={cn(
                "qb-negation-button",
                isNegated && "qb-negation-button--active"
              )}
              title={isNegated ? "Remove negation" : "Add negation"}
            >
              <AlertCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        <FilterInput
          operator={currentOperator}
          metadata={filterMetadata}
          value={currentValue || ""}
          onChange={(value) => handleValueChange(fieldName, value)}
          customConfig={customInput[currentOperator]}
          className="qb-filter-input--panel"
        />
      </div>
    );
  };

  const validFields = fields.filter((fieldName) => fieldMap.has(fieldName));

  if (validFields.length === 0) {
    return (
      <div className={cn("rjs-panel", className)}>
        <div className="rjs-panel-header">
          <Label.Root className="rjs-panel-title">{title}</Label.Root>
        </div>
        <div className="rjs-panel-section p-4">
          <span>No valid fields provided</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rjs-panel", className)}>
      <div className="rjs-panel-header">
        <div className="flex gap-2 w-full items-center">
          <TextSearch className="w-5 h-5 cursor-pointer" />
          <h2 className="rjs-panel-title">{title}</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="rjs-panel-clear-button"
            title="Clear all filters"
          >
            <FilterX className="w-4 h-4 mr-1 text-red-500" />
          </Button>
        )}
      </div>

      <div className="rjs-panel-section">
        {validFields.map(renderFieldInput)}
      </div>
    </div>
  );
};

QueryBuilderPanel.displayName = "QueryBuilderPanel";
