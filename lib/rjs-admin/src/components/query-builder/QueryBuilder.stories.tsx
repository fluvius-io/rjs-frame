import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { QueryMetadata } from '../data-table/types';
import QueryBuilder from './QueryBuilder';
import { QueryBuilderState, toResourceQuery } from './types';

// Mock metadata with composite operators for demonstration
const mockMetadataWithCompositeOperators: QueryMetadata = {
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
    },
    "age": {
      "label": "Age",
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
    "_id:in": {
      "index": 4,
      "field_name": "_id",
      "operator": "in",
      "widget": null
    },
    "name__family:eq": {
      "index": 5,
      "field_name": "name__family",
      "operator": "eq",
      "widget": null
    },
    "name__family:ilike": {
      "index": 6,
      "field_name": "name__family",
      "operator": "ilike",
      "widget": null
    },
    "name__family:in": {
      "index": 7,
      "field_name": "name__family",
      "operator": "in",
      "widget": null
    },
    "name__given:eq": {
      "index": 8,
      "field_name": "name__given",
      "operator": "eq",
      "widget": null
    },
    "name__given:ilike": {
      "index": 9,
      "field_name": "name__given",
      "operator": "ilike",
      "widget": null
    },
    "email:eq": {
      "index": 10,
      "field_name": "email",
      "operator": "eq",
      "widget": null
    },
    "email:ilike": {
      "index": 11,
      "field_name": "email",
      "operator": "ilike",
      "widget": null
    },
    "status:eq": {
      "index": 12,
      "field_name": "status",
      "operator": "eq",
      "widget": null
    },
    "status:in": {
      "index": 13,
      "field_name": "status",
      "operator": "in",
      "widget": null
    },
    "age:eq": {
      "index": 14,
      "field_name": "age",
      "operator": "eq",
      "widget": null
    },
    "age:gt": {
      "index": 15,
      "field_name": "age",
      "operator": "gt",
      "widget": null
    },
    "age:lt": {
      "index": 16,
      "field_name": "age",
      "operator": "lt",
      "widget": null
    }
  },
  sortables: [
    "_id",
    "name__family", 
    "name__given",
    "email",
    "status",
    "age"
  ],
  default_order: [
    "_id:asc"
  ]
};

const meta: Meta<typeof QueryBuilder> = {
  title: 'Components/QueryBuilder',
  component: QueryBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `A visual query builder that provides a unified interface for building complex database queries.

Features configurable section visibility, allowing you to show/hide:
- Field selection
- Sort rules 
- Filter rules (including complex AND/OR groups)
- Query display

Operates on QueryBuilderState internally and can be converted to ResourceQuery objects for backend APIs.`,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic QueryBuilder
export const BasicQueryBuilder: Story = {
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState>({
      selectedFields: [],
      sortRules: [],
      filterRules: []
    });
    const [executedState, setExecutedState] = useState<QueryBuilderState | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🔧 Visual Query Builder:</strong> This example demonstrates the visual interface for building queries with field selection, sorting, and filters.
        </div>
        
        <QueryBuilder
          metadata={mockMetadataWithCompositeOperators}
          title="User Query Builder"
          onQueryChange={setCurrentState}
          onExecute={setExecutedState}
        />

        {/* Display current and executed states */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Current State</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(currentState, null, 2)}
            </pre>
            
            <h4 className="font-medium mt-3 mb-2">As ResourceQuery:</h4>
            <pre className="text-xs bg-blue-50 p-2 rounded overflow-x-auto">
              {JSON.stringify(toResourceQuery(currentState), null, 2)}
            </pre>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Last Executed State</h3>
            <pre className="text-xs bg-green-100 p-2 rounded overflow-x-auto">
              {executedState ? JSON.stringify(executedState, null, 2) : 'No query executed yet'}
            </pre>
            
            {executedState && (
              <>
                <h4 className="font-medium mt-3 mb-2">As ResourceQuery:</h4>
                <pre className="text-xs bg-green-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(toResourceQuery(executedState), null, 2)}
                </pre>
              </>
            )}
          </div>
        </div>
      </div>
    );
  },
};

