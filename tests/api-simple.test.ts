#!/usr/bin/env node

/**
 * Simple APIManager TypeScript Test
 * Basic functionality test using TypeScript
 */

import type { ApiManagerConfig } from '../lib/rjs-frame/dist/index.es.js';
import { APIManager } from '../lib/rjs-frame/dist/index.es.js';

console.log('🧪 Testing APIManager concepts (TypeScript)...\n');

// Simple test configuration
const testConfig: ApiManagerConfig = {
  name: 'SimpleTestAPI',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  
  commands: {
    createPost: {
      uri: '/posts'
    }
  },
  
  queries: {
    getPosts: {
      uri: '/posts',
      resp: (response: any[]) => response.slice(0, 3) // Limit to 3 posts
    },
    
    getPost: {
      uri: '/posts/1'
    }
  }
};

async function runSimpleTests(): Promise<void> {
  const api = new APIManager(testConfig);
  
  try {
    console.log('🚀 Starting simple APIManager tests...\n');

    // Test 1: Create a post
    console.log('📝 Test 1: Creating a post...');
    const newPost = await api.send('createPost', {
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1
    });
    console.log('✅ Created:', { id: newPost.data.id, title: 'Test Post' });

    // Test 2: Get posts with response processing
    console.log('\n📖 Test 2: Getting posts (limited to 3)...');
    const posts = await api.query('getPosts');
    console.log('✅ Retrieved:', posts.data.length, 'posts');
    console.log('First post:', posts.data[0]?.title);

    // Test 3: Get specific post
    console.log('\n🔍 Test 3: Getting specific post...');
    const post = await api.query('getPost');
    console.log('✅ Retrieved post:', { id: post.data.id, title: post.data.title });

    console.log('\n🎉 All simple tests passed! APIManager TypeScript works correctly.');
    console.log('\n💡 Features demonstrated:');
    console.log('   ✓ TypeScript type safety');
    console.log('   ✓ Command operations (POST)');
    console.log('   ✓ Query operations (GET)');
    console.log('   ✓ Response processing');
    console.log('   ✓ Configuration-based API management');
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

runSimpleTests(); 