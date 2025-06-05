import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';
import { SortBuilderProps, SortRule } from './types';
import { getSortableFields } from './utils';

// Add Sort Dropdown Component
const AddSortDropdown: React.FC<{
  availableFields: string[];
  metadata: any;
  onAddSort: (fieldName: string) => void;
  disabled?: boolean;
}> = ({ availableFields, metadata, onAddSort, disabled = false }) => {
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
          Add Sort
          <ChevronDownIcon className="w-3 h-3" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          className="min-w-48 bg-white rounded-md border shadow-lg p-1 z-50"
          sideOffset={4}
          align="start"
        >
          {availableFields.map((fieldName) => {
            const fieldMeta = metadata.fields[fieldName];
            return (
              <DropdownMenu.Item
                key={fieldName}
                className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                onSelect={() => onAddSort(fieldName)}
              >
                {fieldMeta?.label || fieldName}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const SortBuilder: React.FC<SortBuilderProps> = ({
  metadata,
  sortRules,
  onSortRulesChange,
}) => {
  const sortableFields = getSortableFields(metadata);
  
  // Get fields that are not already in use
  const usedFields = sortRules.map(rule => rule.field);
  const availableFields = sortableFields.filter(field => !usedFields.includes(field));

  const addSortRule = (fieldName: string) => {
    const newRule: SortRule = {
      field: fieldName,
      direction: 'asc',
    };
    
    onSortRulesChange([...sortRules, newRule]);
  };

  const updateSortDirection = (index: number, direction: 'asc' | 'desc') => {
    const newRules = [...sortRules];
    newRules[index] = { ...newRules[index], direction };
    onSortRulesChange(newRules);
  };

  const removeSortRule = (index: number) => {
    const newRules = sortRules.filter((_, i) => i !== index);
    onSortRulesChange(newRules);
  };

  const moveSortRule = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sortRules.length) return;
    
    const newRules = [...sortRules];
    const [movedRule] = newRules.splice(fromIndex, 1);
    newRules.splice(toIndex, 0, movedRule);
    onSortRulesChange(newRules);
  };

  const clearAllSorts = () => {
    onSortRulesChange([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Sort Rules</h3>
        <div className="flex gap-2">
          {sortRules.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllSorts}>
              Clear All
            </Button>
          )}
          <AddSortDropdown
            availableFields={availableFields}
            metadata={metadata}
            onAddSort={addSortRule}
            disabled={availableFields.length === 0}
          />
        </div>
      </div>

      {sortableFields.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          No sortable fields available in this dataset
        </div>
      )}

      {sortRules.length === 0 && sortableFields.length > 0 && (
        <div className="p-2 border rounded-md text-sm text-gray-500 italic">
          No sort rules defined. Data will be returned in default order.
        </div>
      )}

      {sortRules.length > 0 && (
        <div className="border rounded-md">
          {sortRules.map((rule, index) => {
            const fieldMeta = metadata.fields[rule.field];
            
            return (
              <div
                key={index}
                className="flex items-center p-2 gap-3"
              >
                {/* Order indicator */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500"></span>
                  <div className="flex flex-col gap-1">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSortRule(index, index - 1)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveSortRule(index, index + 1)}
                      disabled={index === sortRules.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
 
                  </div>
                </div>

                {/* Field display (readonly) */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Field #{index + 1}: {rule.field} </label>
                  <div className="px-2 py-1 text-sm border rounded bg-gray-100 text-gray-700 font-medium">
                  {fieldMeta?.label || rule.field}
                  </div>
                </div>

                {/* Direction toggle buttons */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Direction</label>
                  <div className="flex rounded border bg-white overflow-hidden">
                    <button
                      onClick={() => updateSortDirection(index, 'asc')}
                      className={cn(
                        "flex-1 px-3 py-1 text-sm font-medium transition-colors flex items-center justify-center gap-1",
                        rule.direction === 'asc'
                          ? "bg-blue-100 text-blue-700 border-r border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 border-r border-gray-200"
                      )}
                    >
                      <ArrowUpIcon className="w-3 h-3" />
                      Asc
                    </button>
                    <button
                      onClick={() => updateSortDirection(index, 'desc')}
                      className={cn(
                        "flex-1 px-3 py-1 text-sm font-medium transition-colors flex items-center justify-center gap-1",
                        rule.direction === 'desc'
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <ArrowDownIcon className="w-3 h-3" />
                      Desc
                    </button>
                    
                  </div>
                </div>

                {/* Remove button */}
                <div className="flex-col">
                  <label className="block text-xs text-gray-600 mb-1">Remove</label>
                  <button
                    onClick={() => removeSortRule(index)}
                    className="p-1 rounded border bg-gray-100 border-gray-300 text-gray-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600"
                    title="Remove sort rule"
                  >
                    <Cross2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortBuilder; 