import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import "../src/lib/api";

import { DataTable } from "../src/components/datatable/DataTable";

import {
  DataRow,
  DataTableProps,
  PaginationState,
} from "../src/types/datatable";
import { QueryMetadata, QueryState } from "../src/types/querybuilder";

// Sample data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "inactive",
    createdAt: "2024-01-17",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "User",
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Admin",
    status: "active",
    createdAt: "2024-01-19",
  },
];

const sampleMetadata: QueryMetadata = {
  name: "user",
  title: "User Query",
  desc: "List all user accounts",
  fields: [
    {
      label: "Name",
      name: "name",
      desc: "User full name",
      noop: "ilike",
      hidden: false,
      sortable: true,
    },
    {
      label: "Email",
      name: "email",
      desc: "User email address",
      noop: "ilike",
      hidden: false,
      sortable: true,
    },
    {
      label: "Role",
      name: "role",
      desc: "User role",
      noop: "eq",
      hidden: false,
      sortable: true,
    },
    {
      label: "Status",
      name: "status",
      desc: "User status",
      noop: "eq",
      hidden: false,
      sortable: true,
    },
  ],
  filters: {
    "name.ilike": {
      field: "name",
      label: "Contains",
      dtype: "string",
      input: { type: "text", placeholder: "Enter name..." },
    },
    "email.ilike": {
      field: "email",
      label: "Contains",
      dtype: "string",
      input: { type: "text", placeholder: "Enter email..." },
    },
    "role.eq": {
      field: "role",
      label: "Equals",
      dtype: "string",
      input: { type: "text", placeholder: "Enter role..." },
    },
    "status.eq": {
      field: "status",
      label: "Equals",
      dtype: "string",
      input: { type: "text", placeholder: "Enter status..." },
    },
  },
  composites: {
    ".and": { label: "And" },
    ".or": { label: "Or" },
  },
  default_order: ["name.asc"],
};

// Example metadata matching the specification
const EXAMPLE_METADATA: QueryMetadata = {
  name: "user",
  title: "User Management",
  desc: "List all user accounts with advanced filtering and sorting",
  fields: [
    {
      label: "User ID",
      name: "id",
      desc: null,
      noop: "eq",
      hidden: true,
      sortable: true,
    },
    {
      label: "Given Name",
      name: "name__given",
      desc: null,
      noop: "eq",
      hidden: false,
      sortable: true,
    },
    {
      label: "Family Name",
      name: "name__family",
      desc: null,
      noop: "eq",
      hidden: false,
      sortable: true,
    },
    {
      label: "Email Address",
      name: "email",
      desc: null,
      noop: "ilike",
      hidden: false,
      sortable: true,
    },
    {
      label: "Status",
      name: "status",
      desc: null,
      noop: "eq",
      hidden: false,
      sortable: true,
    },
    {
      label: "Created At",
      name: "created_at",
      desc: null,
      noop: "gte",
      hidden: false,
      sortable: true,
    },
  ],
  filters: {
    "id.eq": {
      field: "id",
      label: "Equals",
      dtype: "uuid",
      input: {
        type: "text",
        placeholder: "Enter user ID...",
      },
    },
    "id.in": {
      field: "id",
      label: "In List",
      dtype: "uuid",
      input: {
        type: "text",
        placeholder: "Enter comma-separated IDs...",
      },
    },
    "name__given.eq": {
      field: "name__given",
      label: "Equals",
      dtype: "string",
      input: {
        type: "text",
        placeholder: "Enter exact name...",
      },
    },
    "name__given.ilike": {
      field: "name__given",
      label: "Contains",
      dtype: "string",
      input: {
        type: "text",
        placeholder: "Enter partial name...",
      },
    },
    "name__given.ne": {
      field: "name__given",
      label: "Not Equals",
      dtype: "string",
      input: {
        type: "text",
      },
    },
    "name__family.eq": {
      field: "name__family",
      label: "Equals",
      dtype: "string",
      input: {
        type: "text",
      },
    },
    "name__family.ilike": {
      field: "name__family",
      label: "Contains",
      dtype: "string",
      input: {
        type: "text",
      },
    },
    "name__family.ne": {
      field: "name__family",
      label: "Not Equals",
      dtype: "string",
      input: {
        type: "text",
      },
    },
    "email.eq": {
      field: "email",
      label: "Equals",
      dtype: "string",
      input: {
        type: "text",
        placeholder: "Enter email address...",
      },
    },
    "email.ilike": {
      field: "email",
      label: "Contains",
      dtype: "string",
      input: {
        type: "text",
        placeholder: "Enter partial email...",
      },
    },
    "status.eq": {
      field: "status",
      label: "Equals",
      dtype: "string",
      input: {
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "pending", label: "Pending" },
          { value: "suspended", label: "Suspended" },
        ],
      },
    },
    "created_at.gte": {
      field: "created_at",
      label: "After Date",
      dtype: "date",
      input: {
        type: "date",
      },
    },
    "created_at.lte": {
      field: "created_at",
      label: "Before Date",
      dtype: "date",
      input: {
        type: "date",
      },
    },
  },
  composites: {
    ".and": {
      label: "And",
    },
    ".or": {
      label: "Or",
    },
  },
  default_order: ["created_at.desc", "name__family.asc"],
};

