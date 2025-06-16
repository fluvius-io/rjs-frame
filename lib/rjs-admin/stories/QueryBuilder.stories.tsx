import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import {
  QueryBuilder,
  QueryBuilderModal,
} from "../src/components/querybuilder";
import { QueryMetadata, QueryState } from "../src/types/querybuilder";

// Import the CSS file
import "../src/styles/components/querybuilder.css";

// Metadata from the specification
const QUERY_METADATA: QueryMetadata = {
  name: "user",
  title: "UserQuery",
  desc: "List all user accounts",
  fields: {
    id: {
      label: "User ID",
      name: "id",
      desc: null,
      noop: "eq",
      hidden: true,
      sortable: true,
    },
    name__given: {
      label: "Given Name",
      name: "name__given",
      desc: null,
      noop: "eq",
      hidden: false,
      sortable: true,
    },
    name__family: {
      label: "Family Name",
      name: "name__family",
      desc: null,
      noop: "eq",
      hidden: false,
      sortable: true,
    },
  },
  filters: {
    "id.eq": {
      field: "id",
      label: "Equals",
      dtype: "uuid",
      input: {
        type: "text",
        placeholder: "Enter some values ...",
      },
    },
    "id.in": {
      field: "id",
      label: "In List",
      dtype: "uuid",
      input: {
        type: "text",
      },
    },
    "name__given.eq": {
      field: "name__given",
      label: "Equals",
      dtype: "string",
      input: {
        type: "text",
      },
    },
    "name__given.ilike": {
      field: "name__given",
      label: "Contains",
      dtype: "string",
      input: {
        type: "text",
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
  },
  composites: {
    ".and": {
      label: "And",
    },
    ".or": {
      label: "Or",
    },
  },
  default_order: ["id.desc"],
};

const meta: Meta<typeof QueryBuilder> = {
  title: "Components/QueryBuilder",
  component: QueryBuilder,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    metadata: {
      control: false,
    },
    queryState: {
      control: false,
    },
    onQueryStateChange: {
      action: "queryStateChanged",
    },
  },
};

export default meta;
type Story = StoryObj<typeof QueryBuilder>;

// Basic QueryBuilder story
export const Default: Story = {
  render: (args) => {
    const [queryState, setQueryState] = useState<QueryState>({
      query: [],
      sort: [],
      select: ["name__given", "name__family"],
      search: "",
    });

    return (
      <QueryBuilder
        {...args}
        queryState={queryState}
        onQueryStateChange={setQueryState}
      />
    );
  },
  args: {
    metadata: QUERY_METADATA,
    showDebug: false,
  },
};

// QueryBuilder with debug enabled
export const WithDebug: Story = {
  render: (args) => {
    const [queryState, setQueryState] = useState<QueryState>({
      query: [],
      sort: [],
      select: ["name__given", "name__family"],
      search: "",
    });

    return (
      <QueryBuilder
        {...args}
        queryState={queryState}
        onQueryStateChange={setQueryState}
      />
    );
  },
  args: {
    metadata: QUERY_METADATA,
    showDebug: true,
  },
};

// QueryBuilder with initial data
export const WithInitialData: Story = {
  render: (args) => {
    const [queryState, setQueryState] = useState<QueryState>({
      query: [
        {
          id: "filter-1",
          type: "field",
          field: "name__family",
          operator: "name__family.eq",
          value: "Potter",
        },
        {
          id: "filter-2",
          type: "field",
          field: "name__given",
          operator: "name__given.ilike",
          value: "Harry",
        },
      ],
      sort: [{ field: "name__given", direction: "asc" }],
      select: ["name__given", "name__family"],
      search: "wizard",
    });

    return (
      <QueryBuilder
        {...args}
        queryState={queryState}
        onQueryStateChange={setQueryState}
      />
    );
  },
  args: {
    metadata: QUERY_METADATA,
    showDebug: true,
  },
};

// QueryBuilder with composite filters
export const WithCompositeFilters: Story = {
  render: (args) => {
    const [queryState, setQueryState] = useState<QueryState>({
      query: [
        {
          id: "filter-1",
          type: "composite",
          operator: ".and",
          children: [
            {
              id: "filter-2",
              type: "field",
              field: "name__family",
              operator: "name__family.eq",
              value: "Potter",
            },
            {
              id: "filter-3",
              type: "field",
              field: "name__given",
              operator: "name__given.eq",
              value: "Harry",
            },
          ],
        },
      ],
      sort: [{ field: "name__given", direction: "asc" }],
      select: ["name__given", "name__family"],
      search: "magic",
    });

    return (
      <QueryBuilder
        {...args}
        queryState={queryState}
        onQueryStateChange={setQueryState}
      />
    );
  },
  args: {
    metadata: QUERY_METADATA,
    showDebug: true,
  },
};

// QueryBuilder with custom input
export const WithCustomInput: Story = {
  render: (args) => {
    const [queryState, setQueryState] = useState<QueryState>({
      query: [],
      sort: [],
      select: ["name__given", "name__family"],
      search: "",
    });

    return (
      <QueryBuilder
        {...args}
        queryState={queryState}
        onQueryStateChange={setQueryState}
      />
    );
  },
  args: {
    metadata: QUERY_METADATA,
    customInput: {
      "name__given.eq": {
        type: "select",
        options: [
          { value: "Harry", label: "Harry" },
          { value: "Hermione", label: "Hermione" },
          { value: "Ron", label: "Ron" },
        ],
      },
    },
    showDebug: true,
  },
};

// QueryBuilderModal story
export const Modal: StoryObj<typeof QueryBuilderModal> = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [queryState, setQueryState] = useState<QueryState>({
      query: [],
      sort: [],
      select: ["name__given", "name__family"],
      search: "",
    });

    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Query Builder Modal
        </button>
        <QueryBuilderModal
          {...args}
          open={open}
          onOpenChange={setOpen}
          queryState={queryState}
          onQueryStateChange={setQueryState}
        />
      </div>
    );
  },
  args: {
    metadata: QUERY_METADATA,
    title: "Build Your Query",
    showDebug: true,
  },
};
