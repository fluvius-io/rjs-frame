#!/usr/bin/env node

/**
 * APIManager Comprehensive JavaScript Test
 * Tests the actual APIManager implementation with all features
 */

import { APIManager } from '../lib/rjs-frame/dist/index.es.js';

console.log('🧪 Testing APIManager (JavaScript ES Module)...\n');

// Test API configuration with full features
const testApiConfig = {
  name: 'TestAPI',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  debug: false,  // Set to true to enable debug logging
  
  commands: {
    createPost: {
      uri: '/posts',
      data: (postData) => {
        // Validation
        if (!postData.title || !postData.body) {
          throw new Error('Title and body are required');
        }
        
        // Data processing
        return {
          ...postData,
          created_at: new Date().toISOString(),
          slug: postData.title.toLowerCase().replace(/\s+/g, '-')
        };
      },
      resp: (response) => ({
        id: response.id,
        title: response.title,
        created: true,
        url: `https://jsonplaceholder.typicode.com/posts/${response.id}`
      }),
      header: {
        'X-Test-Source': 'APIManager-JavaScript-Test',
        'X-API-Version': '1.0'
      }
    }
  },
  
  queries: {
    getPosts: {
      uri: '/posts',
      resp: (response) => ({
        posts: response.slice(0, 5).map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.body.substring(0, 100) + '...',
          wordCount: post.body.split(' ').length
        })),
        totalShown: Math.min(5, response.length),
        totalAvailable: response.length
      })
    },
    
    getPost: {
      uri: (config, params) => `https://jsonplaceholder.typicode.com/posts/${params?.postId}`,
      resp: (response) => ({
        id: response.id,
        title: response.title,
        body: response.body,
        wordCount: response.body.split(' ').length,
        userId: response.userId,
        fetchedAt: new Date().toISOString()
      })
    },
    
    getUsers: {
      uri: '/users',
      meta: '/users',  // Same endpoint for simplicity
      resp: (response) => response.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        website: user.website
      }))
    }
  },
  
  requests: {
    updatePost: {
      method: 'PUT',
      uri: (config, params) => `https://jsonplaceholder.typicode.com/posts/${params?.postId}`,
      data: (postData) => ({
        ...postData,
        updated_at: new Date().toISOString()
      }),
      header: (params) => ({
        'Authorization': `Bearer ${params?.token || 'test-token'}`,
        'X-Update-Source': 'APIManager'
      })
    },
    
    deletePost: {
      method: 'DELETE',
      uri: (config, params) => `https://jsonplaceholder.typicode.com/posts/${params?.postId}`,
      resp: () => ({ 
        deleted: true, 
        deletedAt: new Date().toISOString() 
      }),
      header: {
        'X-Delete-Reason': 'Test cleanup'
      }
    },
    
    patchPost: {
      method: 'PATCH',
      uri: (config, params) => `https://jsonplaceholder.typicode.com/posts/${params?.postId}`,
      data: (patchData) => {
        // Validation for PATCH
        if (Object.keys(patchData).length === 0) {
          throw new Error('PATCH requires at least one field to update');
        }
        return {
          ...patchData,
          patched_at: new Date().toISOString()
        };
      }
    }
  }
};

class APITester {
  constructor(config) {
    this.api = new APIManager(config);
    this.results = [];
  }

