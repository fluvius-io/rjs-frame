import { Cross2Icon } from '@radix-ui/react-icons';
import React, { useCallback, useEffect, useState } from 'react';
import QueryBuilder from './QueryBuilder';
import { QueryBuilderModalProps, QueryBuilderState } from './types';

const QueryBuilderModal: React.FC<QueryBuilderModalProps> = ({
  isOpen,
  metadata,
  currentQuery,
  onClose,
  onApply,
}) => {
  // Local state for the query builder state being built in the modal
  const [modalState, setModalState] = useState<QueryBuilderState>({
    selectedFields: [],
    sortRules: [],
    filterRules: [],
  });

  // Update modal state when currentQuery changes (e.g., when modal opens)
  useEffect(() => {
    if (isOpen) {
      setModalState(currentQuery);
    }
  }, [isOpen, currentQuery]);

  // Handle body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore original overflow when modal closes
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle state changes while building filters
  const handleModalStateChange = useCallback((state: QueryBuilderState) => {
    setModalState(state);
  }, []);

  // Apply filters and close modal
  const handleApply = useCallback(() => {
    onApply(modalState);
    onClose();
  }, [modalState, onApply, onClose]);

  // Cancel changes and close modal
  const handleCancel = useCallback(() => {
    // Reset to current applied query
    setModalState(currentQuery);
    onClose();
  }, [currentQuery, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <h3 className="text-lg font-semibold">Manage Filters</h3>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Close"
          >
            <Cross2Icon className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <QueryBuilder
          key={`filter-modal-${isOpen ? 'open' : 'closed'}-${currentQuery.filterRules.length || 'no-filters'}`}
          metadata={metadata}
          initialQuery={currentQuery}
          onQueryChange={handleModalStateChange}
          title=""
          className="border-0 shadow-none"
          showFieldSelection={true}
          showSortRules={true}
          showFilterRules={true}
          showQueryDisplay={false}
        />

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-3 py-1 text-sm border rounded bg-white hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="inline-flex items-center px-3 py-1 text-sm border rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilderModal; 