// QueryBuilder with initial state
export const WithInitialState: Story = {
  render: () => {
    const initialState: Partial<QueryBuilderState> = {
      selectedFields: ['name__family', 'email'],
      sortRules: [{ field: 'name__family', direction: 'asc' }],
      filterRules: [{
        id: 'filter-1',
        type: 'field',
        field: 'name__family',
        operator: 'ilike',
        value: 'Smith'
      }]
    };

    const [state, setState] = useState<QueryBuilderState | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🔄 Initial State:</strong> This example starts with predefined field selection, sorting, and filters.
        </div>
        
        <QueryBuilder
          metadata={mockMetadataWithCompositeOperators}
          initialQuery={initialState}
          onQueryChange={setState}
          title="Query Builder with Initial State"
          showFieldSelection
          showSortRules
          showFilterRules
        />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Current State</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {state ? JSON.stringify(state, null, 2) : 'No changes yet'}
          </pre>
        </div>
      </div>
    );
  },
};

// Compact QueryBuilder
export const CompactMode: Story = {
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>📱 Compact Mode:</strong> A more compact query builder suitable for smaller spaces or embedded use.
        </div>
        
        <div className="max-w-4xl">
          <QueryBuilder
            metadata={mockMetadataWithCompositeOperators}
            title="Compact User Query Builder"
            onQueryChange={setCurrentState}
            className="max-w-none"
          />
        </div>

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">State Output</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentState ? JSON.stringify(currentState, null, 2) : 'Build a query above'}
          </pre>
        </div>
      </div>
    );
  },
};

// QueryBuilder integrated with live data execution
export const WithLiveDataExecution: Story = {
  render: () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const executeQuery = async (state: QueryBuilderState) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Convert to ResourceQuery for API
        const resourceQuery = toResourceQuery(state);
        
        // Mock data response based on query
        const mockResponse = {
          query: resourceQuery,
          results: [
            { _id: '1', name__family: 'Smith', email: 'john@example.com' },
            { _id: '2', name__family: 'Johnson', email: 'jane@example.com' },
          ],
          total: 2,
        };
        
        setData(mockResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
          <strong>🚀 Live Data Execution:</strong> Build a query and execute it against mock data. The results will be displayed below.
        </div>
        
        <QueryBuilder
          metadata={mockMetadataWithCompositeOperators}
          title="Query Builder with Live Execution"
          onExecute={executeQuery}
        />

        {/* Query execution results */}
        <div className="border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Execution Results</h3>
            {isLoading && (
              <div className="text-sm text-blue-600">🔄 Executing query...</div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              ❌ Error: {error}
            </div>
          )}

          {data && !isLoading && (
            <div className="space-y-3">
              <div className="text-sm text-green-700">
                ✅ Query executed successfully
              </div>
              
              {/* Data summary */}
              <div className="text-sm space-y-1">
                <div><strong>Total Items:</strong> {data.meta?.total_items || data.total || (Array.isArray(data) ? data.length : 'Unknown')}</div>
                <div><strong>Current Page:</strong> {data.meta?.page_no || data.page || 'N/A'}</div>
                <div><strong>Items on Page:</strong> {(data.data || data)?.length || 0}</div>
              </div>

              {/* Raw data */}
              <details>
                <summary className="cursor-pointer text-sm font-medium">
                  View Raw Response Data
                </summary>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto mt-2">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {!data && !error && !isLoading && (
            <div className="text-sm text-gray-500 italic">
              Build a query above and click "Execute Query" to see results
            </div>
          )}
        </div>
      </div>
    );
  },
};

