import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, Cross2Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import React, { useCallback } from 'react';
import { cn } from '../../lib/utils';
import { FieldValueInput } from './FieldValueInput';
import { FieldFilterProps } from './types';
import { getOperatorsForField } from './utils';

const FieldFilter: React.FC<FieldFilterProps> = ({
  metadata,
  filter,
  onFilterChange,
  onRemove,
}) => {
  const updateFilter = useCallback((updates: Partial<typeof filter>) => {
    onFilterChange({ ...filter, ...updates });
  }, [filter, onFilterChange]);

  const operatorKey = `${filter.field}:${filter.operator}`;
  const operatorLabel = metadata.fields[filter.field]?.label || filter.operator;
  const availableOperators = getOperatorsForField(filter.field, metadata);
  const currentWidget = metadata.operators[operatorKey]?.widget || null;

  return (
    <div
      className={cn(
        "p-2", filter.negate ? "bg-red-50" : ""
      )}
    >
      <div>
        <label className="block text-xs text-gray-600 mb-1">
          {operatorLabel} <span className="text-xs text-gray-500">({filter.field})</span>
        </label>
        <div className="flex items-center gap-2">
          {/* Operator selection dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="inline-flex items-center gap-1 px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50">
                {filter.operator}
                <ChevronDownIcon className="w-3 h-3" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="min-w-32 bg-white rounded-md border shadow-lg p-1 z-50"
                sideOffset={4}
                align="start"
              >
                {availableOperators.map(operator => (
                  <DropdownMenu.Item
                    key={operator}
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded outline-none"
                    onSelect={() => updateFilter({ operator, value: '' })}
                  >
                    {operator}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {/* Value input using widget information */}
          <FieldValueInput
            widget={currentWidget}
            value={filter.value}
            onChange={(value) => updateFilter({ value })}
            fieldName={operatorLabel}
          />

          {/* Negate button */}
          <button
            onClick={() => updateFilter({ negate: !filter.negate })}
            className={cn(
              "p-1 rounded border",
              filter.negate 
                ? "bg-orange-100 border-orange-300 text-orange-600" 
                : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200"
            )}
            title={filter.negate ? "Remove NOT condition" : "Add NOT condition"}
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
          </button>

          {/* Remove button */}
          <button
            onClick={onRemove}
            className="p-1 rounded border bg-gray-100 border-gray-300 text-gray-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600"
            title="Remove filter"
          >
            <Cross2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldFilter; 