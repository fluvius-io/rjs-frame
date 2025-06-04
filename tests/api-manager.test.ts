#!/usr/bin/env node

/**
 * Comprehensive APIManager Test Suite
 * Tests all major functionality of the APIManager with real API calls
 */

import { APICollection, APIManager, ApiCollectionConfig } from '../lib/rjs-frame/src/api';

console.log('🧪 Testing APIManager (TypeScript)...\n');

// Test configuration that mimics a real-world API setup
const testConfig: ApiCollectionConfig = {
  name: 'jsonplaceholder-test',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  debug: true,
  
  commands: {
    createPost: {
      uri: '/posts',
      data: (postData: { title: string; body: string; userId: number }) => ({
        ...postData,
        createdAt: new Date().toISOString(),
        status: 'published'
      }),
      response: (response: any) => ({
        id: response.id,
        title: response.title,
        created: true,
        url: `https://jsonplaceholder.typicode.com/posts/${response.id}`
      }),
      headers: {
        'X-Test-Source': 'APIManager-TypeScript-Test',
        'X-API-Version': '1.0'
      }
    },
    
    updatePost: {
      uri: (params) => `/posts/${params?.postId}`,
      data: (postData: { title?: string; body?: string }) => ({
        ...postData,
        updated_at: new Date().toISOString()
      }),
      headers: (params) => ({
        'Authorization': `Bearer ${params?.token || 'test-token'}`,
        'X-Update-Source': 'APIManager'
      })
    }
  },
  
  queries: {
    getPosts: {
      uri: '/posts',
      response: (response: any[]) => ({
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
      uri: (params) => `/posts/${params?.postId}`,
      response: (response: any) => ({
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
      response: (response: any[]) => response.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        website: user.website
      }))
    }
  },
  
  requests: {
    deletePost: {
      method: 'DELETE',
      uri: (params) => `/posts/${params?.postId}`,
      response: () => ({ 
        deleted: true, 
        deletedAt: new Date().toISOString() 
      }),
      headers: {
        'X-Delete-Reason': 'Test cleanup'
      }
    },
    
    patchPost: {
      method: 'PATCH',
      uri: (params) => `/posts/${params?.postId}`,
      data: (patchData: Record<string, any>) => {
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

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
  data?: any;
}

class APITester {
  private collection: APICollection;
  private results: TestResult[] = [];

  constructor(config: ApiCollectionConfig) {
    this.collection = APIManager.register(config);
  }

  private async runTest(name: string, testFn: () => Promise<any>): Promise<void> {
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

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting comprehensive APIManager tests...\n');
    console.log(`📊 API: ${this.collection.getName()} - ${this.collection.getBaseUrl()}`);

    // Test Commands
    await this.runTest('Create Post Command', async () => {
      const result = await APIManager.send('jsonplaceholder-test:createPost', {
        title: 'APIManager Test Post',
        body: 'This post was created by the APIManager TypeScript test suite to verify command functionality.',
        userId: 1
      });
      return result.data;
    });

    await this.runTest('Update Post Command', async () => {
      const result = await APIManager.send('jsonplaceholder-test:updatePost', {
        title: 'Updated Test Post'
      }, { postId: 1, token: 'test-auth-token' });
      return result.data;
    });

    // Test Queries
    await this.runTest('Get Posts Query', async () => {
      const result = await APIManager.query('jsonplaceholder-test:getPosts');
      return result.data;
    });

    await this.runTest('Get Specific Post Query', async () => {
      const result = await APIManager.query('jsonplaceholder-test:getPost', { postId: 1 });
      return result.data;
    });

    await this.runTest('Get Users with Metadata', async () => {
      const [users, metadata] = await Promise.all([
        APIManager.query('jsonplaceholder-test:getUsers'),
        this.collection.getQueryMetadata('getUsers')
      ]);
      return { users: users.data, metadata: metadata.data };
    });

    // Test Requests
    await this.runTest('PATCH Request', async () => {
      const result = await APIManager.request('jsonplaceholder-test:patchPost', {
        title: 'Patched Title'
      }, { postId: 1 });
      return result.data;
    });

    await this.runTest('DELETE Request', async () => {
      const result = await APIManager.request('jsonplaceholder-test:deletePost', undefined, { postId: 1 });
      return result.data;
    });

    // Test Error Handling
    await this.runTest('Error Handling - Invalid Command', async () => {
      try {
        await APIManager.send('jsonplaceholder-test:nonexistentCommand', {});
        throw new Error('Should have thrown an error');
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return { errorHandled: true, message: error.message };
        }
        throw error;
      }
    });

    await this.runTest('Error Handling - Data Validation', async () => {
      try {
        await APIManager.send('jsonplaceholder-test:createPost', {
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

    this.printSummary();
  }

  private printSummary(): void {
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

    console.log('\n🎉 APIManager TypeScript test completed!');
    
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
  const tester = new APITester(testConfig);
  await tester.runAllTests();
}

main().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
}); 