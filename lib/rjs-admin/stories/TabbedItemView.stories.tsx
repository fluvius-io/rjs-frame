import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TabbedItemView } from "../src/components/itemview";
import "../src/lib/api";

const meta: Meta<typeof TabbedItemView> = {
  title: "Components/TabbedItemView",
  component: TabbedItemView,
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
    defaultTab: {
      control: "text",
      description: "Default active tab name",
    },
    itemJsonView: {
      control: "boolean",
      description: "Whether to show the JSON view tab",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    itemId: "93380e50-9ffe-4f10-8895-b6ea2b644713",
    resourceName: "idm:user",
    defaultTab: "details",
  },
  render: (args) => (
    <TabbedItemView {...args}>
      <TabbedItemView.TabItem name="details" label="Details">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <p>This tab shows detailed user information.</p>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">
              Custom content can be added here for the Details tab.
            </p>
          </div>
        </div>
      </TabbedItemView.TabItem>

      <TabbedItemView.TabItem name="settings" label="Settings">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Settings</h3>
          <p>This tab shows user settings and preferences.</p>
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-blue-600">
              Settings content can be customized here.
            </p>
          </div>
        </div>
      </TabbedItemView.TabItem>

      <TabbedItemView.TabItem name="activity" label="Activity">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Activity</h3>
          <p>This tab shows user activity and history.</p>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-sm text-green-600">
              Activity logs and history can be displayed here.
            </p>
          </div>
        </div>
      </TabbedItemView.TabItem>
    </TabbedItemView>
  ),
};

export const WithJSONView: Story = {
  args: {
    itemId: "93380e50-9ffe-4f10-8895-b6ea2b644713",
    resourceName: "idm:user",
    defaultTab: "details",
    itemJsonView: true,
  },
  render: (args) => (
    <TabbedItemView {...args}>
      <TabbedItemView.TabItem name="details" label="Details">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <p>This tab shows detailed user information.</p>
        </div>
      </TabbedItemView.TabItem>

      <TabbedItemView.TabItem name="settings" label="Settings">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Settings</h3>
          <p>This tab shows user settings and preferences.</p>
        </div>
      </TabbedItemView.TabItem>
    </TabbedItemView>
  ),
};

export const WithoutJSONView: Story = {
  args: {
    itemId: "93380e50-9ffe-4f10-8895-b6ea2b644713",
    resourceName: "idm:user",
    defaultTab: "details",
    itemJsonView: false,
  },
  render: (args) => (
    <TabbedItemView {...args}>
      <TabbedItemView.TabItem name="details" label="Details">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <p>This tab shows detailed user information.</p>
        </div>
      </TabbedItemView.TabItem>

      <TabbedItemView.TabItem name="settings" label="Settings">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Settings</h3>
          <p>This tab shows user settings and preferences.</p>
        </div>
      </TabbedItemView.TabItem>
    </TabbedItemView>
  ),
};

export const WithErrorHandling: Story = {
  args: {
    itemId: "invalid-user-id",
    resourceName: "idm:user",
    defaultTab: "details",
    onError: (error) => {
      console.error("TabbedItemView error:", error);
    },
    onLoad: (data) => {
      console.log("TabbedItemView loaded data:", data);
    },
  },
  render: (args) => (
    <TabbedItemView {...args}>
      <TabbedItemView.TabItem name="details" label="Details">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User Details</h3>
          <p>This tab shows detailed user information.</p>
        </div>
      </TabbedItemView.TabItem>
    </TabbedItemView>
  ),
};
