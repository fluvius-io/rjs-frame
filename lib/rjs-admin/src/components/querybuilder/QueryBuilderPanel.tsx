import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Label from "@radix-ui/react-label";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import {
  FilterInputConfig,
  QueryMetadata,
  QueryValue,
} from "../../types/querybuilder";
import { FilterInput } from "./FilterInput";

export interface QueryBuilderPanelProps {
  /**
   * List of query operators to render as inputs
   * e.g., ["name.eq", "age.gt", "email.ilike"]
   */
  operators: string[];
  /**
   * Query metadata containing field and filter definitions
   */
  metadata: QueryMetadata;
  /**
   * Current filter values
   */
  values?: Record<string, QueryValue>;
  /**
   * Callback when filter values change
   */
  onValuesChange?: (values: Record<string, QueryValue>) => void;
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
  operators,
  metadata,
  values = {},
  onValuesChange,
  customInput = {},
  className,
  title = "Filters",
}) => {
  // Early return if metadata is not available
  if (!metadata || !metadata.filters) {
    return (
      <div className={cn("qb-panel qb-panel--loading", className)}>
        <div className="qb-loading">
          <span>Loading query panel...</span>
        </div>
      </div>
    );
  }

  const handleValueChange = (operator: string, value: QueryValue) => {
    const newValues = { ...values };

    if (value === undefined || value === null || value === "") {
      delete newValues[operator];
    } else {
      newValues[operator] = value;
    }

    onValuesChange?.(newValues);
  };

  const handleOperatorChange = (oldOperator: string, newOperator: string) => {
    const newValues = { ...values };
    const oldValue = newValues[oldOperator];

    // Remove old operator value
    delete newValues[oldOperator];

    // Add new operator with the same value if it exists
    if (oldValue !== undefined && oldValue !== null && oldValue !== "") {
      newValues[newOperator] = oldValue;
    }

    onValuesChange?.(newValues);
  };

  const getAvailableOperatorsForField = (fieldName: string): string[] => {
    return Object.keys(metadata.filters).filter((operator) => {
      const filter = metadata.filters[operator];
      return filter.field === fieldName;
    });
  };

  const getFieldNameFromOperator = (operator: string): string => {
    const filter = metadata.filters[operator];
    return filter?.field || operator.split(".")[0];
  };

  const renderOperatorInput = (operator: string) => {
    // Get filter metadata for this operator
    const filterMetadata = metadata.filters[operator];

    if (!filterMetadata) {
      console.warn(`Filter metadata not found for operator: ${operator}`);
      return null;
    }

    const currentValue = values[operator];
    const fieldName = filterMetadata.field;
    const availableOperators = getAvailableOperatorsForField(fieldName);

    return (
      <div key={operator} className="qb-panel-item">
        <div className="qb-panel-header">
          <Label.Root className="qb-label">{filterMetadata.label}</Label.Root>

          {availableOperators.length > 1 && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="qb-operator-dropdown-trigger">
                  <span className="qb-operator-current">
                    {operator.includes("!") ? "Not " : ""}
                    {operator.split(".")[1] || operator.split("!")[1]}
                  </span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="qb-dropdown-content">
                <DropdownMenu.Label className="qb-dropdown-label">
                  Operators for {fieldName}
                </DropdownMenu.Label>
                {availableOperators.map((availableOperator) => {
                  const availableFilter = metadata.filters[availableOperator];
                  const isNegated = availableOperator.includes("!");
                  const operatorName = isNegated
                    ? availableOperator.split("!")[1]
                    : availableOperator.split(".")[1];

                  return (
                    <DropdownMenu.Item
                      key={availableOperator}
                      onSelect={() =>
                        handleOperatorChange(operator, availableOperator)
                      }
                      className={cn(
                        "qb-dropdown-item",
                        availableOperator === operator &&
                          "qb-dropdown-item--selected"
                      )}
                    >
                      {isNegated && "Not "}
                      {availableFilter?.label || operatorName}
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </div>

        <FilterInput
          operator={operator}
          metadata={filterMetadata}
          value={currentValue}
          onChange={(value) => handleValueChange(operator, value)}
          customConfig={customInput[operator]}
          className="qb-filter-input--panel"
        />
      </div>
    );
  };

  const validOperators = operators.filter(
    (operator) => metadata.filters[operator]
  );

  if (validOperators.length === 0) {
    return (
      <div className={cn("qb-panel", className)}>
        <div className="qb-header">
          <Label.Root className="qb-label">{title}</Label.Root>
        </div>
        <div className="qb-panel-empty">
          <span>No valid operators provided</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("qb-panel", className)}>
      <div className="qb-header">
        <Label.Root className="qb-label">{title}</Label.Root>
      </div>

      <div className="qb-panel-content">
        {validOperators.map(renderOperatorInput)}
      </div>
    </div>
  );
};

QueryBuilderPanel.displayName = "QueryBuilderPanel";
