import * as Dialog from "@radix-ui/react-dialog";
import React, { Component } from "react";
import { Button } from "../common/Button";
import { ItemView, ItemViewProps } from "./ItemView";

export interface ModalItemViewProps extends ItemViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  showCloseButton?: boolean;
  modalClassName?: string;
}

export class ModalItemView extends Component<ModalItemViewProps> {
  static TabItem = ItemView.TabItem;

  renderModalContent = (): React.ReactNode => {
    // Create a new props object without modal-specific props
    const {
      open,
      onOpenChange,
      title,
      showCloseButton = true,
      modalClassName,
      ...itemViewProps
    } = this.props;

    return <ItemView {...itemViewProps}>{this.props.children}</ItemView>;
  };

  renderModal(): React.ReactNode {
    const {
      open,
      onOpenChange,
      title = "Item Details",
      showCloseButton = true,
      modalClassName,
    } = this.props;

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-4xl w-full max-h-[90vh] overflow-hidden ${
              modalClassName || ""
            }`}
          >
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col h-full">
              {/* Body */}
              <div className="flex-1">{this.renderModalContent()}</div>

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

  render(): React.ReactNode {
    return this.renderModal();
  }
}

export default ModalItemView;
