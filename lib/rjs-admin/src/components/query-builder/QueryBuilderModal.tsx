import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useCallback, useEffect, useState } from "react";
import QueryBuilder from "./QueryBuilder";
import { QueryBuilderModalProps, QueryBuilderState } from "./types";

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
      document.body.style.overflow = "hidden";

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
      if (e.key === "Escape" && isOpen) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, handleCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="query-builder-modal">
      <div className="query-builder-modal__container">
        {/* Header */}
        <div className="query-builder-modal__header">
          <h3 className="query-builder-modal__title">Manage Filters</h3>
          <button
            onClick={handleCancel}
            className="query-builder-modal__close"
            title="Close"
          >
            <Cross2Icon className="query-builder-modal__close-icon" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <QueryBuilder
          key={`filter-modal-${isOpen ? "open" : "closed"}-${
            currentQuery.filterRules.length || "no-filters"
          }`}
          metadata={metadata}
          initialQuery={currentQuery}
          onQueryChange={handleModalStateChange}
          title=""
          className="query-builder-modal__query-builder"
          showFieldSelection={true}
          showSortRules={true}
          showFilterRules={true}
          showQueryDisplay={false}
        />

        {/* Footer */}
        <div className="query-builder-modal__footer">
          <button
            onClick={handleCancel}
            className="query-builder-modal__cancel"
          >
            Cancel
          </button>
          <button onClick={handleApply} className="query-builder-modal__apply">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilderModal;
