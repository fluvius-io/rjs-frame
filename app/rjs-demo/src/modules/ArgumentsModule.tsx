import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageModule } from 'rjs-frame';
import { useNavigate, useLocation } from 'react-router-dom';
import { pageStore } from 'rjs-frame';
import { buildUrlPath } from '../../../../lib/rjs-frame/src/utils/urlUtils';
import type { SlotParams, PageState } from 'rjs-frame';

export class ArgumentsModule extends PageModule {
  renderContent() {
    return <ArgumentsContent />;
  }
}

interface EditingParam {
  id: string; // Stable ID for React key
  key: string;
  value: string;
}

function ArgumentsContent() {
  const [pageState, setPageState] = useState<PageState>(pageStore.get());
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use stable IDs for React keys to prevent input recreation
  const [editingParams, setEditingParams] = useState<EditingParam[]>([]);
  const nextIdRef = useRef(1);
  const isUpdatingFromUrl = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Subscribe to pageStore manually
  useEffect(() => {
    unsubscribeRef.current = pageStore.subscribe((value) => {
      setPageState(value);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  const { slotParams = {}, name = '' } = pageState || {};

  // Convert slotParams to editing format with stable IDs
  const convertToEditingParams = useCallback((params: SlotParams): EditingParam[] => {
    return Object.entries(params).map(([key, value]) => ({
      id: `param-${nextIdRef.current++}`,
      key,
      value
    }));
  }, []);

  // Sync with URL params only when they actually change from external source
  useEffect(() => {
    if (!isUpdatingFromUrl.current) {
      const newEditingParams = convertToEditingParams(slotParams);
      setEditingParams(newEditingParams);
    }
    isUpdatingFromUrl.current = false;
  }, [slotParams, convertToEditingParams]);

  // Convert editing params back to SlotParams
  const convertToSlotParams = useCallback((params: EditingParam[]): SlotParams => {
    const result: SlotParams = {};
    params.forEach(({ key, value }) => {
      if (key) result[key] = value;
    });
    return result;
  }, []);

  // Convert slotParams object to URL using framework utilities
  const getUrlFromParams = useCallback((params: SlotParams = {}): string => {
    const newUrl = buildUrlPath(name, params) + location.search;
    return newUrl;
  }, [name, location.search]);

  const commitChanges = useCallback((params: EditingParam[]) => {
    const slotParamsToCommit = convertToSlotParams(params);
    const newUrl = getUrlFromParams(slotParamsToCommit);
    isUpdatingFromUrl.current = true;
    navigate(newUrl, { replace: true });
  }, [convertToSlotParams, getUrlFromParams, navigate]);

  const handleAddArgument = useCallback(() => {
    const newParam: EditingParam = {
      id: `param-${nextIdRef.current++}`,
      key: `arg${editingParams.length + 1}`,
      value: `value${editingParams.length + 1}`
    };
    const newParams = [...editingParams, newParam];
    setEditingParams(newParams);
    commitChanges(newParams);
  }, [editingParams, commitChanges]);

  const handleInputChange = useCallback((id: string, field: 'key' | 'value', newValue: string) => {
    setEditingParams(prev => prev.map(param => 
      param.id === id 
        ? { ...param, [field]: newValue }
        : param
    ));
  }, []);

  const handleInputBlur = useCallback(() => {
    // Commit changes when user finishes editing
    commitChanges(editingParams);
  }, [editingParams, commitChanges]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitChanges(editingParams);
    }
  }, [editingParams, commitChanges]);

  const handleRemoveArgument = useCallback((id: string) => {
    const newParams = editingParams.filter(param => param.id !== id);
    setEditingParams(newParams);
    commitChanges(newParams);
  }, [editingParams, commitChanges]);

  return (
    <div className="arguments-module" style={{ padding: '20px', border: '1px solid #eee' }}>
      <h3>URL Arguments Demo</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Current Page: {name}</label>
        </div>
        <p>URL Format: /{name}/argument_name:value/...</p>
        <p>Current Arguments: {Object.entries(slotParams || {}).length ? 
          Object.entries(slotParams || {}).map(([key, value]) => `${key}:${value}`).join(', ') : 
          'none'}</p>
      </div>

      <div className="arguments-list" style={{ marginBottom: '20px' }}>
        {editingParams.map((param) => (
          <div key={param.id} style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <input
              value={param.key}
              onChange={(e) => handleInputChange(param.id, 'key', e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              placeholder="Argument name"
              style={{ width: '150px' }}
            />
            <input
              value={param.value}
              onChange={(e) => handleInputChange(param.id, 'value', e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              placeholder="Value"
              style={{ width: '150px' }}
            />
            <button onClick={() => handleRemoveArgument(param.id)}>Remove</button>
          </div>
        ))}
      </div>

      <button onClick={handleAddArgument}>Add Argument</button>
    </div>
  );
} 