  async runTest(name, testFn) {
    const start = Date.now();
    console.log(`\n🧪 ${name}...`);
    
    try {
      const result = await testFn();
      const duration = Date.now() - start;
      
      this.results.push({
        name,
        success: true,
        duration,
        data: result
      });
      
      console.log(`✅ ${name} completed (${duration}ms)`);
      if (result && typeof result === 'object') {
        console.log(`   Result:`, JSON.stringify(result, null, 2).substring(0, 200) + '...');
      }
    } catch (error) {
      const duration = Date.now() - start;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      this.results.push({
        name,
        success: false,
        duration,
        error: errorMessage
      });
      
      console.log(`❌ ${name} failed (${duration}ms): ${errorMessage}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive APIManager tests...\n');
    console.log(`📊 API: ${this.api.getName()} - ${this.api.getBaseUrl()}`);

    // Test Commands
    await this.runTest('Create Post Command', async () => {
      const result = await this.api.send('createPost', {
        title: 'APIManager Test Post',
        body: 'This post was created by the APIManager JavaScript test suite to verify command functionality.',
        userId: 1
      });
      return result.data;
    });

    await this.runTest('Update Post Command', async () => {
      const result = await this.api.request('updatePost', {
        title: 'Updated Test Post'
      }, { postId: 1, token: 'test-auth-token' });
      return result.data;
    });

    // Test Queries
    await this.runTest('Get Posts Query', async () => {
      const result = await this.api.query('getPosts');
      return result.data;
    });

    await this.runTest('Get Specific Post Query', async () => {
      const result = await this.api.query('getPost', { postId: 1 });
      return result.data;
    });

    await this.runTest('Get Users with Metadata', async () => {
      const [users, metadata] = await Promise.all([
        this.api.query('getUsers'),
        this.api.getQueryMetadata('getUsers')
      ]);
      return { users: users.data, metadata: metadata.data };
    });

    // Test queryMeta caching
    await this.runTest('Query Metadata with Caching - First Call', async () => {
      const result = await this.api.queryMeta('getUsers');
      return { 
        data: result.data, 
        statusText: result.statusText,
        cacheStats: this.api.getMetadataCacheStats()
      };
    });

    await this.runTest('Query Metadata with Caching - Cached Call', async () => {
      const result = await this.api.queryMeta('getUsers');
      return { 
        data: result.data, 
        statusText: result.statusText,
        cacheStats: this.api.getMetadataCacheStats()
      };
    });

    await this.runTest('Query Metadata with Parameters - First Call', async () => {
      const result = await this.api.queryMeta('getUsers', { userId: 1 });
      return { 
        data: result.data, 
        statusText: result.statusText,
        cacheStats: this.api.getMetadataCacheStats()
      };
    });

    await this.runTest('Query Metadata with Parameters - Cached Call', async () => {
      const result = await this.api.queryMeta('getUsers', { userId: 1 });
      return { 
        data: result.data, 
        statusText: result.statusText,
        cacheStats: this.api.getMetadataCacheStats()
      };
    });

    // Test Requests
    await this.runTest('PATCH Request', async () => {
      const result = await this.api.request('patchPost', {
        title: 'Patched Title'
      }, { postId: 1 });
      return result.data;
    });

    await this.runTest('DELETE Request', async () => {
      const result = await this.api.request('deletePost', undefined, { postId: 1 });
      return result.data;
    });

    // Test Error Handling
    await this.runTest('Error Handling - Invalid Command', async () => {
      try {
        await this.api.send('nonexistentCommand', {});
        throw new Error('Should have thrown an error');
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return { errorHandled: true, errorType: 'ConfigurationError' };
        }
        throw error;
      }
    });

    await this.runTest('Error Handling - Data Validation', async () => {
      try {
        await this.api.send('createPost', {
          title: '',  // Invalid: empty title
          body: '',   // Invalid: empty body
          userId: 1
        });
        throw new Error('Should have thrown a validation error');
      } catch (error) {
        if (error instanceof Error && error.message.includes('required')) {
          return { errorHandled: true, errorType: 'ValidationError' };
        }
        throw error;
      }
    });

    // Test cache clearing
    await this.runTest('Clear Metadata Cache', async () => {
      const statsBefore = this.api.getMetadataCacheStats();
      this.api.clearMetadataCache();
      const statsAfter = this.api.getMetadataCacheStats();
      
      return { 
        statsBefore, 
        statsAfter,
        cacheCleared: statsBefore.size > 0 && statsAfter.size === 0
      };
    });

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Summary');
    console.log('='.repeat(60));

    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Total time: ${totalTime}ms`);
    console.log(`📈 Success rate: ${Math.round((passed / this.results.length) * 100)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }

    console.log('\n🎉 APIManager JavaScript test completed!');
    
    if (failed === 0) {
      console.log('🚀 All tests passed! The APIManager is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.');
      process.exit(1);
    }
  }
}

// Run the tests
async function main() {
  const tester = new APITester(testApiConfig);
  await tester.runAllTests();
}

main().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
}); 