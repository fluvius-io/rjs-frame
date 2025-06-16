import React, { useState } from "react";
import {
  QueryBuilder,
  QueryBuilderModal,
  QueryMetadata,
  QueryState,
} from "../src";

// Exact metadata format from the specification
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

export const QueryBuilderExample: React.FC = () => {
  const [queryState, setQueryState] = useState<QueryState>({
    query: [],
    sort: [],
    select: ["name__given", "name__family"],
    search: "",
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleQueryStateChange = (newState: QueryState) => {
    setQueryState(newState);
    console.log("Query state changed:", newState);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">QueryBuilder Examples</h1>

      {/* Basic QueryBuilder */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic QueryBuilder</h2>
        <QueryBuilder
          metadata={QUERY_METADATA}
          queryState={queryState}
          onQueryStateChange={handleQueryStateChange}
          showDebug={true}
        />
      </div>

      {/* QueryBuilder with Custom Input */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          QueryBuilder with Custom Input
        </h2>
        <QueryBuilder
          metadata={QUERY_METADATA}
          queryState={queryState}
          onQueryStateChange={handleQueryStateChange}
          customInput={{
            "name__given.eq": {
              type: "select",
              options: [
                { value: "Harry", label: "Harry" },
                { value: "Hermione", label: "Hermione" },
                { value: "Ron", label: "Ron" },
              ],
            },
          }}
          showDebug={true}
        />
      </div>

      {/* QueryBuilder Modal */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">QueryBuilder Modal</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open QueryBuilder Modal
        </button>

        <QueryBuilderModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          metadata={QUERY_METADATA}
          queryState={queryState}
          onQueryStateChange={handleQueryStateChange}
          title="Build Your Query"
          showDebug={true}
        />
      </div>

      {/* Current Query State */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Current Query State</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
          {JSON.stringify(queryState, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default QueryBuilderExample;
