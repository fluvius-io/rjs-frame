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

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { QueryFieldMetadata } from "../data-table/types";
import FieldSelector from "./FieldSelector";
import FilterBuilder from "./FilterBuilder";
import SortBuilder from "./SortBuilder";
import { QueryBuilderProps, QueryBuilderState } from "./types";

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
      visibleFields:
        initialQuery.visibleFields || Object.values(metadata.fields),
      sortRules: initialQuery.sortRules || [],
      filterRules: initialQuery.filterRules || [],
    };
  });

  // Notify parent of state changes
  useEffect(() => {
    onQueryChange?.(state);
  }, [state, onQueryChange]);

  // Update handlers
  const handleSelectedFieldsChange = useCallback(
    (selectedFields: QueryFieldMetadata[]) => {
      setState((prev) => ({
        ...prev,
        visibleFields: selectedFields,
      }));
    },
    []
  );

  const handleSortRulesChange = useCallback(
    (sortRules: typeof state.sortRules) => {
      setState((prev) => ({ ...prev, sortRules }));
    },
    []
  );

  const handleFilterRulesChange = useCallback(
    (filterRules: typeof state.filterRules) => {
      setState((prev) => ({ ...prev, filterRules }));
    },
    []
  );

  const handleExecute = useCallback(() => {
    onExecute?.(state);
  }, [state, onExecute]);

  const handleClearAll = useCallback(() => {
    setState({
      visibleFields: [],
      sortRules: [],
      filterRules: [],
    });
  }, []);

  // No metadata available
  if (!metadata) {
    return (
      <div className={cn("query-builder query-builder--empty", className)}>
        <div className="query-builder__empty-message">
          <div className="query-builder__empty-title">
            No metadata available
          </div>
          <div className="query-builder__empty-desc">
            Provide <code>metadata</code> prop
          </div>
        </div>
      </div>
    );
  }

  const hasFields = metadata.fields && Object.keys(metadata.fields).length > 0;
  const hasFilters =
    metadata.operators &&
    Object.values(metadata.operators).some((param) => param.field_name !== "");
  const hasSortables = metadata.sortables && metadata.sortables.length > 0;

  return (
    <div className={cn("query-builder", className)}>
      {/* Header */}
      {title && (
        <div className="query-builder__header">
          <div className="query-builder__header-row">
            <h3 className="query-builder__title">{title}</h3>
            <div className="query-builder__actions">
              {onExecute && (
                <button
                  onClick={handleExecute}
                  className="query-builder__execute-btn"
                >
                  Execute Query
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="query-builder__clear-btn"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="query-builder__sections">
        {/* Filter Rules */}
        {showFilterRules && hasFilters && (
          <div className="query-builder__section query-builder__section--filters">
            <FilterBuilder
              metadata={metadata}
              filterRules={state.filterRules}
              onFilterRulesChange={handleFilterRulesChange}
            />
          </div>
        )}

        {/* Field Selection */}
        {showFieldSelection && hasFields && (
          <div className="query-builder__section query-builder__section--fields">
            <FieldSelector
              metadata={metadata}
              selectedFields={state.visibleFields}
              onSelectedFieldsChange={handleSelectedFieldsChange}
            />
          </div>
        )}

        {/* Sort Rules */}
        {showSortRules && hasSortables && (
          <div className="query-builder__section query-builder__section--sort">
            <SortBuilder
              metadata={metadata}
              sortRules={state.sortRules}
              onSortRulesChange={handleSortRulesChange}
            />
          </div>
        )}

        {/* Query Display */}
        {showQueryDisplay && (
          <div className="query-builder__section query-builder__section--display">
            <h4 className="query-builder__display-title">
              Query Builder State
            </h4>
            <div className="query-builder__display-box">
              <pre className="query-builder__display-json">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showFieldSelection &&
          !showSortRules &&
          !showFilterRules &&
          !showQueryDisplay && (
            <div className="query-builder__empty-all">
              <div className="query-builder__empty-all-title">
                All sections are hidden
              </div>
              <div className="query-builder__empty-all-desc">
                Enable sections via component props
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default QueryBuilder;
