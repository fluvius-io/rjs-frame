import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../common/Button";
import { ItemView } from "./ItemView";
import { ModalViewProps } from "./types";

export function ModalView(props: ModalViewProps) {
  const {
    open,
    onOpenChange,
    title = "Item Details",
    showCloseButton = true,
    className: modalClassName,
    children,
  } = props;

  const descriptionId = "modal-description";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-4xl w-full max-h-[90vh] overflow-hidden ${
            modalClassName || ""
          }`}
          aria-describedby={descriptionId}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {title}
              </Dialog.Title>
              {showCloseButton && (
                <Dialog.Close asChild>
                  <Button variant="ghost" size="sm" aria-label="Close">
                    ✕
                  </Button>
                </Dialog.Close>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto">
              <div id={descriptionId}>{children}</div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
              <Dialog.Close asChild>
                <Button variant="outline">Close</Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Add static TabItem property to the functional component
ModalView.TabItem = ItemView.TabItem;

export default ModalView;
