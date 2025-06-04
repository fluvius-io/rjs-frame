import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useState } from 'react';
import '../../lib/api'; // Import to ensure APIManager is initialized
import { Button } from '../common/Button';
import PaginatedList from './PaginatedList';
import type { QueryMetadata } from './types';

// Mock metadata for testing QueryBuilder integration
const mockMetadata: QueryMetadata = {
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
        "desc": "Logical AND operator",
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
        "desc": "Logical OR operator",
        "inversible": true,
        "data_query": null
      }
    },
    "_id:eq": {
      "index": 3,
      "field_name": "_id",
      "operator": "eq",
      "widget": null
    },
    "name__family:eq": {
      "index": 4,
      "field_name": "name__family",
      "operator": "eq",
      "widget": null
    },
    "name__family:ilike": {
      "index": 5,
      "field_name": "name__family",
      "operator": "ilike",
      "widget": null
    },
    "name__given:eq": {
      "index": 6,
      "field_name": "name__given",
      "operator": "eq",
      "widget": null
    },
    "email:eq": {
      "index": 7,
      "field_name": "email",
      "operator": "eq",
      "widget": null
    },
    "status:eq": {
      "index": 8,
      "field_name": "status",
      "operator": "eq",
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

// Sample data
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
  },
  {
    _id: 'user_004',
    name__family: 'Brown',
    name__given: 'Alice',
    email: 'alice.brown@example.com',
    status: 'Active'
  }
];

const meta: Meta<typeof PaginatedList> = {
  title: 'Components/FilterIntegration',
  component: PaginatedList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Testing the new QueryBuilder filter integration with PaginatedList.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const QueryBuilderFilters: Story = {
  render: () => {
    const [filterData, setFilterData] = useState<any>(null);

    const handleFilterChange = useCallback((data: any) => {
      setFilterData(data);
    }, []);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>🎯 QueryBuilder Filter Integration:</strong> This example demonstrates the new QueryBuilder-based filter system. 
          Click the "Filters" button to open the QueryBuilder modal and build complex filter queries.
        </div>
        
        <PaginatedList
          metadata={mockMetadata}
          data={sampleData}
          pagination={{
            page: 1,
            pageSize: 10,
            total: sampleData.length,
          }}
          title="Users with QueryBuilder Filters"
          subtitle="Demonstrates the new filter integration"
          showSearch
          showFilters
          onFilter={handleFilterChange}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button size="sm">Add User</Button>
            </div>
          }
        />

        {/* Show filter data for debugging */}
        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Filter Data (Debug)</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {filterData ? JSON.stringify(filterData, null, 2) : 'No filter data yet'}
          </pre>
        </div>
      </div>
    );
  },
}; 