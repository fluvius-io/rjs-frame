/**
 * Simple APICollection Demo
 * Basic usage examples for the APICollection system
 */

import { APICollection, ApiCollectionConfig } from '../';

// Blog API configuration
const blogApiConfig: ApiCollectionConfig = {
  name: 'BlogAPI',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  debug: true,
  
  commands: {
    createPost: {
      uri: '/posts',
      method: 'POST'
    }
  },
  
  queries: {
    getPosts: {
      uri: '/posts',
      method: 'GET'
    },
    
    getUsers: {
      uri: '/users',
      method: 'GET'
    }
  },
  
  requests: {
    deletePost: {
      uri: (params) => `/posts/${params?.postId}`,
      method: 'DELETE'
    }
  }
};

// Chat API configuration
const chatDemoConfig: ApiCollectionConfig = {
  name: 'ChatDemo',
  baseUrl: 'wss://echo.websocket.org',
  debug: true,
  
  sockets: {
    echoSocket: {
      type: 'websocket',
      uri: '/'
    }
  }
};

async function runBlogDemo() {
  console.log('🚀 Blog API Demo');
  
  const api = new APICollection(blogApiConfig);
  
  try {
    // Create a new post
    const newPost = await api.send('createPost', {
      title: 'My First Post',
      body: 'This is the content of my new blog post. It demonstrates the APICollection in action!',
      userId: 1
    });
    
    console.log('✅ Created post:', newPost.data);
    
    // Get all posts
    const posts = await api.query('getPosts');
    console.log('📄 Total posts:', posts.data.length);
    
    // Get all users
    const users = await api.query('getUsers');
    console.log('👥 Total users:', users.data.length);
    
    // Delete a post
    const deleteResult = await api.request('deletePost', undefined, { postId: 1 });
    console.log('🗑️ Delete result:', deleteResult.status);
    
  } catch (error) {
    console.error('❌ Blog demo error:', error);
  }
}

async function runChatDemo() {
  console.log('\n🚀 Chat Demo');
  
  const api = new APICollection(chatDemoConfig);
  
  try {
    // Subscribe to echo socket
    const unsubscribe = api.subscribe('echoSocket', 'default')((message) => {
      console.log('📨 Echo received:', message);
    });
    
    // Send a test message
    const publish = api.publish('echoSocket', 'default');
    publish({
      message: 'Hello from APICollection!',
      timestamp: new Date().toISOString()
    });
    
    // Clean up after 5 seconds
    setTimeout(() => {
      unsubscribe();
      console.log('🔌 Disconnected from echo socket');
    }, 5000);
    
  } catch (error) {
    console.error('❌ Chat demo error:', error);
  }
}

export async function runSimpleDemo() {
  console.log('🎬 Running APICollection Demos\n');
  
  await runBlogDemo();
  await runChatDemo();
  
  console.log('\n✅ All demos completed!');
}

// Run demo if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  runSimpleDemo().catch(console.error);
}

// Usage comment for documentation
/*
To run these demos:

import { runSimpleDemo } from '@rjs/frame/api/examples/SimpleDemo';
runSimpleDemo();

Or run individual demos:

import { runBlogDemo, runChatDemo } from '@rjs/frame/api/examples/SimpleDemo';
await runBlogDemo();
// await runChatDemo();
*/ 