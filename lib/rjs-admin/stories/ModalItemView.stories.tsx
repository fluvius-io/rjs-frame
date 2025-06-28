import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Button } from "../src/components/common/Button";
import { ModalView } from "../src/components/itemview";
import "../src/lib/api";

const meta: Meta<typeof ModalView> = {
  title: "Components/ModalView",
  component: ModalView,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    itemId: {
      control: "text",
      description: "The ID of the item to fetch and display",
    },
    resourceName: {
      control: "text",
      description: "API endpoint name for fetching the item",
    },
    title: {
      control: "text",
      description: "Modal title",
    },
    open: {
      control: "boolean",
      description: "Whether the modal is open",
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show the close button in header",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle modal state
const ModalWrapper: React.FC<{
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)} variant="default">
        Open Modal
      </Button>
      {React.cloneElement(children as React.ReactElement, {
        open: isOpen,
        onOpenChange: setIsOpen,
      })}
    </div>
  );
};

export const Default: Story = {
  args: {
    itemId: "93380e50-9ffe-4f10-8895-b6ea2b644713",
    resourceName: "idm:user",
    title: "User Details",
    defaultTab: "details",
  },
  render: (args) => (
    <ModalWrapper>
      <ModalView {...args}>
        <ModalView.TabItem name="details" label="Details">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <p>This tab shows detailed user information in a modal.</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                Modal content can be customized with tabs and custom content.
              </p>
            </div>
          </div>
        </ModalView.TabItem>

        <ModalView.TabItem name="settings" label="Settings">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Settings</h3>
            <p>This tab shows user settings and preferences.</p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">
                Settings content in modal view.
              </p>
            </div>
          </div>
        </ModalView.TabItem>

        <ModalView.TabItem name="activity" label="Activity">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Activity</h3>
            <p>This tab shows user activity and history.</p>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600">
                Activity logs displayed in modal format.
              </p>
            </div>
          </div>
        </ModalView.TabItem>
      </ModalView>
    </ModalWrapper>
  ),
};

export const WithoutCloseButton: Story = {
  args: {
    itemId: "93380e50-9ffe-4f10-8895-b6ea2b644713",
    resourceName: "idm:user",
    title: "User Details",
    showCloseButton: false,
    defaultTab: "details",
  },
  render: (args) => (
    <ModalWrapper>
      <ModalView {...args}>
        <ModalView.TabItem name="details" label="Details">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <p>This modal has no close button in the header.</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                Users can only close via the footer button or clicking outside.
              </p>
            </div>
          </div>
        </ModalView.TabItem>
      </ModalView>
    </ModalWrapper>
  ),
};

export const WithJSONView: Story = {
  args: {
    itemId: "93380e50-9ffe-4f10-8895-b6ea2b644713",
    resourceName: "idm:user",
    title: "User Details",
    defaultTab: "details",
    itemJsonView: true,
  },
  render: (args) => (
    <ModalWrapper>
      <ModalView {...args}>
        <ModalView.TabItem name="details" label="Details">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <p>This tab shows detailed user information.</p>
          </div>
        </ModalView.TabItem>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Settings</h3>
            <p>This tab shows user settings and preferences.</p>
          </div>
        </ModalView.TabItem>
      </ModalView>
    </ModalWrapper>
  ),
};

export const WithErrorHandling: Story = {
  args: {
    itemId: "invalid-user-id",
    resourceName: "idm:user",
    title: "User Details",
    defaultTab: "details",
    onError: (error) => {
      console.error("ModalItemView error:", error);
    },
    onLoad: (data) => {
      console.log("ModalItemView loaded data:", data);
    },
  },
  render: (args) => (
    <ModalWrapper>
      <ModalView {...args}>
        <ModalView.TabItem name="details" label="Details">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <p>This tab shows detailed user information.</p>
          </div>
        </ModalView.TabItem>
      </ModalView>
    </ModalWrapper>
  ),
};

export const CustomModalClass: Story = {
  args: {
    itemId: "93380e50-9ffe-4f10-8895-b6ea2b644713",
    resourceName: "idm:user",
    title: "User Details",
    modalClassName: "max-w-2xl",
    defaultTab: "details",
  },
  render: (args) => (
    <ModalWrapper>
      <ModalView {...args}>
        <ModalView.TabItem name="details" label="Details">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <p>This modal has a custom max-width class applied.</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                The modal is constrained to max-w-2xl width.
              </p>
            </div>
          </div>
        </ModalView.TabItem>
      </ModalView>
    </ModalWrapper>
  ),
};
