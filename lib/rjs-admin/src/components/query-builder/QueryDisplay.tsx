import React, { useState } from 'react';
import { Button } from '../common/Button';
import { QueryDisplayProps } from './types';

const QueryDisplay: React.FC<QueryDisplayProps> = ({
  query,
  onQueryChange,
}) => {
  const [showRawQuery, setShowRawQuery] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedQuery, setEditedQuery] = useState(JSON.stringify(query, null, 2));

  const handleEditSave = () => {
    try {
      const parsedQuery = JSON.parse(editedQuery);
      onQueryChange?.(parsedQuery);
      setEditMode(false);
    } catch (error) {
      alert('Invalid JSON format');
    }
  };

  const handleEditCancel = () => {
    setEditedQuery(JSON.stringify(query, null, 2));
    setEditMode(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(query, null, 2));
  };

  const hasContent = Object.keys(query).some(key => {
    const value = query[key as keyof typeof query];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Generated Query</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRawQuery(!showRawQuery)}
          >
            {showRawQuery ? 'Hide' : 'Show'} Raw Query
          </Button>
          {onQueryChange && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel Edit' : 'Edit JSON'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </div>

      {!hasContent && (
        <div className="text-sm text-gray-500 italic p-4 border rounded bg-gray-50">
          No query parameters specified. Default values will be used.
        </div>
      )}

      {hasContent && (
        <div className="space-y-4">
          {/* Human-readable summary */}
          <div className="border rounded p-4 bg-blue-50">
            <h4 className="text-sm font-medium mb-2">Query Summary</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Page:</span>{' '}
                <span className="font-mono">{query.page}</span>
                <span className="text-gray-600 mx-2">•</span>
                <span className="text-gray-600">Limit:</span>{' '}
                <span className="font-mono">{query.limit}</span>
              </div>
              
              {query.select && query.select.length > 0 && (
                <div>
                  <span className="text-green-700 font-medium">Include Fields:</span>{' '}
                  <span className="font-mono text-green-800">{query.select.join(', ')}</span>
                </div>
              )}
              
              {query.sort && query.sort.length > 0 && (
                <div>
                  <span className="text-blue-700 font-medium">Sort Order:</span>{' '}
                  <span className="font-mono text-blue-800">{query.sort.join(' → ')}</span>
                </div>
              )}
              
              {query.query && (
                <div>
                  <span className="text-purple-700 font-medium">Filters:</span>{' '}
                  <span className="font-mono text-purple-800">{query.query}</span>
                </div>
              )}
            </div>
          </div>

          {/* Raw JSON display/edit */}
          {showRawQuery && (
            <div className="border rounded p-4">
              <h4 className="text-sm font-medium mb-2">Raw JSON Query</h4>
              {editMode ? (
                <div className="space-y-2">
                  <textarea
                    value={editedQuery}
                    onChange={(e) => setEditedQuery(e.target.value)}
                    className="w-full h-48 font-mono text-sm border rounded p-2 bg-white"
                    spellCheck={false}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleEditSave}>
                      Save Changes
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleEditCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <pre className="bg-gray-100 p-3 rounded text-xs font-mono overflow-x-auto">
                  {JSON.stringify(query, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QueryDisplay; 