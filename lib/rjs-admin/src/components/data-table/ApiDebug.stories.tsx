import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { API_BASE_URL, createApiUrl, endpoints, fetchJson } from '../../lib/api';
import { Button } from '../common/Button';

const meta: Meta = {
  title: 'Debug/API Proxy Test',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Debug component to test API proxy configuration and identify any issues with direct localhost:8000 calls.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ApiDebugComponent: React.FC = () => {
  const [results, setResults] = useState<Array<{ test: string; status: string; details: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, status: string, details: any) => {
    setResults(prev => [...prev, { test, status, details }]);
  };

  const runApiTests = async () => {
    setIsLoading(true);
    setResults([]);

    // Test 1: API Base URL Detection
    addResult('API Base URL', 'info', API_BASE_URL);

    // Test 2: URL Creation
    const testUrl = createApiUrl('_meta/idm.user');
    addResult('URL Creation', 'info', `_meta/idm.user → ${testUrl}`);

    // Test 3: Fetch User Metadata (using /api proxy)
    try {
      console.log('🧪 Debug: Testing user metadata fetch...');
      const userMetadata = await fetchJson(endpoints.userMetadata());
      addResult('User Metadata (/api proxy)', 'success', `Received ${Object.keys(userMetadata).length} properties`);
    } catch (error) {
      addResult('User Metadata (/api proxy)', 'error', error instanceof Error ? error.message : 'Unknown error');
    }

    // Test 4: Direct localhost:8000 call (should fail or be blocked)
    try {
      console.log('🧪 Debug: Testing direct localhost:8000 call...');
      const response = await fetch('http://localhost:8000/_meta/idm.user');
      if (response.ok) {
        await response.json();
        addResult('Direct localhost:8000', 'warning', 'Direct call succeeded - this might cause issues in Storybook');
      } else {
        addResult('Direct localhost:8000', 'expected', `Failed as expected: ${response.status}`);
      }
    } catch (error) {
      addResult('Direct localhost:8000', 'expected', 'Failed as expected - CORS or network error');
    }

    // Test 5: Test Organization Metadata
    try {
      console.log('🧪 Debug: Testing organization metadata fetch...');
      const orgMetadata = await fetchJson(endpoints.organizationMetadata());
      addResult('Organization Metadata (/api proxy)', 'success', `Received ${Object.keys(orgMetadata).length} properties`);
    } catch (error) {
      addResult('Organization Metadata (/api proxy)', 'error', error instanceof Error ? error.message : 'Unknown error');
    }

    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'expected': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">🔍 API Proxy Debug Tool</h3>
        <p className="text-blue-800 text-sm">
          This tool tests the API proxy configuration to ensure all requests go through <code>/api</code> 
          instead of directly to <code>localhost:8000</code>. Make sure your backend server is running on port 8000.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">Test Results</h4>
        <Button onClick={runApiTests} disabled={isLoading}>
          {isLoading ? 'Running Tests...' : 'Run API Tests'}
        </Button>
      </div>

      <div className="space-y-2">
        {results.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            Click "Run API Tests" to start debugging
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Running tests...
            </div>
          </div>
        )}

        {results.map((result, index) => (
          <div key={index} className={`p-3 rounded border ${getStatusColor(result.status)}`}>
            <div className="flex items-center justify-between">
              <strong>{result.test}</strong>
              <span className="text-xs uppercase tracking-wider font-medium">{result.status}</span>
            </div>
            <pre className="text-xs mt-1 overflow-x-auto">
              {typeof result.details === 'string' ? result.details : JSON.stringify(result.details, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border rounded">
        <h4 className="font-medium mb-2">Environment Info</h4>
        <div className="text-sm space-y-1">
          <div><strong>Window Location:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</div>
          <div><strong>Port:</strong> {typeof window !== 'undefined' ? window.location.port : 'N/A'}</div>
          <div><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</div>
          <div><strong>API Base URL:</strong> <code>{API_BASE_URL}</code></div>
        </div>
      </div>
    </div>
  );
};

export const ProxyDebugTest: Story = {
  render: () => <ApiDebugComponent />,
}; 