// Minimal QueryBuilder for simple field selection
export const FieldSelectionOnly: Story = {
  render: () => {
    const simpleState: Partial<QueryBuilderState> = {
      selectedFields: ['_id', 'name__family'],
    };

    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>🎯 Field Selection Only:</strong> This mode only shows field selection, hiding all other sections.
        </div>
        
        <QueryBuilder
          metadata={mockMetadataWithCompositeOperators}
          initialQuery={simpleState}
          title="Field Selection Only"
          onQueryChange={setCurrentState}
          showFieldSelection={true}
          showSortRules={false}
          showFilterRules={false}
          showQueryDisplay={true}
          className="max-w-2xl"
        />
        
        {currentState && (
          <div className="mt-4 p-3 bg-gray-50 border rounded max-w-2xl">
            <div className="text-sm font-medium mb-2">Generated State:</div>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(currentState, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  },
};

// Composite Operators (AND/OR Groups) Demonstration
export const CompositeOperators: Story = {
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-sm">
          <strong>🧩 Composite Operators Demo:</strong> This example showcases AND/OR groups with nested filters. 
          Build complex queries like: <code>(name = "Smith" OR name = "Jones") AND (age {'>'}= 25 AND status = "active")</code>
        </div>
        
        <QueryBuilder
          metadata={mockMetadataWithCompositeOperators}
          title="Advanced Query Builder with Composite Operators"
          onQueryChange={setCurrentState}
        />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Generated Query Structure</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentState ? JSON.stringify(currentState, null, 2) : 'No query built yet'}
          </pre>
          
          <div className="mt-3 text-sm text-gray-600">
            <p><strong>Try these interactions:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Click the AND/OR button to toggle between logical operators</li>
              <li>Use "+ Add AND Group" to create nested AND conditions</li>
              <li>Use "+ Add OR Group" to create nested OR conditions</li>
              <li>Check "NOT" to negate individual filters or entire groups</li>
              <li>Build complex nested structures up to 5 levels deep</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border rounded p-3">
            <h4 className="font-medium mb-2">🔵 AND Groups (Blue)</h4>
            <p>All conditions must be true. Use for restrictive filtering.</p>
            <code className="text-xs bg-blue-50 p-1 rounded">age {'>'} 25 AND status = "active"</code>
          </div>
          
          <div className="border rounded p-3">
            <h4 className="font-medium mb-2">🟢 OR Groups (Green)</h4>
            <p>Any condition can be true. Use for inclusive filtering.</p>
            <code className="text-xs bg-green-50 p-1 rounded">name = "Smith" OR name = "Jones"</code>
          </div>
        </div>
      </div>
    );
  },
};

// QueryBuilder with direct metadata
export const WithDirectMetadata: Story = {
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>📋 Direct Metadata Mode:</strong> This example uses metadata provided directly to the component, 
          perfect for embedded use cases where metadata is already available.
        </div>
        
        <QueryBuilder
          metadata={mockMetadataWithCompositeOperators}
          title="Query Builder with Direct Metadata"
          onQueryChange={setCurrentState}
        />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Generated State</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentState ? JSON.stringify(currentState, null, 2) : 'No query built yet'}
          </pre>
        </div>
      </div>
    );
  },
};

// QueryBuilder with custom section visibility
export const CustomSectionVisibility: Story = {
  render: () => {
    const [currentState, setCurrentState] = useState<QueryBuilderState | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded text-sm">
          <strong>🎛️ Custom Configuration:</strong> This example shows the flexible section visibility controls.
          Only filters are enabled, hiding field selection and sorting.
        </div>
        
        <QueryBuilder
          metadata={mockMetadataWithCompositeOperators}
          title="Filters Only"
          onQueryChange={setCurrentState}
          showFieldSelection={false}
          showSortRules={false}
          showFilterRules={true}
          className="max-w-4xl"
        />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Filter State Output</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentState ? JSON.stringify(currentState, null, 2) : 'No filters applied yet'}
          </pre>
        </div>
      </div>
    );
  },
}; 