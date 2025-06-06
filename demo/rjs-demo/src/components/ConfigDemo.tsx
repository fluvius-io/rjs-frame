import React, { useState } from 'react';
import { api, app, appConfig, features } from '../config';
import { apiManager } from '../config/api';

const ConfigDemo: React.FC = () => {
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testApiCall = async () => {
    setIsLoading(true);
    try {
      const result = await apiManager.query('getUsers');
      setApiTestResult(result.data);
    } catch (error) {
      setApiTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  const testApiMeta = async () => {
    setIsLoading(true);
    try {
      const result = await apiManager.queryMeta('getUsers');
      setApiTestResult(result.data);
    } catch (error) {
      setApiTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🔧 Browser-Compatible Configuration System</h3>
      
      <div style={{ 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e8',
        border: '1px solid #28a745',
        borderRadius: '4px'
      }}>
        <h4>✅ Successfully Migrated from Node-Config!</h4>
        <p>This application now uses a <strong>browser-compatible configuration system</strong> that:</p>
        <ul style={{ marginBottom: 0 }}>
          <li>Works in all modern browsers (no Node.js dependencies)</li>
          <li>Uses Vite's environment variable system</li>
          <li>Provides full TypeScript support</li>
          <li>Supports environment-specific configurations</li>
        </ul>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Current Environment: <span style={{ color: '#007bff' }}>{appConfig.environment}</span></h4>
        <p>Configuration loaded with <strong>TypeScript-based environment detection</strong></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <h4>App Configuration</h4>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {JSON.stringify(app, null, 2)}
          </pre>
        </div>

        <div>
          <h4>API Configuration</h4>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {JSON.stringify(api, null, 2)}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Feature Flags</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.entries(features).map(([key, value]) => (
            <span 
              key={key}
              style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                backgroundColor: value ? '#d4edda' : '#f8d7da',
                color: value ? '#155724' : '#721c24',
                border: `1px solid ${value ? '#c3e6cb' : '#f5c6cb'}`
              }}
            >
              {key}: {value ? '✅' : '❌'}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Environment Variables</h4>
        <p>The system supports Vite environment variables for runtime configuration:</p>
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div>VITE_API_BASE_URL: <span style={{ color: '#007bff' }}>{import.meta.env.VITE_API_BASE_URL || 'not set'}</span></div>
          <div>VITE_API_DEBUG: <span style={{ color: '#007bff' }}>{import.meta.env.VITE_API_DEBUG || 'not set'}</span></div>
          <div>VITE_DEBUG_MODE: <span style={{ color: '#007bff' }}>{import.meta.env.VITE_DEBUG_MODE || 'not set'}</span></div>
          <div>VITE_XRAY_MODE: <span style={{ color: '#007bff' }}>{import.meta.env.VITE_XRAY_MODE || 'not set'}</span></div>
        </div>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Create <code>.env.local</code> to override these values for local development
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>API Manager Integration</h4>
        <p>The API Manager is configured using our browser-compatible configuration:</p>
        <ul>
          <li>Base URL: <code>{api.baseUrl}</code></li>
          <li>Debug Mode: <code>{api.debug ? 'Enabled' : 'Disabled'}</code></li>
          <li>Timeout: <code>{api.timeout}ms</code></li>
          <li>Retries: <code>{api.retries}</code></li>
        </ul>
        
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={testApiCall}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Loading...' : 'Test API Query'}
          </button>
          
          <button 
            onClick={testApiMeta}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Loading...' : 'Test API Meta (Cached)'}
          </button>
        </div>

        {apiTestResult && (
          <div style={{ 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <h5>API Test Result:</h5>
            <pre style={{ fontSize: '11px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(apiTestResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ 
        padding: '15px',
        backgroundColor: '#e3f2fd',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>🚀 Configuration Setup Complete!</strong>
        <div style={{ marginTop: '10px' }}>
          <h5>Available Commands:</h5>
          <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '12px', fontFamily: 'monospace' }}>
            <li><code>npm run dev</code> - Development mode</li>
            <li><code>npm run dev:prod</code> - Production mode in dev</li>
            <li><code>npm run dev:test</code> - Test mode in dev</li>
            <li><code>npm run build</code> - Production build</li>
          </ul>
          
          <h5>Environment Variables:</h5>
          <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '12px' }}>
            <li>Create <code>.env.local</code> for local overrides</li>
            <li>Use <code>VITE_*</code> prefix for environment variables</li>
            <li>TypeScript support in <code>vite-env.d.ts</code></li>
            <li>Full documentation in <code>CONFIG.md</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfigDemo; 