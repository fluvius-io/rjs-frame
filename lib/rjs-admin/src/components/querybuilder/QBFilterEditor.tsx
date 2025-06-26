import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { AlertCircle, ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import {
  FieldInputConfig,
  FilterState,
  QueryMetadata,
} from "../../types/querybuilder";
import { Button } from "../common/Button";
import { FilterInput } from "./FilterInput";

export interface QBFilterEditorProps {
  filters: FilterState[];
  metadata: QueryMetadata;
  onFiltersChange: (filters: FilterState[]) => void;
  customInput?: Record<string, FieldInputConfig>;
}

export const QBFilterEditor: React.FC<QBFilterEditorProps> = ({
  filters,
  metadata,
  onFiltersChange,
  customInput = {},
}) => {
  // Use ref to maintain a unique incremental id without causing extra renders
  const idRef = React.useRef(1);

  // Ensure idRef is ahead of any ids that might come from props (e.g., initial queryState)
  React.useEffect(() => {
    const maxId = (filters || []).reduce((max, filter) => {
      const currentId = parseInt(filter.id.split("-")[1]) || 0;
      return Math.max(max, currentId);
    }, 0);
    if (maxId + 1 > idRef.current) {
      idRef.current = maxId + 1;
    }
  }, [filters]);

  const addFilter = (
    type: "field" | "composite",
    operator: string,
    parentId?: string
  ) => {
    const newFilter: FilterState = {
      id: `filter-${idRef.current}`,
      type,
      operator,
      field: type === "field" ? operator.split(".")[0] : undefined,
      value: type === "field" ? "" : undefined,
      children: type === "composite" ? [] : undefined,
    };

    let newFilters: FilterState[];
    if (parentId) {
      // Add to parent's children
      const updateParent = (states: FilterState[]): FilterState[] => {
        return states.map((state) => {
          if (state.id === parentId && state.children) {
            return { ...state, children: [...state.children, newFilter] };
          }
          if (state.children) {
            return { ...state, children: updateParent(state.children) };
          }
          return state;
        });
      };
      newFilters = updateParent(filters);
    } else {
      newFilters = [...filters, newFilter];
    }

    onFiltersChange(newFilters);
    idRef.current += 1;
  };

  const removeFilter = (filterId: string) => {
    const removeFromStates = (states: FilterState[]): FilterState[] => {
      return states
        .filter((state) => state.id !== filterId)
        .map((state) => ({
          ...state,
          children: state.children
            ? removeFromStates(state.children)
            : undefined,
        }));
    };

    onFiltersChange(removeFromStates(filters));
  };

  const updateFilter = (filterId: string, updates: Partial<FilterState>) => {
    const updateInStates = (states: FilterState[]): FilterState[] => {
      return states.map((state) => {
        if (state.id === filterId) {
          return { ...state, ...updates };
        }
        if (state.children) {
          return { ...state, children: updateInStates(state.children) };
        }
        return state;
      });
    };

    onFiltersChange(updateInStates(filters));
  };

  const renderFilter = (
    filter: FilterState,
    depth: number = 0
  ): React.ReactNode => {
    const indentClass =
      depth > 0 ? `qb-filter-nested-${Math.min(depth, 3)}` : "";

    if (filter.type === "composite") {
      return (
        <div
          key={filter.id}
          className={cn("qb-filter-composite", "qb-panel", indentClass)}
        >
          <div className="qb-header">
            <span className="qb-filter-operator">
              {metadata.composites[filter.operator!]?.label || filter.operator}
            </span>
            <div className="qb-filter-actions">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="outline" size="sm">
                    Add Filter <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="qb-dropdown-content">
                  <DropdownMenu.Label className="qb-dropdown-label">
                    Field Filters
                  </DropdownMenu.Label>
                  {metadata.fields.map((field) => {
                    return (
                      <DropdownMenu.Item
                        key={field.name}
                        onSelect={() =>
                          addFilter(
                            "field",
                            `${field.name}.${field.noop}`,
                            filter.id
                          )
                        }
                        className="qb-dropdown-item"
                      >
                        {field.label}
                      </DropdownMenu.Item>
                    );
                  })}
                  <DropdownMenu.Separator className="qb-dropdown-separator" />
                  <DropdownMenu.Label className="qb-dropdown-label">
                    Composite Operators
                  </DropdownMenu.Label>
                  {Object.entries(metadata.composites)
                    .filter(([key]) => key !== filter.operator)
                    .map(([key, composite]) => (
                      <DropdownMenu.Item
                        key={key}
                        onSelect={() => addFilter("composite", key, filter.id)}
                        className="qb-dropdown-item"
                      >
                        {composite.label}
                      </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(filter.id)}
                title="Remove"
              >
                ✕
              </Button>
            </div>
          </div>

          <div className="qb-filter-children qb-list">
            {filter.children && filter.children.length > 0 ? (
              filter.children.map((child) => renderFilter(child, depth + 1))
            ) : (
              <div className="qb-filter-empty">
                Empty group. Add filters or groups above.
              </div>
            )}
          </div>
        </div>
      );
    }

    // Field filter
    const fieldKey = filter.field!;
    const field = metadata.fields.find((f) => f.name === fieldKey);

    // Ensure we have a valid operator
    if (!filter.operator) {
      console.warn(`Filter ${filter.id} is missing operator, skipping render`);
      return null;
    }

    const filterMetadata = metadata.filters[filter.operator.replace("!", ".")];

    if (!field || !filterMetadata) {
      return (
        <div className="qb-filter-error">
          Field metadata [{fieldKey}] not found
        </div>
      );
    }

    const availableOperators = Object.entries(metadata.filters)
      .filter(([key]) => key.startsWith(`${fieldKey}.`))
      .map(([key, meta]) => ({ key, ...meta }));

    const isNegated = filter.operator.includes("!");

    return (
      <div key={filter.id} className={cn("qb-filter-field", indentClass)}>
        <div className="qb-filter-row">
          <span className="qb-filter-field-name">{field.label}</span>

          <Select.Root
            value={filter.operator!.replace("!", ".")}
            onValueChange={(val) => {
              const newOperator = isNegated ? val.replace(".", "!") : val;
              updateFilter(filter.id, { operator: newOperator });
            }}
          >
            <Select.Trigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "qb-filter-operator",
                  isNegated && "qb-filter-operator--negated"
                )}
              >
                {isNegated && "Not"}
                &nbsp;
                <Select.Value />
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={4}
                className="qb-dropdown-content"
              >
                <Select.Viewport className="p-1">
                  {availableOperators.map((op) => (
                    <Select.Item
                      key={op.key}
                      value={op.key}
                      className="qb-dropdown-item"
                    >
                      <Select.ItemText>{op.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <Button
            variant={isNegated ? "default" : "outline"}
            size="sm"
            onClick={() => {
              const newOperator = isNegated
                ? filter.operator!.replace("!", ".")
                : filter.operator!.replace(".", "!");
              updateFilter(filter.id, { operator: newOperator });
            }}
            title="Toggle negation"
          >
            <AlertCircle className="w-4 h-4" />
          </Button>

          <FilterInput
            operator={filter.operator!.replace("!", ".")}
            metadata={filterMetadata}
            value={filter.value || ""}
            onChange={(value) => updateFilter(filter.id, { value })}
            customConfig={customInput[filter.operator!.replace("!", ".")]}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFilter(filter.id)}
            title="Remove"
          >
            ✕
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="qb-filter-editor qb-panel">
      <div className="qb-header">
        <Label.Root className="qb-label">Filters</Label.Root>
        <div className="qb-filter-actions">
          {filters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange([])}
            >
              Clear All
            </Button>
          )}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" size="sm">
                Add Filter <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="qb-dropdown-content">
              <DropdownMenu.Label className="qb-dropdown-label">
                Field Filters
              </DropdownMenu.Label>
              {metadata.fields.map((field) => {
                return (
                  <DropdownMenu.Item
                    key={field.name}
                    onSelect={() =>
                      addFilter("field", `${field.name}.${field.noop}`)
                    }
                    className="qb-dropdown-item"
                  >
                    {field.label}
                  </DropdownMenu.Item>
                );
              })}
              <DropdownMenu.Separator className="qb-dropdown-separator" />
              <DropdownMenu.Label className="qb-dropdown-label">
                Composite Operators
              </DropdownMenu.Label>
              {Object.entries(metadata.composites).map(([key, composite]) => (
                <DropdownMenu.Item
                  key={key}
                  onSelect={() => addFilter("composite", key)}
                  className="qb-dropdown-item"
                >
                  {composite.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className="qb-list">
        {filters.map((filter) => renderFilter(filter))}

        {filters.length === 0 && (
          <div className="qb-filter-empty">
            No filters added. Use "Add Filter" to create field filters or
            composite groups.
          </div>
        )}
      </div>
    </div>
  );
};
