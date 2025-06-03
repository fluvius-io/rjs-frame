import React from 'react';
import { SortBuilderProps, SortRule } from './types';
import { getSortableFields, generateFilterId } from './utils';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

const SortBuilder: React.FC<SortBuilderProps> = ({
  metadata,
  sortRules,
  onSortRulesChange,
}) => {
  const sortableFields = getSortableFields(metadata);

  const addSortRule = () => {
    if (sortableFields.length === 0) return;
    
    const newRule: SortRule = {
      field: sortableFields[0],
      direction: 'asc',
    };
    
    onSortRulesChange([...sortRules, newRule]);
  };

  const updateSortRule = (index: number, field: string, direction: 'asc' | 'desc') => {
    const newRules = [...sortRules];
    newRules[index] = { field, direction };
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Sort Rules</h3>
        <div className="flex gap-2">
          {sortRules.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAllSorts}>
              Clear All
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addSortRule}
            disabled={sortableFields.length === 0}
          >
            + Add Sort
          </Button>
        </div>
      </div>

      {sortableFields.length === 0 && (
        <div className="text-sm text-gray-500 italic">
          No sortable fields available in this dataset
        </div>
      )}

      {sortRules.length === 0 && sortableFields.length > 0 && (
        <div className="text-sm text-gray-500 italic">
          No sort rules defined. Data will be returned in default order.
        </div>
      )}

      {sortRules.length > 0 && (
        <div className="space-y-2">
          {sortRules.map((rule, index) => {
            const fieldMeta = metadata.fields[rule.field];
            
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-md bg-gray-50"
              >
                {/* Order indicator */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500">#{index + 1}</span>
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

                {/* Field selection */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Field</label>
                  <select
                    value={rule.field}
                    onChange={(e) => updateSortRule(index, e.target.value, rule.direction)}
                    className="w-full px-2 py-1 text-sm border rounded bg-white"
                  >
                    {sortableFields.map(fieldName => (
                      <option key={fieldName} value={fieldName}>
                        {fieldName} ({metadata.fields[fieldName].label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Direction selection */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Direction</label>
                  <select
                    value={rule.direction}
                    onChange={(e) => updateSortRule(index, rule.field, e.target.value as 'asc' | 'desc')}
                    className="w-full px-2 py-1 text-sm border rounded bg-white"
                  >
                    <option value="asc">Ascending (A→Z, 1→9)</option>
                    <option value="desc">Descending (Z→A, 9→1)</option>
                  </select>
                </div>

                {/* Remove button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSortRule(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  ✕
                </Button>
              </div>
            );
          })}

          {/* Sort summary */}
          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Sort Summary</h4>
            <div className="text-xs font-mono bg-gray-100 p-2 rounded">
              {sortRules.map((rule, index) => (
                <span key={index}>
                  {index > 0 && ' → '}
                  <span className="text-blue-600">{rule.field}</span>
                  <span className="text-gray-600">:</span>
                  <span className={rule.direction === 'asc' ? 'text-green-600' : 'text-orange-600'}>
                    {rule.direction}
                  </span>
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Sort priority: {sortRules.length > 1 ? 'left to right' : 'single field'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortBuilder; 