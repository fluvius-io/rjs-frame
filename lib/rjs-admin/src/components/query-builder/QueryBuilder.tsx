import React, { useState, useEffect } from 'react';
import { QueryBuilderProps, QueryBuilderState, FrontendQuery } from './types';
import { transformToBackendQuery, transformFromBackendQuery } from './utils';
import { transformApiMetadata, isApiMetadata, fetchMetadata } from '../paginate/utils';
import { PaginatedListMetadata } from '../paginate/types';
import FieldSelector from './FieldSelector';
import SortBuilder from './SortBuilder';
import FilterBuilder from './FilterBuilder';
import QueryDisplay from './QueryDisplay';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  metadataUrl,
  initialQuery = {},
  onQueryChange,
  onExecute,
  title = "Query Builder",
  className,
}) => {
  const [metadata, setMetadata] = useState<PaginatedListMetadata | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  
  const [state, setState] = useState<QueryBuilderState>({
    limit: initialQuery.limit || 10,
    page: initialQuery.page || 1,
    selectedFields: initialQuery.select || [],
    deselectedFields: initialQuery.deselect || [],
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
        
        console.log('🔄 QueryBuilder: Fetching metadata from:', metadataUrl);
        const apiMetadata = await fetchMetadata(metadataUrl);
        console.log('📊 QueryBuilder: Received metadata:', apiMetadata);
        
        const processedMetadata = transformApiMetadata(apiMetadata);
        setMetadata(processedMetadata);
        
        // Initialize state from initial query if metadata is available
        if (Object.keys(initialQuery).length > 0) {
          const initialState = transformFromBackendQuery(initialQuery, processedMetadata);
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
  }, [metadataUrl]);

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
      deselectedFields: [],
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
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
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
            <Button variant="outline" size="sm" onClick={resetQuery}>
              Reset
            </Button>
            {onExecute && (
              <Button size="sm" onClick={executeQuery}>
                Execute Query
              </Button>
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
          deselectedFields={state.deselectedFields}
          onSelectedFieldsChange={(fields) => updateState({ selectedFields: fields })}
          onDeselectedFieldsChange={(fields) => updateState({ deselectedFields: fields })}
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

        {/* Generated Query Display */}
        <QueryDisplay
          query={currentQuery}
          onQueryChange={(query) => {
            if (metadata) {
              const newState = transformFromBackendQuery(query, metadata);
              setState(newState);
            }
          }}
        />
      </div>
    </div>
  );
};

export default QueryBuilder; 