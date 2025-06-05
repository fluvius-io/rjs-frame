import type { Meta, StoryObj } from '@storybook/react';
import '../../lib/api'; // Import to ensure APIManager is initialized
import { Button } from '../common/Button';
import DataTable from './DataTable';
import ResourceDataTable from './ResourceDataTable';
import type { QueryMetadata } from './types';

// Mock API metadata for the direct metadata example only
const mockApiMetadata: QueryMetadata = {
  fields: {
    "_id": {
      "label": "User ID",
      "sortable": true,
      "hidden": false,
      "identifier": true,
      "factory": null,
      "source": null
    },
    "name__family": {
      "label": "Family Name",
      "sortable": true,
      "hidden": false,
      "identifier": false,
      "factory": null,
      "source": null
    },
    "name__given": {
      "label": "Given Name",
      "sortable": true,
      "hidden": false,
      "identifier": false,
      "factory": null,
      "source": null
    },
    "email": {
      "label": "Email Address",
      "sortable": true,
      "hidden": false,
      "identifier": false,
      "factory": null,
      "source": null
    },
    "status": {
      "label": "Status",
      "sortable": true,
      "hidden": false,
      "identifier": false,
      "factory": null,
      "source": null
    }
  },
  operators: {
    ":and": {
      "index": 1,
      "field_name": "",
      "operator": "and",
      "widget": {
        "name": "AND",
        "desc": null,
        "inversible": true,
        "data_query": null
      }
    },
    ":or": {
      "index": 2,
      "field_name": "",
      "operator": "or",
      "widget": {
        "name": "OR",
        "desc": null,
        "inversible": true,
        "data_query": null
      }
    },
    "_id:in": {
      "index": 3,
      "field_name": "_id",
      "operator": "in",
      "widget": null
    },
    "_id:eq": {
      "index": 4,
      "field_name": "_id",
      "operator": "eq",
      "widget": null
    },
    "_id:is": {
      "index": 5,
      "field_name": "_id",
      "operator": "is",
      "widget": null
    },
    "name__family:eq": {
      "index": 6,
      "field_name": "name__family",
      "operator": "eq",
      "widget": null
    },
    "name__family:ilike": {
      "index": 7,
      "field_name": "name__family",
      "operator": "ilike",
      "widget": null
    },
    "name__family:is": {
      "index": 8,
      "field_name": "name__family",
      "operator": "is",
      "widget": null
    },
    "name__family:in": {
      "index": 9,
      "field_name": "name__family",
      "operator": "in",
      "widget": null
    },
    "name__given:eq": {
      "index": 10,
      "field_name": "name__given",
      "operator": "eq",
      "widget": null
    },
    "name__given:ilike": {
      "index": 11,
      "field_name": "name__given",
      "operator": "ilike",
      "widget": null
    },
    "name__given:is": {
      "index": 12,
      "field_name": "name__given",
      "operator": "is",
      "widget": null
    },
    "name__given:in": {
      "index": 13,
      "field_name": "name__given",
      "operator": "in",
      "widget": null
    },
    "email:eq": {
      "index": 14,
      "field_name": "email",
      "operator": "eq",
      "widget": null
    },
    "email:ilike": {
      "index": 15,
      "field_name": "email",
      "operator": "ilike",
      "widget": null
    }
  },
  sortables: [
    "_id",
    "name__family",
    "name__given",
    "email",
    "status"
  ],
  default_order: [
    "_id:asc"
  ]
};

const meta: Meta<typeof ResourceDataTable> = {
  title: 'Components/ResourceDataTable',
  component: ResourceDataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A DataTable component that fetches metadata and data from real API endpoints via Vite proxy.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Complete API integration with both metadata and data from real server
export const WithApiMetadataAndData: Story = {
  render: () => {
    return (
      <div>
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>🌐 Live API:</strong> This example fetches real data from your backend server via Vite proxy. 
          Make sure your server is running on <code>http://localhost:8000</code> and check browser console for API calls.
        </div>
        <ResourceDataTable
          dataApi="idm:user"
          title="Users from Real API"
          subtitle="Both metadata and data fetched from live backend server"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
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
          <strong>🏢 Organizations API:</strong> This example fetches organization data from your backend server. 
          Make sure your server is running on <code>http://localhost:8000</code> and provides organization endpoints.
        </div>
        <ResourceDataTable
          dataApi="idm:organization"
          title="Organizations from Real API"
          subtitle="Organization metadata and data fetched from live backend server"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
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
          <strong>🔄 API Integration:</strong> Metadata and data from real API endpoint.
          Make sure your server is running on <code>http://localhost:8000</code>.
        </div>
        <ResourceDataTable
          dataApi="idm:user"
          title="Users from API"
          subtitle="Metadata and data from real API"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
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
        _id: 'user_001',
        name__family: 'Smith',
        name__given: 'John',
        email: 'john.smith@example.com',
        status: 'Active'
      },
      {
        _id: 'user_002',
        name__family: 'Johnson',
        name__given: 'Jane',
        email: 'jane.johnson@example.com',
        status: 'Inactive'
      },
      {
        _id: 'user_003',
        name__family: 'Williams',
        name__given: 'Bob',
        email: 'bob.williams@example.com',
        status: 'Active'
      }
    ];

    return (
      <div>
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm">
          <strong>📋 Static Mode:</strong> Using hardcoded API metadata format with static sample data.
        </div>
        <DataTable
          metadata={mockApiMetadata}
          data={sampleData}
          pagination={{
            page: 1,
            pageSize: 10,
            total: sampleData.length,
          }}
          title="Direct API Metadata Usage"
          subtitle="Using API metadata format directly with static data"
          showSearch
          showFilters
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
          <strong>⚠️ Server Error Demo:</strong> This will show error state if backend server is not running.
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

