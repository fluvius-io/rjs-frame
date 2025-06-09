import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { X } from "lucide-react";
import React from "react";
import "../../styles/components/UserDialog.css";

export interface DialogTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tabs: DialogTab[];
  className?: string;
}

export function UserDialog({
  isOpen,
  onClose,
  title,
  tabs,
  className = "",
}: UserDialogProps) {
  if (!tabs.length) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="user-dialog__overlay" />
        <Dialog.Content className={`user-dialog__content ${className}`}>
          {/* Header */}
          <div className="user-dialog__header">
            <Dialog.Title className="user-dialog__title">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="user-dialog__close-button"
                aria-label="Close dialog"
              >
                <X className="user-dialog__close-icon" />
              </button>
            </Dialog.Close>
          </div>

          {/* Tabs */}
          <Tabs.Root defaultValue={tabs[0]?.id} className="user-dialog__tabs">
            {/* Tab Navigation */}
            {tabs.length > 1 && (
              <Tabs.List className="user-dialog__tab-list">
                {tabs.map((tab) => (
                  <Tabs.Trigger
                    key={tab.id}
                    value={tab.id}
                    className="user-dialog__tab-trigger"
                  >
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            )}

            {/* Tab Content */}
            <div className="user-dialog__tab-content-container">
              {tabs.map((tab) => (
                <Tabs.Content
                  key={tab.id}
                  value={tab.id}
                  className="user-dialog__tab-content"
                >
                  {tab.content}
                </Tabs.Content>
              ))}
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
