import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../common/Button";
import type { QueryMetadata } from "../data-table/types";
import QueryBuilderModal from "./QueryBuilderModal";
import { QueryBuilderState } from "./types";

// Mock metadata for demonstration
const mockMetadata: QueryMetadata = {
  fields: {
    _id: {
      label: "User ID",
      sortable: true,
      hidden: false,
      identifier: true,
      factory: null,
      source: null,
    },
    name__family: {
      label: "Family Name",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
    name__given: {
      label: "Given Name",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
    email: {
      label: "Email Address",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
    status: {
      label: "Status",
      sortable: true,
      hidden: false,
      identifier: false,
      factory: null,
      source: null,
    },
  },
  operators: {
    ".and": {
      index: 1,
      field_name: "",
      operator: "and",
      widget: {
        name: "AND",
        desc: null,
        inversible: true,
        data_query: null,
      },
    },
    ".or": {
      index: 2,
      field_name: "",
      operator: "or",
      widget: {
        name: "OR",
        desc: null,
        inversible: true,
        data_query: null,
      },
    },
    "_id.in": {
      index: 3,
      field_name: "_id",
      operator: "in",
      widget: null,
    },
    "_id.eq": {
      index: 4,
      field_name: "_id",
      operator: "eq",
      widget: null,
    },
    "name__family.eq": {
      index: 5,
      field_name: "name__family",
      operator: "eq",
      widget: null,
    },
    "name__family.ilike": {
      index: 6,
      field_name: "name__family",
      operator: "ilike",
      widget: null,
    },
    "name__given.eq": {
      index: 7,
      field_name: "name__given",
      operator: "eq",
      widget: null,
    },
    "name__given.ilike": {
      index: 8,
      field_name: "name__given",
      operator: "ilike",
      widget: null,
    },
    "email:eq": {
      index: 14,
      field_name: "email",
      operator: "eq",
      widget: null,
    },
    "email:ilike": {
      index: 15,
      field_name: "email",
      operator: "ilike",
      widget: null,
    },
  },
  sortables: ["_id", "name__family", "name__given", "email", "status"],
  default_order: ["_id:asc"],
};

const meta: Meta<typeof QueryBuilderModal> = {
  title: "Components/QueryBuilderModal",
  component: QueryBuilderModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `A reusable query builder modal component that provides a visual interface for building complex database queries with filters.

**Features:**
- Visual filter building with QueryBuilder integration
- Modal state management with local filter editing
- Apply/Cancel functionality with proper state handling
- Keyboard support (Escape to close)
- Responsive design with mobile-friendly layout

**Usage in DataTable:**
This component is designed to be used within DataTable but can also be used standalone in other contexts where filter functionality is needed.`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive filter modal demo
export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<QueryBuilderState>({
      selectedFields: [],
      sortRules: [],
      filterRules: [],
    });
    const [appliedFilters, setAppliedFilters] = useState<string | undefined>();

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleApply = (queryState: QueryBuilderState) => {
      setAppliedFilters(JSON.stringify(queryState, null, 2));
      setCurrentFilters(queryState);
      console.log("Applied filters:", queryState);
    };

    return (
      <div className="p-6 space-y-4">
        <div className="p-4 bg-gray-50 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Query Builder Modal Demo
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Click the button below to open the query builder modal and build
            some filters.
          </p>

          <Button onClick={handleOpen}>Open Query Builder Modal</Button>

          {appliedFilters && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="text-sm">
                <strong>Applied Query:</strong>
                <div className="mt-1 font-mono text-blue-700 whitespace-pre-wrap">
                  {appliedFilters}
                </div>
              </div>
            </div>
          )}
        </div>

        <QueryBuilderModal
          isOpen={isOpen}
          metadata={mockMetadata}
          currentQuery={currentFilters}
          onClose={handleClose}
          onApply={handleApply}
        />
      </div>
    );
  },
};

// Always open modal for easier development
export const AlwaysOpen: Story = {
  render: () => {
    const [currentFilters, setCurrentFilters] = useState<QueryBuilderState>({
      selectedFields: [],
      sortRules: [],
      filterRules: [],
    });

    const handleApply = (queryState: QueryBuilderState) => {
      setCurrentFilters(queryState);
      console.log("Applied filters:", queryState);
    };

    const handleClose = () => {
      console.log("Modal close requested");
    };

    return (
      <div className="min-h-screen">
        {/* Add lots of content to demonstrate scroll prevention */}
        <div className="p-6 space-y-6">
          <div className="mb-4 p-4 bg-gray-50 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">
              Always Open Query Builder Modal
            </h3>
            <p className="text-sm text-gray-600">
              This story shows the modal always open for easier development and
              testing. Notice that the page background cannot be scrolled when
              the modal is open.
            </p>
          </div>

          {/* Generate lots of content to make page scrollable */}
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="p-4 bg-white border rounded-md shadow-sm">
              <h4 className="font-medium text-gray-900">
                Content Block {i + 1}
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                This is sample content to make the page scrollable. When the
                modal is open, you should not be able to scroll this background
                content. Only the modal content itself should be scrollable if
                it overflows.
              </p>
            </div>
          ))}
        </div>

        <QueryBuilderModal
          isOpen={true}
          metadata={mockMetadata}
          currentQuery={currentFilters}
          onClose={handleClose}
          onApply={handleApply}
        />
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
  },
};

