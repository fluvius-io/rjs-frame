import React from 'react';
import { FilterBuilderProps, FilterRule } from './types';
import { getAvailableFields, getOperatorsForField, generateFilterId } from './utils';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

const FilterBuilder: React.FC<FilterBuilderProps> = ({
  metadata,
  filterRules,
  onFilterRulesChange,
}) => {
  const availableFields = getAvailableFields(metadata);

  const addFilterRule = () => {
    if (availableFields.length === 0) return;
    
    const firstField = availableFields[0];
    const availableOperators = getOperatorsForField(firstField, metadata);
    
    const newRule: FilterRule = {
      id: generateFilterId(),
      field: firstField,
      operator: availableOperators[0] || '',
      value: '',
      negate: false,
    };
    
    onFilterRulesChange([...filterRules, newRule]);
  };

  const updateFilterRule = (id: string, updates: Partial<FilterRule>) => {
    const newRules = filterRules.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    );
    
    // If field changed, reset operator to first available for new field
    if (updates.field) {
      const rule = newRules.find(r => r.id === id);
      if (rule) {
        const availableOperators = getOperatorsForField(updates.field, metadata);
        rule.operator = availableOperators[0] || '';
        rule.value = ''; // Reset value when operator changes
      }
    }
    
    onFilterRulesChange(newRules);
  };

  const removeFilterRule = (id: string) => {
    const newRules = filterRules.filter(rule => rule.id !== id);
    onFilterRulesChange(newRules);
  };

  const clearAllFilters = () => {
    onFilterRulesChange([]);
  };

  const renderFilterInput = (rule: FilterRule) => {
    const operator = metadata.operators?.[rule.operator];
    
    switch (operator?.type) {
      case 'select':
        return (
          <select
            value={rule.value}
            onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
            className="px-2 py-1 text-sm border rounded bg-white"
          >
            <option value="">Select...</option>
            {operator.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <select
            value={rule.value}
            onChange={(e) => updateFilterRule(rule.id, { value: e.target.value === 'true' })}
            className="px-2 py-1 text-sm border rounded bg-white"
          >
            <option value="">Select...</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      default:
        return (
          <input
            type={operator?.type === 'number' ? 'number' : operator?.type === 'date' ? 'date' : 'text'}
            value={rule.value}
            onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
            placeholder={operator?.placeholder || 'Enter value...'}
            className="px-2 py-1 text-sm border rounded bg-white"
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter Rules</h3>
        <div className="flex gap-2">
          {filterRules.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addFilterRule}
            disabled={availableFields.length === 0}
          >
            + Add Filter
          </Button>
        </div>
      </div>

      {availableFields.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          No filterable fields available in this dataset
        </div>
      )}

      {filterRules.length === 0 && availableFields.length > 0 && (
        <div className="text-sm text-gray-500 italic">
          No filters defined. All records will be returned (subject to other query parameters).
        </div>
      )}

      {filterRules.length > 0 && (
        <div className="space-y-3">
          {filterRules.map((rule, index) => {
            const fieldMeta = metadata.fields[rule.field];
            const availableOperators = getOperatorsForField(rule.field, metadata);
            const currentOperator = metadata.operators?.[rule.operator];
            
            return (
              <div
                key={rule.id}
                className={cn(
                  "flex items-center gap-3 p-3 border rounded-md",
                  rule.negate ? "bg-red-50 border-red-200" : "bg-gray-50"
                )}
              >
                {/* Connector */}
                {index > 0 && (
                  <div className="text-xs font-medium text-gray-600 self-start pt-1">
                    AND
                  </div>
                )}

                {/* Negation toggle */}
                <div className="flex flex-col items-center gap-1">
                  <label className="text-xs text-gray-600">NOT</label>
                  <input
                    type="checkbox"
                    checked={rule.negate}
                    onChange={(e) => updateFilterRule(rule.id, { negate: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                </div>

                {/* Field selection */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs text-gray-600 mb-1">Field</label>
                  <select
                    value={rule.field}
                    onChange={(e) => updateFilterRule(rule.id, { field: e.target.value })}
                    className="w-full px-2 py-1 text-sm border rounded bg-white"
                  >
                    {availableFields.map(fieldName => (
                      <option key={fieldName} value={fieldName}>
                        {fieldName}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    {fieldMeta?.label}
                  </div>
                </div>

                {/* Operator selection */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs text-gray-600 mb-1">Operator</label>
                  <select
                    value={rule.operator}
                    onChange={(e) => updateFilterRule(rule.id, { operator: e.target.value, value: '' })}
                    className="w-full px-2 py-1 text-sm border rounded bg-white"
                  >
                    {availableOperators.map(opKey => {
                      const opMeta = metadata.operators?.[opKey];
                      const opName = opKey.split(':')[1] || opKey;
                      return (
                        <option key={opKey} value={opKey}>
                          {opName}
                        </option>
                      );
                    })}
                  </select>
                  {currentOperator && (
                    <div className="text-xs text-gray-500 mt-1">
                      {currentOperator.label || rule.operator}
                    </div>
                  )}
                </div>

                {/* Value input */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs text-gray-600 mb-1">Value</label>
                  {renderFilterInput(rule)}
                </div>

                {/* Remove button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFilterRule(rule.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start mt-6"
                >
                  ✕
                </Button>
              </div>
            );
          })}

          {/* Filter summary */}
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Filter Summary</h4>
            <div className="text-xs font-mono bg-gray-100 p-2 rounded space-y-1">
              {filterRules.map((rule, index) => (
                <div key={rule.id}>
                  {index > 0 && <span className="text-gray-500">AND </span>}
                  {rule.negate && <span className="text-red-600">NOT </span>}
                  <span className="text-blue-600">{rule.field}</span>
                  <span className="text-gray-600"> </span>
                  <span className="text-purple-600">{rule.operator.split(':')[1] || rule.operator}</span>
                  <span className="text-gray-600"> </span>
                  <span className="text-green-600">"{rule.value}"</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              All filter conditions are combined with AND logic
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBuilder; 