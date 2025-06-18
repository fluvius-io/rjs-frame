import * as Checkbox from "@radix-ui/react-checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { AlertCircle, ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import {
  FilterInputConfig,
  FilterState,
  QueryBuilderProps,
  QueryFieldMetadata,
  QueryMetadata,
  QueryStatement,
  QueryValue,
  SortItem,
} from "../../types/querybuilder";
import { Button } from "../common/Button";
import { FilterInput } from "./FilterInput";

// QBTextInput Component for search functionality
interface QBTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QBTextInput: React.FC<QBTextInputProps> = ({
  value,
  onChange,
  placeholder = "Enter search terms...",
}) => {
  return (
    <div className="qb-text-input qb-panel">
      <div className="qb-header">
        <Label.Root className="qb-label">Search</Label.Root>
      </div>
      <div className="qb-list">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="qb-input"
        />
      </div>
    </div>
  );
};

// QBFieldSelector Component for field selection
interface QBFieldSelectorProps {
  select: string[];
  metadata: QueryMetadata;
  onSelectChange: (fields: string[]) => void;
}

const QBFieldSelector: React.FC<QBFieldSelectorProps> = ({
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

  return (
    <div className="qb-field-selector qb-panel">
      <div className="qb-header">
        <Label.Root className="qb-label">Select Fields</Label.Root>
      </div>
      <div
        className="qb-list qb-field-cards"
        onDrop={handleDrop()}
        onDragOver={(e) => e.preventDefault()}
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
        {metadata.fields
          .filter((f) => !select.includes(f.name))
          .map((field) => {
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
                  <span className="qb-field-name">{field.label}</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

// QBSortEditor Component for sort configuration
interface QBSortEditorProps {
  sort: SortItem[];
  metadata: QueryMetadata;
  onSortChange: (sort: SortItem[]) => void;
}

const QBSortEditor: React.FC<QBSortEditorProps> = ({
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

  const sortFieldsTotal = availableFields.length;

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
          {(!sort || sort.length < sortFieldsTotal) && (
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
          const field = metadata.fields[sortItem.field] as QueryFieldMetadata;

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

// Helper functions for backward compatibility with QueryStatement format
const filterStateToQueryStatements = (
  filters: FilterState[]
): QueryStatement[] => {
  return filters.map((filter) => {
    if (filter.type === "composite") {
      return {
        [filter.operator!]: filter.children
          ? filterStateToQueryStatements(filter.children)
          : [],
      } as QueryStatement;
    } else {
      return { [filter.operator!]: filter.value } as QueryStatement;
    }
  });
};

const queryStatementsToFilterState = (
  statements: QueryStatement[],
  metadata: QueryMetadata
): FilterState[] => {
  return statements
    .map((statement, index) => {
      const entries = Object.entries(statement);
      if (entries.length === 0) return null;

      const [key, value] = entries[0];

      if (key.startsWith(".")) {
        // Composite operator
        return {
          id: `filter-${index}`,
          type: "composite" as const,
          operator: key,
          children: Array.isArray(value)
            ? queryStatementsToFilterState(value as QueryStatement[], metadata)
            : [],
        };
      } else {
        // Field filter
        let fieldKey: string;
        let operator: string;

        if (key.includes("!")) {
          // Negated operator: "field!op"
          const [field, op] = key.split("!");
          fieldKey = field;
          operator = key; // Keep the full negated operator
        } else if (key.includes(".")) {
          // Normal operator: "field.op"
          const [field, op] = key.split(".");
          fieldKey = field;
          operator = key;
        } else {
          // Field with default operator: "field"
          fieldKey = key;
          const fieldMeta = metadata.fields[fieldKey] as QueryFieldMetadata;
          operator = fieldMeta
            ? `${fieldKey}.${fieldMeta.noop}`
            : `${fieldKey}.eq`;
        }

        return {
          id: `filter-${index}`,
          type: "field" as const,
          field: fieldKey,
          operator,
          value: value as QueryValue,
        };
      }
    })
    .filter(Boolean) as FilterState[];
};

// Helper functions for sort conversion
const sortItemsToStrings = (items: SortItem[]): string[] => {
  return items.map((item) => `${item.field}.${item.direction}`);
};

const sortStringsToItems = (strings: string[]): SortItem[] => {
  return strings.map((str) => {
    const [field, direction] = str.split(".");
    return { field, direction: direction as "asc" | "desc" };
  });
};

// QBFilterEditor Component for filter management
interface QBFilterEditorProps {
  filters: FilterState[];
  metadata: QueryMetadata;
  onFiltersChange: (filters: FilterState[]) => void;
  customInput?: Record<string, FilterInputConfig>;
}

const QBFilterEditor: React.FC<QBFilterEditorProps> = ({
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

// Main QueryBuilder Component
export const QueryBuilder: React.FC<QueryBuilderProps> = ({
  metadata,
  queryState = {},
  onModalSubmit: onQueryStateChange,
  customInput = {},
  className,
  showDebug = false,
}) => {
  // Early return if metadata is not available or invalid
  if (
    !metadata ||
    !metadata.fields ||
    !metadata.filters ||
    !metadata.composites
  ) {
    return (
      <div className={cn("query-builder query-builder--loading", className)}>
        <div className="qb-loading">
          <span>Loading query builder...</span>
        </div>
      </div>
    );
  }

  const getDefaultFields = () => {
    return metadata.fields.filter((f) => !f.hidden).map((f) => f.name);
  };

  const handleSearchChange = (search: string) => {
    onQueryStateChange?.({ ...queryState, search });
  };

  const handleSelectChange = (select: string[]) => {
    onQueryStateChange?.({ ...queryState, select });
  };

  const handleSortChange = (sort: SortItem[]) => {
    onQueryStateChange?.({ ...queryState, sort });
  };

  const handleFiltersChange = (query: FilterState[]) => {
    onQueryStateChange?.({ ...queryState, query });
  };

  // Convert legacy formats if needed
  const currentQuery = queryState.query || [];
  const currentSort = queryState.sort;
  const currentSelect = queryState.select || getDefaultFields();
  const currentSearch = queryState.search || "";

  return (
    <div className={cn("query-builder", className)}>
      <QBTextInput value={currentSearch} onChange={handleSearchChange} />

      <QBFieldSelector
        select={currentSelect}
        metadata={metadata}
        onSelectChange={handleSelectChange}
      />

      <QBFilterEditor
        filters={currentQuery}
        metadata={metadata}
        onFiltersChange={handleFiltersChange}
        customInput={customInput}
      />

      <QBSortEditor
        sort={currentSort || []}
        metadata={metadata}
        onSortChange={handleSortChange}
      />

      {showDebug && (
        <div className="qb-debug">
          <Label.Root className="qb-label">Debug Output</Label.Root>
          <pre className="qb-debug-output">
            {JSON.stringify(
              {
                query: currentQuery,
                sort: currentSort,
                select: currentSelect,
                search: currentSearch,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};

QueryBuilder.displayName = "QueryBuilder";
