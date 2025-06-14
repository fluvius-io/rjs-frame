import type { Meta, StoryObj } from "@storybook/react";
import "../../lib/api"; // Import to ensure APIManager is initialized
import { Button } from "../common/Button";
import DataTable from "./DataTable";
import ResourceDataTable from "./ResourceDataTable";
import type { QueryMetadata } from "./types";

// Mock API metadata for the direct metadata example only
const mockApiMetadata: QueryMetadata = {
  fields: {
    _id: {
      label: "User ID",
      sortable: true,
      identifier: true,
      source: null,
      key: "_id",
      dtype: "string",
    },
    name__family: {
      label: "Family Name",
      sortable: true,
      identifier: false,
      source: null,
      key: "name__family",
      dtype: "string",
    },
    name__given: {
      label: "Given Name",
      sortable: true,
      identifier: false,
      source: null,
      key: "name__given",
      dtype: "string",
    },
    email: {
      label: "Email Address",
      sortable: true,
      identifier: false,
      source: null,
      key: "email",
      dtype: "string",
    },
    status: {
      label: "Status",
      sortable: true,
      identifier: false,
      source: null,
      key: "status",
      dtype: "string",
    },
  },
  operators: {
    ".and": {
      field_name: "",
      operator: "and",
      label: "AND",
      type: "string",
    },
    ".or": {
      field_name: "",
      operator: "or",
      label: "OR",
      type: "string",
    },
    "_id.in": {
      field_name: "_id",
      operator: "in",
      label: "In",
      type: "string",
    },
    "_id.eq": {
      field_name: "_id",
      operator: "eq",
      label: "Equals",
      type: "string",
    },
    "_id.is": {
      field_name: "_id",
      operator: "is",
      label: "Is",
      type: "string",
    },
    "name__family.eq": {
      field_name: "name__family",
      operator: "eq",
      label: "Equals",
      type: "string",
    },
    "name__family.ilike": {
      field_name: "name__family",
      operator: "ilike",
      label: "Contains",
      type: "string",
    },
    "name__family.is": {
      field_name: "name__family",
      operator: "is",
      label: "Is",
      type: "string",
    },
    "name__family.in": {
      field_name: "name__family",
      operator: "in",
      label: "In",
      type: "string",
    },
    "name__given.eq": {
      field_name: "name__given",
      operator: "eq",
      label: "Equals",
      type: "string",
    },
    "name__given.ilike": {
      field_name: "name__given",
      operator: "ilike",
      label: "Contains",
      type: "string",
    },
    "name__given.is": {
      field_name: "name__given",
      operator: "is",
      label: "Is",
      type: "string",
    },
    "name__given.in": {
      field_name: "name__given",
      operator: "in",
      label: "In",
      type: "string",
    },
    "email.eq": {
      field_name: "email",
      operator: "eq",
      label: "Equals",
      type: "string",
    },
    "email.ilike": {
      field_name: "email",
      operator: "ilike",
      label: "Contains",
      type: "string",
    },
    "email.is": {
      field_name: "email",
      operator: "is",
      label: "Is",
      type: "string",
    },
    "status.eq": {
      field_name: "status",
      operator: "eq",
      label: "Equals",
      type: "string",
    },
    "status.in": {
      field_name: "status",
      operator: "in",
      label: "In",
      type: "string",
    },
  },
  sortables: ["_id", "name__family", "name__given", "email", "status"],
  default_order: ["name__family.asc"],
};

const meta: Meta<typeof ResourceDataTable> = {
  title: "Components/ResourceDataTable",
  component: ResourceDataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A DataTable component that fetches metadata and data from real API endpoints via Vite proxy.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Complete API integration with both metadata and data from real server
export const WithApiMetadataAndData: Story = {
  render: () => {
    return (
      <div>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>🌐 Live API:</strong> This example fetches real data from your
          backend server via Vite proxy. Make sure your server is running on{" "}
          <code>http://localhost:8000</code> and check browser console for API
          calls.
        </div>
        <ResourceDataTable
          dataApi="idm:user"
          title="Users from Real API"
          subtitle="Both metadata and data fetched from live backend server"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">Add User</Button>
            </div>
          }
        />
      </div>
    );
  },
};

// Organizations API integration
export const OrganizationsFromApi: Story = {
  render: () => {
    return (
      <div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🏢 Organizations API:</strong> This example fetches
          organization data from your backend server. Make sure your server is
          running on <code>http://localhost:8000</code> and provides
          organization endpoints.
        </div>
        <ResourceDataTable
          dataApi="idm:organization"
          title="Organizations from Real API"
          subtitle="Organization metadata and data fetched from live backend server"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">Add Organization</Button>
            </div>
          }
        />
      </div>
    );
  },
};

// Metadata from real API, sample data fallback
export const WithApiMetadata: Story = {
  render: () => {
    return (
      <div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🔄 API Integration:</strong> Metadata and data from real API
          endpoint. Make sure your server is running on{" "}
          <code>http://localhost:8000</code>.
        </div>
        <ResourceDataTable
          dataApi="idm:user"
          title="Users from API"
          subtitle="Metadata and data from real API"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">Add User</Button>
            </div>
          }
        />
      </div>
    );
  },
};

// Example using DataTable directly with API metadata
export const DirectApiMetadata: Story = {
  render: () => {
    const sampleData = [
      {
        _id: "user_001",
        name__family: "Smith",
        name__given: "John",
        email: "john.smith@example.com",
        status: "Active",
      },
      {
        _id: "user_002",
        name__family: "Johnson",
        name__given: "Jane",
        email: "jane.johnson@example.com",
        status: "Inactive",
      },
      {
        _id: "user_003",
        name__family: "Williams",
        name__given: "Bob",
        email: "bob.williams@example.com",
        status: "Active",
      },
    ];

    return (
      <div>
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
          <strong>📋 Static Mode:</strong> Using hardcoded API metadata format
          with static sample data.
        </div>
        <DataTable
          metadata={mockApiMetadata}
          data={sampleData}
          title="Users"
          subtitle="Manage user accounts"
          showSearch={true}
          showFilters={true}
        />
      </div>
    );
  },
};

export const ServerNotRunning: Story = {
  render: () => {
    return (
      <div>
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm">
          <strong>⚠️ Server Error Demo:</strong> This will show error state if
          backend server is not running.
        </div>
        <ResourceDataTable
          dataApi="idm:nonexistent"
          title="Error State Demo"
          subtitle="This will show error if server is not running"
        />
      </div>
    );
  },
};
