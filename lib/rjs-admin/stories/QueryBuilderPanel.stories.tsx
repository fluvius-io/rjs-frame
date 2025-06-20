import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { QueryBuilderPanel } from "../src/components/querybuilder";
import { FilterState, QueryMetadata } from "../src/types/querybuilder";

// Import the CSS file
import "../src/styles/components/querybuilder.css";

// Sample metadata for the stories
const SAMPLE_METADATA: QueryMetadata = {
  name: "user",
  title: "User Query",
  desc: "List all user accounts",
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
      label: "Email",
      name: "email",
      desc: null,
      noop: "ilike",
      hidden: false,
      sortable: true,
    },
    {
      label: "Age",
      name: "age",
      desc: null,
      noop: "eq",
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
      label: "User ID (Equals)",
      dtype: "uuid",
      input: {
        type: "text",
        placeholder: "Enter user ID...",
      },
    },
    "name__given.eq": {
      field: "name__given",
      label: "Given Name (Equals)",
      dtype: "string",
      input: {
        type: "text",
        placeholder: "Enter exact name...",
      },
    },
    "name__given.ilike": {
      field: "name__given",
      label: "Given Name (Contains)",
      dtype: "string",
      input: {
        type: "text",
        placeholder: "Enter partial name...",
      },
    },
    "name__family.eq": {
      field: "name__family",
      label: "Family Name (Equals)",
      dtype: "string",
      input: {
        type: "text",
        placeholder: "Enter exact family name...",
      },
    },
    "email.ilike": {
      field: "email",
      label: "Email (Contains)",
      dtype: "string",
      input: {
        type: "text",
        placeholder: "Enter partial email...",
      },
    },
    "age.gt": {
      field: "age",
      label: "Age (Greater Than)",
      dtype: "number",
      input: {
        type: "number",
        placeholder: "Enter minimum age...",
        min: 0,
        max: 120,
      },
    },
    "age.lt": {
      field: "age",
      label: "Age (Less Than)",
      dtype: "number",
      input: {
        type: "number",
        placeholder: "Enter maximum age...",
        min: 0,
        max: 120,
      },
    },
    "status.eq": {
      field: "status",
      label: "Status",
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
      label: "Created After",
      dtype: "date",
      input: {
        type: "date",
      },
    },
    "created_at.lte": {
      field: "created_at",
      label: "Created Before",
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
  default_order: ["created_at.desc"],
};

const meta: Meta<typeof QueryBuilderPanel> = {
  title: "Components/QueryBuilderPanel",
  component: QueryBuilderPanel,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    metaSource: {
      control: false,
    },
    filterStates: {
      control: false,
    },
    onFilterStatesChange: {
      action: "filterStatesChanged",
    },
  },
};

export default meta;
type Story = StoryObj<typeof QueryBuilderPanel>;

// Basic QueryBuilderPanel story
export const Default: Story = {
  render: (args) => {
    const [filterStates, setFilterStates] = useState<
      Record<string, FilterState>
    >({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          filterStates={filterStates}
          onFilterStatesChange={setFilterStates}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Filter States:</strong>
          <pre>{JSON.stringify(filterStates, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    fields: ["name__given", "email", "status"],
    metaSource: "mock:user",
    title: "User Search",
  },
};

// QueryBuilderPanel with initial filter states
export const WithInitialFilterStates: Story = {
  render: (args) => {
    const [filterStates, setFilterStates] = useState<
      Record<string, FilterState>
    >({
      name__given: {
        id: "filter-name__given",
        type: "field",
        field: "name__given",
        operator: "name__given.eq",
        value: "John",
      },
      status: {
        id: "filter-status",
        type: "field",
        field: "status",
        operator: "status.eq",
        value: "active",
      },
    });

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          filterStates={filterStates}
          onFilterStatesChange={setFilterStates}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Filter States:</strong>
          <pre>{JSON.stringify(filterStates, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    fields: ["name__given", "email", "status"],
    metaSource: "mock:user",
    title: "User Search (Pre-filled)",
  },
};

// QueryBuilderPanel with all fields
export const AllFields: Story = {
  render: (args) => {
    const [filterStates, setFilterStates] = useState<
      Record<string, FilterState>
    >({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          filterStates={filterStates}
          onFilterStatesChange={setFilterStates}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Filter States:</strong>
          <pre>{JSON.stringify(filterStates, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    fields: [
      "id",
      "name__given",
      "name__family",
      "email",
      "age",
      "status",
      "created_at",
    ],
    metaSource: "mock:user",
    title: "All Fields",
  },
};

// QueryBuilderPanel with custom input configurations
export const WithCustomInput: Story = {
  render: (args) => {
    const [filterStates, setFilterStates] = useState<
      Record<string, FilterState>
    >({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          filterStates={filterStates}
          onFilterStatesChange={setFilterStates}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Filter States:</strong>
          <pre>{JSON.stringify(filterStates, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    fields: ["name__given", "email", "age"],
    metaSource: "mock:user",
    title: "Custom Inputs",
    customInput: {
      "name__given.ilike": {
        type: "text",
        placeholder: "Search by first name...",
      },
      "email.ilike": {
        type: "text",
        placeholder: "Search by email domain...",
      },
      "age.gt": {
        type: "number",
        placeholder: "Minimum age...",
        min: 18,
        max: 100,
      },
    },
  },
};

// QueryBuilderPanel with invalid fields
export const WithInvalidFields: Story = {
  render: (args) => {
    const [filterStates, setFilterStates] = useState<
      Record<string, FilterState>
    >({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          filterStates={filterStates}
          onFilterStatesChange={setFilterStates}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Filter States:</strong>
          <pre>{JSON.stringify(filterStates, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    fields: ["name__given", "invalid_field", "status", "another_invalid"],
    metaSource: "mock:user",
    title: "Mixed Valid/Invalid Fields",
  },
};

// QueryBuilderPanel with no valid fields
export const NoValidFields: Story = {
  render: (args) => {
    const [filterStates, setFilterStates] = useState<
      Record<string, FilterState>
    >({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          filterStates={filterStates}
          onFilterStatesChange={setFilterStates}
        />
      </div>
    );
  },
  args: {
    fields: ["invalid_field", "another_invalid", "not_found"],
    metaSource: "mock:user",
    title: "No Valid Fields",
  },
};

// QueryBuilderPanel with different input types
export const DifferentInputTypes: Story = {
  render: (args) => {
    const [filterStates, setFilterStates] = useState<
      Record<string, FilterState>
    >({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          filterStates={filterStates}
          onFilterStatesChange={setFilterStates}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Filter States:</strong>
          <pre>{JSON.stringify(filterStates, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    fields: ["name__given", "age", "status", "created_at"],
    metaSource: "mock:user",
    title: "Different Input Types",
  },
};
