/**
 * QueryBuilder - Visual Query Building Interface
 * 
 * Features:
 * - Field selection (select specific fields)
 * - Sorting rules (multiple sort criteria)
 * - Filtering with composite operators (AND/OR groups, nested conditions)
 * - Real-time query generation and display
 * - Configurable section visibility
 * 
 * The component automatically detects capabilities (like composite operators)
 * and adapts the UI accordingly.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import FieldSelector from './FieldSelector';
import FilterBuilder from './FilterBuilder';
import SortBuilder from './SortBuilder';
import {
  QueryBuilderProps,
  QueryBuilderState,
} from './types';

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  metadata,
  initialQuery = {},
  onQueryChange,
  onExecute,
  title = "Query Builder",
  className,
  showFieldSelection = true,
  showSortRules = true,
  showFilterRules = true,
  showQueryDisplay = true,
}) => {
  // Query builder state
  const [state, setState] = useState<QueryBuilderState>(() => {
    // Initialize from initialQuery if provided, otherwise use defaults
    return {
      selectedFields: initialQuery.selectedFields || [],
      sortRules: initialQuery.sortRules || [],
      filterRules: initialQuery.filterRules || [],
    };
  });

  // Notify parent of state changes
  useEffect(() => {
    onQueryChange?.(state);
  }, [state, onQueryChange]);

  // Update handlers
  const handleSelectedFieldsChange = useCallback((selectedFields: string[]) => {
    setState(prev => ({ ...prev, selectedFields }));
  }, []);

  const handleSortRulesChange = useCallback((sortRules: typeof state.sortRules) => {
    setState(prev => ({ ...prev, sortRules }));
  }, []);

  const handleFilterRulesChange = useCallback((filterRules: typeof state.filterRules) => {
    setState(prev => ({ ...prev, filterRules }));
  }, []);

  const handleExecute = useCallback(() => {
    onExecute?.(state);
  }, [state, onExecute]);

  const handleClearAll = useCallback(() => {
    setState({
      selectedFields: [],
      sortRules: [],
      filterRules: [],
    });
  }, []);

  // No metadata available
  if (!metadata) {
    return (
      <div className={cn("p-3 border rounded-lg bg-white shadow-sm", className)}>
        <div className="text-center">
          <div className="text-gray-600 text-sm">No metadata available</div>
          <div className="text-xs text-gray-500 mt-1">
            Provide <code>metadata</code> prop
          </div>
        </div>
      </div>
    );
  }

  const hasFields = metadata.fields && Object.keys(metadata.fields).length > 0;
  const hasFilters = metadata.operators && Object.values(metadata.operators).some(param => param.field_name !== '');
  const hasSortables = metadata.sortables && metadata.sortables.length > 0;

  return (
    <div className={cn("border rounded-lg bg-white shadow-sm", className)}>
      {/* Header */}
      {title && (
        <div className="px-3 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center gap-2">
              {onExecute && (
                <button
                  onClick={handleExecute}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium"
                >
                  Execute Query
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="px-3 py-1 border text-sm rounded hover:bg-gray-50 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 space-y-3">

        {/* Filter Rules */}
        {showFilterRules && hasFilters && (
          <FilterBuilder
            metadata={metadata}
            filterRules={state.filterRules}
            onFilterRulesChange={handleFilterRulesChange}
          />
        )}
                
        {/* Field Selection */}
        {showFieldSelection && hasFields && (
          <FieldSelector
            metadata={metadata}
            selectedFields={state.selectedFields}
            onSelectedFieldsChange={handleSelectedFieldsChange}
          />
        )}

        {/* Sort Rules */}
        {showSortRules && hasSortables && (
          <SortBuilder
            metadata={metadata}
            sortRules={state.sortRules}
            onSortRulesChange={handleSortRulesChange}
          />
        )}


        {/* Query Display */}
        {showQueryDisplay && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Query Builder State</h4>
            <div className="bg-gray-50 border rounded p-3">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showFieldSelection && !showSortRules && !showFilterRules && !showQueryDisplay && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">All sections are hidden</div>
            <div className="text-xs mt-1">Enable sections via component props</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryBuilder; 