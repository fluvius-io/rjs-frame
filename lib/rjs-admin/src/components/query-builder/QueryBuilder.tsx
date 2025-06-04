/**
 * QueryBuilder - Complete Visual Query Building Interface
 * 
 * This is the main component for building complex database queries visually.
 * It includes:
 * - Field selection (select specific fields)
 * - Sorting rules (multiple sort criteria)
 * - Filtering with composite operators (AND/OR groups, nested conditions)
 * - Pagination controls
 * - Real-time query generation and display
 * 
 * The component automatically detects API capabilities (like composite operators)
 * and adapts the UI accordingly. It fetches metadata from the provided API
 * endpoint to understand available fields and operators.
 */

import React, { useEffect, useState } from 'react';
import { APIManager } from 'rjs-frame';
import { cn } from '../../lib/utils';
import { QueryMetadata } from '../paginate/types';
import FieldSelector from './FieldSelector';
import FilterBuilder from './FilterBuilder';
import SortBuilder from './SortBuilder';
import { FrontendQuery, QueryBuilderProps, QueryBuilderState } from './types';
import { transformFromBackendQuery, transformToBackendQuery } from './utils';

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  metadataApi,
  initialQuery = {},
  onQueryChange,
  onExecute,
  title = "Query Builder",
  className,
}) => {
  const [metadata, setMetadata] = useState<QueryMetadata | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  
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

  // Load metadata on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setMetadataLoading(true);
        setMetadataError(null);
        
        console.log('🔄 QueryBuilder: Fetching metadata from:', metadataApi);
        const response = await APIManager.queryMeta(metadataApi);
        const metadata = response.data;
        console.log('📊 QueryBuilder: Received metadata:', metadata);
        
        // Use metadata directly without transformation
        setMetadata(metadata);
        
        // Initialize state from initial query if metadata is available
        if (Object.keys(initialQuery).length > 0) {
          const initialState = transformFromBackendQuery(initialQuery, metadata);
          setState(initialState);
        }
      } catch (error) {
        console.error('❌ QueryBuilder: Failed to fetch metadata:', error);
        setMetadataError(error instanceof Error ? error.message : 'Failed to load metadata');
      } finally {
        setMetadataLoading(false);
      }
    };

    loadMetadata();
  }, [metadataApi]);

  // Update query when state changes
  useEffect(() => {
    const newQuery = transformToBackendQuery(state);
    setCurrentQuery(newQuery);
    onQueryChange?.(newQuery);
  }, [state, onQueryChange]);

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

  // Show loading state
  if (metadataLoading) {
    return (
      <div className={cn("bg-background border rounded-lg shadow-sm p-8", className)}>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Loading metadata...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (metadataError || !metadata) {
    return (
      <div className={cn("bg-background border rounded-lg shadow-sm p-8", className)}>
        <div className="text-center">
          <div className="text-sm text-destructive mb-2">
            Failed to load metadata: {metadataError || 'No metadata available'}
          </div>
          <button 
            className="inline-flex items-center px-3 py-1 text-sm border rounded bg-white hover:bg-gray-50 font-medium"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-background border rounded-lg shadow-sm", className)}>
      {/* Header */}
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

      {/* Query Builder Sections */}
      <div className="p-4 space-y-6">
        {/* Pagination Settings */}
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

        {/* Field Selection */}
        <FieldSelector
          metadata={metadata}
          selectedFields={state.selectedFields}
          onSelectedFieldsChange={(fields) => updateState({ selectedFields: fields })}
        />

        {/* Sort Rules */}
        <SortBuilder
          metadata={metadata}
          sortRules={state.sortRules}
          onSortRulesChange={(rules) => updateState({ sortRules: rules })}
        />

        {/* Filter Rules */}
        <FilterBuilder
          metadata={metadata}
          filterRules={state.filterRules}
          onFilterRulesChange={(rules) => updateState({ filterRules: rules })}
        />
      </div>
    </div>
  );
};

export default QueryBuilder; 