// Example data
const EXAMPLE_DATA: DataRow[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name__given: "John",
    name__family: "Doe",
    email: "john.doe@example.com",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name__given: "Jane",
    name__family: "Smith",
    email: "jane.smith@example.com",
    status: "active",
    created_at: "2024-01-14T15:45:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name__given: "Bob",
    name__family: "Johnson",
    email: "bob.johnson@example.com",
    status: "inactive",
    created_at: "2024-01-13T08:20:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name__given: "Alice",
    name__family: "Brown",
    email: "alice.brown@example.com",
    status: "pending",
    created_at: "2024-01-12T14:15:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name__given: "Charlie",
    name__family: "Wilson",
    email: "charlie.wilson@example.com",
    status: "suspended",
    created_at: "2024-01-11T11:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name__given: "Eva",
    name__family: "Davis",
    email: "eva.davis@example.com",
    status: "active",
    created_at: "2024-01-10T16:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name__given: "Frank",
    name__family: "Miller",
    email: "frank.miller@example.com",
    status: "active",
    created_at: "2024-01-09T09:45:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name__given: "Grace",
    name__family: "Thompson",
    email: "grace.thompson@example.com",
    status: "inactive",
    created_at: "2024-01-08T13:20:00Z",
  },
];

const meta: Meta<typeof DataTable> = {
  title: "DataTable/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper component
const DataTableWrapper = (props: Partial<DataTableProps>) => {
  const [queryState, setQueryState] = useState<QueryState>({
    query: [],
    sort: [{ field: "name", direction: "asc" }],
    select: ["name", "email", "role", "status", "createdAt"],
    search: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: sampleUsers.length,
  });

  const handleQueryStateChange = (newState: QueryState) => {
    setQueryState(newState);
  };

  const handlePaginationChange = (paginationState: PaginationState) => {
    setPagination(paginationState);
  };

  return (
    <DataTable
      data={sampleUsers}
      queryState={queryState}
      onQueryStateChange={handleQueryStateChange}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      metadata={sampleMetadata}
      {...props}
    />
  );
};

export const Default: Story = {
  args: {
    data: EXAMPLE_DATA,
    metadata: EXAMPLE_METADATA,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    metadata: EXAMPLE_METADATA,
  },
};

export const Loading: Story = {
  args: {
    metadata: undefined, // This will show loading state
  },
};

export const WithInitialQuery: Story = {
  args: {
    data: EXAMPLE_DATA,
    metadata: EXAMPLE_METADATA,
    queryState: {
      query: [],
      sort: [{ field: "name__family", direction: "asc" }],
      select: ["name__given", "name__family", "email", "status"],
      search: "",
    },
  },
};

export const LargeDataset: Story = {
  args: {
    data: Array.from({ length: 50 }, (_, i) => ({
      ...EXAMPLE_DATA[i % EXAMPLE_DATA.length],
      id: `550e8400-e29b-41d4-a716-${String(i).padStart(12, "0")}`,
      name__given: `${EXAMPLE_DATA[i % EXAMPLE_DATA.length].name__given} ${
        i + 1
      }`,
    })),
    metadata: EXAMPLE_METADATA,
  },
};

// --- Dynamic fetch story using real APIManager calls ---

export const WithOrganizationApi: Story = {
  args: {
    dataApi: "idm:organization",
    // Let DataTable handle internal fetching of metadata + data via APIManager
    debug: true,
  },
};