// Modal with pre-filled filters
export const WithPrefilledFilters: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<QueryBuilderState>({
      selectedFields: ["name__family", "email"],
      sortRules: [{ field: "name__family", direction: "asc" }],
      filterRules: [
        {
          id: "filter-1",
          type: "field",
          field: "status",
          operator: "eq",
          value: "Active",
        },
        {
          id: "filter-2",
          type: "field",
          field: "email",
          operator: "ilike",
          value: "@example.com",
        },
      ],
    });

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleApply = (queryState: QueryBuilderState) => {
      setCurrentFilters(queryState);
      console.log("Applied filters:", queryState);
    };

    return (
      <div className="p-6 space-y-4">
        <div className="p-4 bg-gray-50 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Pre-filled Query Builder Modal
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This story demonstrates the modal with some pre-existing filters and
            sort rules.
          </p>

          <Button onClick={handleOpen}>
            Open Modal with Pre-filled Filters
          </Button>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-sm">
              <strong>Current Query State:</strong>
              <div className="mt-1 font-mono text-blue-700 whitespace-pre-wrap">
                {JSON.stringify(currentFilters, null, 2)}
              </div>
            </div>
          </div>
        </div>

        <QueryBuilderModal
          isOpen={isOpen}
          metadata={mockMetadata}
          currentQuery={currentFilters}
          onClose={handleClose}
          onApply={handleApply}
        />
      </div>
    );
  },
};

// Test scroll behavior with toggle
export const ScrollBehaviorDemo: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<QueryBuilderState>({
      selectedFields: [],
      sortRules: [],
      filterRules: [],
    });

    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    const handleApply = (queryState: QueryBuilderState) => {
      setCurrentFilters(queryState);
      console.log("Applied filters:", queryState);
    };

    return (
      <div className="min-h-screen">
        <div className="p-6 space-y-6">
          <div className="sticky top-0 bg-white p-4 border-b shadow-sm z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Scroll Behavior Demo</h3>
                <p className="text-sm text-gray-600">
                  Click the button to open the modal and test scroll behavior.
                  When modal is open, page background should not scroll.
                </p>
              </div>
              <Button onClick={handleOpen}>
                {isOpen ? "Modal is Open" : "Open Modal"}
              </Button>
            </div>
          </div>

          {/* Generate scrollable content */}
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i} className="p-4 bg-white border rounded-md shadow-sm">
              <h4 className="font-medium text-gray-900">
                Scrollable Content Block {i + 1}
              </h4>
              <p className="text-sm text-gray-600 mt-2">
                This content should not be scrollable when the modal is open.
                The modal prevents background scrolling and only allows
                scrolling within the modal content area itself.
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Block #{i + 1} • Modal Status:{" "}
                {isOpen ? "Open (scroll locked)" : "Closed (scroll enabled)"}
              </div>
            </div>
          ))}
        </div>

        <QueryBuilderModal
          isOpen={isOpen}
          metadata={mockMetadata}
          currentQuery={currentFilters}
          onClose={handleClose}
          onApply={handleApply}
        />
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
  },
};
