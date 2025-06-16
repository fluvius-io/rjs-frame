import * as Dialog from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "../../lib/utils";
import { QueryBuilderModalProps } from "../../types/querybuilder";
import { QueryBuilder } from "./QueryBuilder";

export const QueryBuilderModal: React.FC<QueryBuilderModalProps> = ({
  open,
  onOpenChange,
  title = "Query Builder",
  metadata,
  queryState,
  onQueryStateChange,
  customInput,
  className,
  showDebug,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="qb-modal-overlay" />
        <Dialog.Content className={cn("qb-modal-content", className)}>
          <div className="qb-modal-header">
            <Dialog.Title className="qb-modal-title">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="qb-button qb-button--ghost qb-button--sm"
                aria-label="Close"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          <div className="qb-modal-body">
            <QueryBuilder
              metadata={metadata}
              queryState={queryState}
              onQueryStateChange={onQueryStateChange}
              customInput={customInput}
              showDebug={showDebug}
            />
          </div>

          <div className="qb-modal-footer">
            <Dialog.Close asChild>
              <button className="qb-button qb-button--outline">Cancel</button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button className="qb-button qb-button--default">Apply</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

QueryBuilderModal.displayName = "QueryBuilderModal";
