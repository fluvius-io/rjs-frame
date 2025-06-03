import React, { useState } from 'react';
import { APIManager, ApiManagerConfig } from '../lib/rjs-frame/src/api';

// Test API configuration for React testing
const testApiConfig: ApiManagerConfig = {
  name: 'ReactTestAPI',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  
  commands: {
    createPost: {
      uri: '/posts',
      data: (postData: { title: string; body: string; userId: number }) => ({
        ...postData,
        created_at: new Date().toISOString()
      }),
      resp: (response: any) => ({
        id: response.id,
        title: response.title,
        created: true
      })
    }
  },
  
  queries: {
    getPosts: {
      uri: '/posts',
      resp: (response: any) => response.slice(0, 5) // Limit to 5 posts
    },
    
    getPost: {
      uri: (config: any, params?: any) => `/posts/${params?.postId}`,
      resp: (response: any) => ({
        id: response.id,
        title: response.title,
        body: response.body,
        wordCount: response.body.split(' ').length
      })
    }
  },
  
  requests: {
    deletePost: {
      method: 'DELETE',
      uri: (config: any, params?: any) => `/posts/${params?.postId}`,
      resp: () => ({ 
        deleted: true, 
        deletedAt: new Date().toISOString() 
      })
    }
  }
};

interface TestLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export const APIManagerReactTest: React.FC = () => {
  const [api] = useState(() => new APIManager(testApiConfig));
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string, type: TestLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  const testCreatePost = async () => {
    setLoading(true);
    try {
      addLog('📝 Creating a new post...', 'info');
      const result = await api.send('createPost', {
        title: 'React Test Post',
        body: 'This post was created using APIManager in a React component!',
        userId: 1
      });
      addLog(`✅ Post created successfully: ID ${result.data.id}`, 'success');
    } catch (error) {
      addLog(`❌ Create post failed: ${error}`, 'error');
    }
    setLoading(false);
  };

  const testGetPosts = async () => {
    setLoading(true);
    try {
      addLog('📖 Fetching posts list...', 'info');
      const result = await api.query('getPosts');
      addLog(`✅ Retrieved ${result.data.length} posts`, 'success');
      addLog(`📄 First post: "${result.data[0]?.title?.substring(0, 40)}..."`, 'info');
    } catch (error) {
      addLog(`❌ Get posts failed: ${error}`, 'error');
    }
    setLoading(false);
  };

  const testGetSpecificPost = async () => {
    setLoading(true);
    try {
      addLog('🔍 Fetching specific post (ID: 1)...', 'info');
      const result = await api.query('getPost', { postId: 1 });
      addLog(`✅ Post retrieved: ${result.data.wordCount} words`, 'success');
      addLog(`📝 Title: "${result.data.title?.substring(0, 40)}..."`, 'info');
    } catch (error) {
      addLog(`❌ Get specific post failed: ${error}`, 'error');
    }
    setLoading(false);
  };

  const testDeletePost = async () => {
    setLoading(true);
    try {
      addLog('🗑️ Deleting post (ID: 1)...', 'info');
      const result = await api.request('deletePost', undefined, { postId: 1 });
      addLog(`✅ Post deleted at ${result.data.deletedAt}`, 'success');
    } catch (error) {
      addLog(`❌ Delete post failed: ${error}`, 'error');
    }
    setLoading(false);
  };

  const clearLogs = () => setLogs([]);

  const runAllTests = async () => {
    setLoading(true);
    addLog('🚀 Running all APIManager tests...', 'info');
    
    await testCreatePost();
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    
    await testGetPosts();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testGetSpecificPost();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testDeletePost();
    
    addLog('🎉 All tests completed!', 'success');
    setLoading(false);
  };

  const getLogColor = (type: TestLog['type']) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>
        🧪 APIManager React Test Suite
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Test the APIManager TypeScript implementation with real API calls in React.
      </p>
      
      {/* Test Controls */}
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        gap: '10px', 
        flexWrap: 'wrap' 
      }}>
        <button 
          onClick={testCreatePost} 
          disabled={loading}
          style={{
            padding: '10px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          📝 Create Post
        </button>
        
        <button 
          onClick={testGetPosts} 
          disabled={loading}
          style={{
            padding: '10px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          📖 Get Posts
        </button>
        
        <button 
          onClick={testGetSpecificPost} 
          disabled={loading}
          style={{
            padding: '10px 16px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          🔍 Get Post #1
        </button>
        
        <button 
          onClick={testDeletePost} 
          disabled={loading}
          style={{
            padding: '10px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          🗑️ Delete Post
        </button>
        
        <button 
          onClick={runAllTests} 
          disabled={loading}
          style={{
            padding: '10px 16px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            fontWeight: 'bold'
          }}
        >
          🚀 Run All Tests
        </button>
        
        <button 
          onClick={clearLogs}
          style={{
            padding: '10px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🗑️ Clear Logs
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b',
          borderRadius: '6px',
          marginBottom: '20px',
          color: '#92400e'
        }}>
          ⏳ Running tests...
        </div>
      )}

      {/* Test Logs */}
      <div style={{
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        height: '400px',
        overflowY: 'auto'
      }}>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#374151',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Test Logs
        </h3>
        
        {logs.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>
            Click a test button to start testing the APIManager...
          </p>
        ) : (
          logs.map((log, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '8px',
                fontSize: '14px',
                fontFamily: 'ui-monospace, SFMono-Regular, monospace'
              }}
            >
              <span style={{ color: '#6b7280' }}>[{log.timestamp}]</span>
              {' '}
              <span style={{ color: getLogColor(log.type) }}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* API Configuration Info */}
      <details style={{ marginTop: '20px' }}>
        <summary style={{ 
          cursor: 'pointer', 
          fontWeight: '600',
          color: '#374151',
          marginBottom: '10px'
        }}>
          📋 View API Configuration
        </summary>
        <pre style={{ 
          fontSize: '12px', 
          backgroundColor: '#f3f4f6',
          padding: '12px',
          borderRadius: '6px',
          overflow: 'auto',
          color: '#374151'
        }}>
          {JSON.stringify(testApiConfig, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default APIManagerReactTest; 