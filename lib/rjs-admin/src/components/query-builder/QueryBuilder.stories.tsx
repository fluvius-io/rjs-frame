import type { Meta, StoryObj } from '@storybook/react';
import QueryBuilder from './QueryBuilder';
import { FrontendQuery } from './types';
import { Button } from '../common/Button';
import React, { useState } from 'react';

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
          metadataUrl="/api/_info/idm.user"
          title="Build User Query"
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
          metadataUrl="/api/_info/idm.organization/"
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
          metadataUrl="/api/_info/idm.user"
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
            metadataUrl="/api/_info/idm.user"
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
        if (query.deselect?.length) {
          params.set('deselect', query.deselect.join(','));
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
          metadataUrl="/api/_info/idm.user"
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
          <strong>🎯 Field Selection Focus:</strong> A simplified example focusing mainly on field selection (include/exclude). 
          Perfect for scenarios where you just need to control which fields are returned.
        </div>
        
        <QueryBuilder
          metadataUrl="/api/_info/idm.user"
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
          
          {currentQuery?.deselect && currentQuery.deselect.length > 0 && (
            <div className="mt-3 p-2 bg-red-50 rounded text-sm">
              <strong>Excluded Fields:</strong> These fields will be hidden: {currentQuery.deselect.join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  },
}; 