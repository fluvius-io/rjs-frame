import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { QueryBuilderPanel } from "../src/components/querybuilder";
import { QueryMetadata, QueryValue } from "../src/types/querybuilder";

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
    metadata: {
      control: false,
    },
    values: {
      control: false,
    },
    onValuesChange: {
      action: "valuesChanged",
    },
  },
};

export default meta;
type Story = StoryObj<typeof QueryBuilderPanel>;

// Basic QueryBuilderPanel story
export const Default: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, QueryValue>>({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          values={values}
          onValuesChange={setValues}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Values:</strong>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    operators: ["name__given.eq", "email.ilike", "status.eq"],
    metadata: SAMPLE_METADATA,
    title: "User Search",
  },
};

// QueryBuilderPanel with initial values
export const WithInitialValues: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, QueryValue>>({
      "name__given.eq": "John",
      "status.eq": "active",
    });

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          values={values}
          onValuesChange={setValues}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Values:</strong>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    operators: ["name__given.eq", "email.ilike", "status.eq"],
    metadata: SAMPLE_METADATA,
    title: "User Search (Pre-filled)",
  },
};

// QueryBuilderPanel with all operator types
export const AllOperators: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, QueryValue>>({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          values={values}
          onValuesChange={setValues}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Values:</strong>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    operators: [
      "id.eq",
      "name__given.eq",
      "name__given.ilike",
      "name__family.eq",
      "email.ilike",
      "age.gt",
      "age.lt",
      "status.eq",
      "created_at.gte",
      "created_at.lte",
    ],
    metadata: SAMPLE_METADATA,
    title: "All Filters",
  },
};

// QueryBuilderPanel with custom input configurations
export const WithCustomInput: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, QueryValue>>({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          values={values}
          onValuesChange={setValues}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Values:</strong>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    operators: ["name__given.ilike", "email.ilike", "age.gt"],
    metadata: SAMPLE_METADATA,
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

// QueryBuilderPanel with invalid operators
export const WithInvalidOperators: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, QueryValue>>({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          values={values}
          onValuesChange={setValues}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Values:</strong>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    operators: [
      "name__given.eq",
      "invalid.operator",
      "status.eq",
      "another.invalid",
    ],
    metadata: SAMPLE_METADATA,
    title: "Mixed Valid/Invalid Operators",
  },
};

// QueryBuilderPanel with no valid operators
export const NoValidOperators: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, QueryValue>>({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          values={values}
          onValuesChange={setValues}
        />
      </div>
    );
  },
  args: {
    operators: ["invalid.operator", "another.invalid", "not.found"],
    metadata: SAMPLE_METADATA,
    title: "No Valid Operators",
  },
};

// QueryBuilderPanel with different input types
export const DifferentInputTypes: Story = {
  render: (args) => {
    const [values, setValues] = useState<Record<string, QueryValue>>({});

    return (
      <div style={{ maxWidth: "400px" }}>
        <QueryBuilderPanel
          {...args}
          values={values}
          onValuesChange={setValues}
        />
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
          }}
        >
          <strong>Current Values:</strong>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </div>
    );
  },
  args: {
    operators: ["name__given.eq", "age.gt", "status.eq", "created_at.gte"],
    metadata: SAMPLE_METADATA,
    title: "Different Input Types",
  },
};
