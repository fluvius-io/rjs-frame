import * as Dialog from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "../../lib/utils";
import { QueryBuilderModalProps } from "../../types/querybuilder";
import { Button } from "../common/Button";
import { QueryBuilder } from "./QueryBuilder";

export const QueryBuilderModal: React.FC<QueryBuilderModalProps> = ({
  open,
  onOpenChange,
  title = "Query Builder",
  metadata,
  queryState,
  onModalSubmit,
  customInput,
  className,
  showDebug,
}) => {
  const [internalQueryState, setInternalQueryState] =
    React.useState(queryState);

  const handleApply = () => {
    onModalSubmit?.({ ...internalQueryState });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="qb-modal-overlay" />
        <Dialog.Content className={cn("qb-modal-content", className)}>
          <div className="qb-modal-header">
            <Dialog.Title className="qb-modal-title">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Close">
                ✕
              </Button>
            </Dialog.Close>
          </div>

          <div className="qb-modal-body">
            <QueryBuilder
              metadata={metadata}
              queryState={internalQueryState}
              onQueryStateChange={setInternalQueryState}
              customInput={customInput}
              showDebug={showDebug}
            />
          </div>

          <div className="qb-modal-footer">
            <Dialog.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button onClick={handleApply} variant="default">
                Apply
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

QueryBuilderModal.displayName = "QueryBuilderModal";
