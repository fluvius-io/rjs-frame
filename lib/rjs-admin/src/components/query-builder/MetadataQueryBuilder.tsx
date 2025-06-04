/**
 * MetadataQueryBuilder - Query Builder for Direct Metadata Use
 * 
 * This component is similar to QueryBuilder but accepts metadata directly
 * instead of fetching from an API. Perfect for use in modals or embedded contexts
 * where the metadata is already available.
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { QueryMetadata } from '../paginate/types';
import FieldSelector from './FieldSelector';
import FilterBuilder from './FilterBuilder';
import SortBuilder from './SortBuilder';
import { FrontendQuery, QueryBuilderState } from './types';
import { transformFromBackendQuery, transformToBackendQuery } from './utils';

export interface MetadataQueryBuilderProps {
  metadata: QueryMetadata;
  initialQuery?: Partial<FrontendQuery>;
  onQueryChange?: (query: FrontendQuery) => void;
  onExecute?: (query: FrontendQuery) => void;
  title?: string;
  className?: string;
  showPagination?: boolean;
  showFieldSelection?: boolean;
  showSortRules?: boolean;
  showFilterRules?: boolean;
  showQueryDisplay?: boolean;
}

const MetadataQueryBuilder: React.FC<MetadataQueryBuilderProps> = ({
  metadata,
  initialQuery = {},
  onQueryChange,
  onExecute,
  title = "Query Builder",
  className,
  showPagination = false,
  showFieldSelection = false,
  showSortRules = false,
  showFilterRules = true,
  showQueryDisplay = true,
}) => {
  const [state, setState] = useState<QueryBuilderState>({
    limit: initialQuery.limit || 10,
    page: initialQuery.page || 1,
    selectedFields: initialQuery.select || [],
    sortRules: [],
    filterRules: [],
  });

  const [currentQuery, setCurrentQuery] = useState<FrontendQuery>({
    limit: state.limit,
    page: state.page,
  });

  // Initialize state from initial query if metadata is available
  useEffect(() => {
    if (Object.keys(initialQuery).length > 0) {
      const initialState = transformFromBackendQuery(initialQuery, metadata);
      setState(initialState);
    }
  }, [initialQuery, metadata]);

  // Update query when state changes - remove onQueryChange from dependencies to prevent infinite loops
  useEffect(() => {
    const newQuery = transformToBackendQuery(state);
    setCurrentQuery(newQuery);
    onQueryChange?.(newQuery);
  }, [state]);

  const updateState = (updates: Partial<QueryBuilderState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetQuery = () => {
    setState({
      limit: 10,
      page: 1,
      selectedFields: [],
      sortRules: [],
      filterRules: [],
    });
  };

  const executeQuery = () => {
    onExecute?.(currentQuery);
  };

  return (
    <div className={cn("bg-background border rounded-lg shadow-sm", className)}>
      {/* Header */}
      {title && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">
                Build queries visually using field metadata
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                className="inline-flex items-center px-3 py-1 text-sm border rounded bg-white hover:bg-gray-50 font-medium"
                onClick={resetQuery}
              >
                Reset
              </button>
              {onExecute && (
                <button 
                  className="inline-flex items-center px-3 py-1 text-sm border rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
                  onClick={executeQuery}
                >
                  Execute Query
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Query Builder Sections */}
      <div className="p-4 space-y-6">
        {/* Pagination Settings */}
        {showPagination && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Pagination</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Page Size (limit)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={state.limit}
                  onChange={(e) => updateState({ limit: parseInt(e.target.value) || 10 })}
                  className="w-full px-2 py-1 text-sm border rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Page Number</label>
                <input
                  type="number"
                  min="1"
                  value={state.page}
                  onChange={(e) => updateState({ page: parseInt(e.target.value) || 1 })}
                  className="w-full px-2 py-1 text-sm border rounded bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Field Selection */}
        {showFieldSelection && (
          <FieldSelector
            metadata={metadata}
            selectedFields={state.selectedFields}
            onSelectedFieldsChange={(fields) => updateState({ selectedFields: fields })}
          />
        )}

        {/* Sort Rules */}
        {showSortRules && (
          <SortBuilder
            metadata={metadata}
            sortRules={state.sortRules}
            onSortRulesChange={(rules) => updateState({ sortRules: rules })}
          />
        )}

        {/* Filter Rules */}
        {showFilterRules && (
          <FilterBuilder
            metadata={metadata}
            filterRules={state.filterRules}
            onFilterRulesChange={(rules) => updateState({ filterRules: rules })}
          />
        )}


      </div>
    </div>
  );
};

export default MetadataQueryBuilder; 