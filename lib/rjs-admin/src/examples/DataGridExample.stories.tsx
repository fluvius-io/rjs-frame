import type { Meta, StoryObj } from "@storybook/react";
import { DataGridExample } from "./DataGridExample";

const meta: Meta<typeof DataGridExample> = {
  title: "Examples/DataGrid",
  component: DataGridExample,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "An example of using react-data-grid with our data API for data and metadata retrieval.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataGridExample>;

// Organizations API integration
export const OrganizationsFromApi: Story = {
  args: {
    dataApi: "idm:organization",
    title: "Organizations Grid",
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🏢 Organizations API:</strong> This example fetches
          organization data from your backend server. Make sure your server is
          running on <code>http://localhost:8000</code> and provides
          organization endpoints.
        </div>
        <DataGridExample {...args} />
      </div>
    );
  },
};

// Users API integration
export const UsersFromApi: Story = {
  args: {
    dataApi: "idm:user",
    title: "Users Grid",
  },
  render: (args) => {
    return (
      <div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>👥 Users API:</strong> This example fetches user data from
          your backend server. Make sure your server is running on{" "}
          <code>http://localhost:8000</code> and provides user endpoints.
        </div>
        <DataGridExample {...args} />
      </div>
    );
  },
};
