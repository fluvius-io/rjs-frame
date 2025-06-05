import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons';
import { memo, useCallback, useEffect, useRef } from 'react';
import { Button } from '../common/Button';
import CompositeFilterGroup from './CompositeFilterGroup';
import FieldFilter from './FieldFilter';
import { CompositeFilterRule, FieldFilterRule, FilterBuilderProps, FilterRule } from './types';
import { generateFilterId, getAvailableFields, getOperatorsForField } from './utils';

// Reusable Add Filter Dropdown Component using Radix UI
const AddFilterDropdown = memo<{
  metadata: any;
  onAddFilter: (fieldName: string) => void;
  onAddGroup?: (operator: ':and' | ':or') => void;
  disabled?: boolean;
  showGroupOptions?: boolean;
}>(({ metadata, onAddFilter, onAddGroup, disabled = false, showGroupOptions = false }) => {
  const availableFields = getAvailableFields(metadata);

  if (availableFields.length === 0) {
    return null;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          disabled={disabled}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm border rounded bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-3 h-3" />
          Add Condition
          <ChevronDownIcon className="w-3 h-3" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="min-w-48 bg-white rounded-md border shadow-lg p-1 z-50"
          sideOffset={4}
          align="start"
        >
          {/* Field options */}
          {availableFields.map((fieldName) => {
            const fieldMeta = metadata.fields[fieldName];
            return (
              <DropdownMenu.Item
                key={fieldName}
                className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                onSelect={() => onAddFilter(fieldName)}
              >
                {fieldMeta.label}
              </DropdownMenu.Item>
            );
          })}

          {/* Group options */}
          {showGroupOptions && (
            <>
              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
              <DropdownMenu.Item
                className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                onSelect={() => onAddGroup?.(':and')}
              >
                + Add AND Group
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                onSelect={() => onAddGroup?.(':or')}
              >
                + Add OR Group
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
});

AddFilterDropdown.displayName = 'AddFilterDropdown';

const FilterBuilder = memo<FilterBuilderProps>(({
  metadata,
  filterRules,
  onFilterRulesChange,
}) => {
  const availableFields = getAvailableFields(metadata);
  const hasCompositeOperators = metadata.operators && Object.values(metadata.operators).some((param: any) => param.field_name === "");

  // Use a ref to always get the latest filterRules
  const filterRulesRef = useRef(filterRules);
  useEffect(() => {
    filterRulesRef.current = filterRules;
  }, [filterRules]);

  const addFieldFilter = useCallback((fieldName: string) => {
    const availableOperators = getOperatorsForField(fieldName, metadata);
    const newRule: FieldFilterRule = {
      id: generateFilterId(),
      type: 'field',
      field: fieldName,
      operator: availableOperators[0] || '',
      value: '',
      negate: false,
    };
    onFilterRulesChange([...filterRulesRef.current, newRule]);
  }, [onFilterRulesChange, metadata]);

  const addCompositeGroup = useCallback((operator: ':and' | ':or') => {
    const newGroup: CompositeFilterRule = {
      id: generateFilterId(),
      type: 'composite',
      operator,
      children: [],
      negate: false,
    };
    onFilterRulesChange([...filterRulesRef.current, newGroup]);
  }, [onFilterRulesChange]);

  const updateFilter = useCallback((index: number, updatedFilter: FilterRule) => {
    const newRules = [...filterRulesRef.current];
    newRules[index] = updatedFilter;
    onFilterRulesChange(newRules);
  }, [onFilterRulesChange]);

  const removeFilter = useCallback((index: number) => {
    const newRules = filterRulesRef.current.filter((_, i) => i !== index);
    onFilterRulesChange(newRules);
  }, [onFilterRulesChange]);

  const clearAllFilters = useCallback(() => {
    onFilterRulesChange([]);
  }, [onFilterRulesChange]);

  // Simplified hasFilters check to avoid useMemo issues
  const hasFilters = filterRules.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filter Rules</h3>
        <div className="flex gap-2">
           <Button variant="outline" disabled={!hasFilters} size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          <AddFilterDropdown
            metadata={metadata}
            onAddFilter={addFieldFilter}
            onAddGroup={hasCompositeOperators ? addCompositeGroup : undefined}
            disabled={availableFields.length === 0}
            showGroupOptions={hasCompositeOperators}
          />
        </div>
      </div>
      <div className="border rounded-md p-3 space-y-4">

      {availableFields.length === 0 && (
        <div className="p-2 text-sm text-gray-500 italic">
          No filterable fields available in this dataset
        </div>
      )}

      {!hasFilters && availableFields.length > 0 && (
        <div className="p-2 text-sm text-gray-500 italic">
          No filters defined. All records will be returned (subject to other query parameters).
        </div>
      )}

      {/* Render filters as a simple list */}
        {filterRules.map((rule, index) => (
          <div key={rule.id}>
            {rule.type === 'composite' ? (
              <CompositeFilterGroup
                metadata={metadata}
                filter={rule}
                onFilterChange={(updatedFilter) => updateFilter(index, updatedFilter)}
                onRemove={() => removeFilter(index)}
                isRoot={false}
              />
            ) : (
              <FieldFilter
                metadata={metadata}
                filter={rule}
                onFilterChange={(updatedFilter) => updateFilter(index, updatedFilter)}
                onRemove={() => removeFilter(index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

FilterBuilder.displayName = 'FilterBuilder';

export { AddFilterDropdown };
export default FilterBuilder; 