import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import '../../lib/api'; // Import to ensure APIManager is initialized
import type { QueryMetadata } from '../paginate/types';
import QueryBuilder from './QueryBuilder';
import { FrontendQuery } from './types';

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
        component: 'A visual query builder that generates FrontendQuery objects from API metadata. Allows users to build complex queries through a visual interface.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic QueryBuilder with User metadata
export const UsersQuery: Story = {
  render: () => {
    const [currentQuery, setCurrentQuery] = useState<FrontendQuery | null>(null);
    const [executedQuery, setExecutedQuery] = useState<FrontendQuery | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <strong>🔧 Visual Query Builder:</strong> This example fetches user metadata from your backend server and provides a visual interface to build queries. 
          Make sure your server is running on <code>http://localhost:8000</code>.
        </div>
        
        <QueryBuilder
          metadataApi="idm:user"
          title="User Query Builder"
          onQueryChange={setCurrentQuery}
          onExecute={setExecutedQuery}
        />

        {/* Display current and executed queries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Current Query</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              {currentQuery ? JSON.stringify(currentQuery, null, 2) : 'No query built yet'}
            </pre>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Last Executed Query</h3>
            <pre className="text-xs bg-green-100 p-2 rounded overflow-x-auto">
              {executedQuery ? JSON.stringify(executedQuery, null, 2) : 'No query executed yet'}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

// QueryBuilder with Organization metadata
export const OrganizationsQuery: Story = {
  render: () => {
    const [currentQuery, setCurrentQuery] = useState<FrontendQuery | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-purple-50 border border-purple-200 rounded text-sm">
          <strong>🏢 Organization Query Builder:</strong> Build queries for organization data using the organization metadata endpoint.
        </div>
        
        <QueryBuilder
          metadataApi="idm:organization"
          title="Build Organization Query"
          onQueryChange={setCurrentQuery}
        />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Generated Query</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentQuery ? JSON.stringify(currentQuery, null, 2) : 'No query built yet'}
          </pre>
        </div>
      </div>
    );
  },
};

// QueryBuilder with initial query
export const WithInitialQuery: Story = {
  render: () => {
    const initialQuery: Partial<FrontendQuery> = {
      limit: 25,
      page: 1,
      select: ['_id', 'name__family', 'name__given', 'email'],
      sort: ['name__family:asc', 'name__given:asc'],
      query: 'name__family:ilike:Smith'
    };

    const [currentQuery, setCurrentQuery] = useState<FrontendQuery | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-orange-50 border border-orange-200 rounded text-sm">
          <strong>⚡ Pre-configured Query:</strong> This example starts with a predefined query that selects specific fields, sorts by name, and filters for family names containing "Smith".
        </div>
        
        <QueryBuilder
          metadataApi="idm:user"
          title="Pre-configured User Query"
          initialQuery={initialQuery}
          onQueryChange={setCurrentQuery}
        />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Current Query State</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentQuery ? JSON.stringify(currentQuery, null, 2) : JSON.stringify(initialQuery, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

// Compact QueryBuilder
export const CompactMode: Story = {
  render: () => {
    const [currentQuery, setCurrentQuery] = useState<FrontendQuery | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <strong>📱 Compact Mode:</strong> A more compact query builder suitable for smaller spaces or embedded use.
        </div>
        
        <div className="max-w-4xl">
          <QueryBuilder
            metadataApi="idm:user"
            title="Compact User Query Builder"
            onQueryChange={setCurrentQuery}
            className="max-w-none"
          />
        </div>

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Query Output</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentQuery ? JSON.stringify(currentQuery, null, 2) : 'Build a query above'}
          </pre>
        </div>
      </div>
    );
  },
};

// QueryBuilder integrated with live data execution
export const WithLiveDataExecution: Story = {
  render: () => {
    const [currentQuery, setCurrentQuery] = useState<FrontendQuery | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const executeQuery = async (query: FrontendQuery) => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: query.page.toString(),
          limit: query.limit.toString(),
        });

        if (query.select?.length) {
          params.set('select', query.select.join(','));
        }
        if (query.sort?.length) {
          params.set('sort', query.sort.join(','));
        }
        if (query.query) {
          params.set('query', query.query);
        }

        const response = await fetch(`/api/idm.user/?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
          <strong>🚀 Live Data Execution:</strong> Build a query and execute it against real data. The results will be displayed below.
        </div>
        
        <QueryBuilder
          metadataApi="idm:user"
          title="Query Builder with Live Execution"
          onQueryChange={setCurrentQuery}
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
    const simpleQuery: Partial<FrontendQuery> = {
      limit: 10,
      page: 1,
    };

    const [currentQuery, setCurrentQuery] = useState<FrontendQuery | null>(null);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <strong>🎯 Field Selection Focus:</strong> A simplified example focusing on field selection. 
          Perfect for scenarios where you just need to control which fields are returned.
        </div>
        
        <QueryBuilder
          metadataApi="idm:user"
          title="Field Selection Query Builder"
          initialQuery={simpleQuery}
          onQueryChange={setCurrentQuery}
        />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Field Selection Query</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentQuery ? JSON.stringify(currentQuery, null, 2) : 'Select fields above'}
          </pre>
          
          {currentQuery?.select && currentQuery.select.length > 0 && (
            <div className="mt-3 p-2 bg-green-50 rounded text-sm">
              <strong>Selected Fields:</strong> Only these fields will be returned: {currentQuery.select.join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  },
};

// Composite Operators (AND/OR Groups) Demonstration
export const CompositeOperators: Story = {
  render: () => {
    const [currentQuery, setCurrentQuery] = useState<FrontendQuery | null>(null);

    // Mock the APIManager for this demo
    useEffect(() => {
      const originalQueryMeta = (window as any).APIManager?.queryMeta;
      
      // Mock the queryMeta call for composite operators demo
      if ((window as any).APIManager) {
        (window as any).APIManager.queryMeta = async (apiName: string) => {
          if (apiName === 'demo:composite') {
            return { data: mockMetadataWithCompositeOperators };
          }
          return originalQueryMeta ? originalQueryMeta(apiName) : Promise.reject('API not found');
        };
      }

      return () => {
        if ((window as any).APIManager && originalQueryMeta) {
          (window as any).APIManager.queryMeta = originalQueryMeta;
        }
      };
    }, []);

    return (
      <div className="space-y-6">
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-sm">
          <strong>🧩 Composite Operators Demo:</strong> This example showcases AND/OR groups with nested filters. 
          Build complex queries like: <code>(name = "Smith" OR name = "Jones") AND (age {'>'}= 25 AND status = "active")</code>
        </div>
        
        <QueryBuilder
          metadataApi="demo:composite"
          title="Advanced Query Builder with Composite Operators"
          onQueryChange={setCurrentQuery}
        />

        <div className="border rounded p-4">
          <h3 className="font-medium mb-2">Generated Query Structure</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {currentQuery ? JSON.stringify(currentQuery, null, 2) : 'No query built yet'}
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