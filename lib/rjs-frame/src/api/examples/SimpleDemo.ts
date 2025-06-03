/**
 * Simple APIManager Demo
 * Shows basic usage patterns without testing dependencies
 */

import { APIManager, ApiManagerConfig } from '../';

// Example configuration for a blog API
const blogApiConfig: ApiManagerConfig = {
  name: 'BlogAPI',
  baseUrl: 'https://jsonplaceholder.typicode.com',
  
  commands: {
    createPost: {
      uri: '/posts',
      data: (postData: { title: string; body: string; userId: number }) => ({
        ...postData,
        created_at: new Date().toISOString()
      }),
      resp: (response) => ({
        id: response.id,
        title: response.title,
        body: response.body,
        created: true
      })
    }
  },
  
  queries: {
    getPosts: {
      uri: '/posts',
      resp: (response) => response.slice(0, 5) // Limit to 5 posts
    },
    
    getPost: {
      uri: (config, params) => `/posts/${params?.postId}`,
      resp: (response) => ({
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
      uri: (config, params) => `/posts/${params?.postId}`,
      resp: () => ({ deleted: true })
    }
  }
};

// Example usage function
export async function runBlogApiDemo() {
  console.log('🚀 Starting Blog API Demo...');
  
  const api = new APIManager(blogApiConfig);
  
  try {
    // 1. Create a new post
    console.log('\n📝 Creating a new post...');
    const newPost = await api.send('createPost', {
      title: 'My New Blog Post',
      body: 'This is the content of my new blog post. It demonstrates the APIManager in action!',
      userId: 1
    });
    console.log('✅ Post created:', newPost.data);
    
    // 2. Get all posts
    console.log('\n📖 Fetching all posts...');
    const posts = await api.query('getPosts');
    console.log('✅ Found posts:', posts.data.length, 'posts');
    console.log('First post:', posts.data[0]?.title);
    
    // 3. Get a specific post
    console.log('\n🔍 Fetching specific post...');
    const specificPost = await api.query('getPost', { postId: 1 });
    console.log('✅ Post details:', {
      title: specificPost.data.title,
      wordCount: specificPost.data.wordCount
    });
    
    // 4. Delete a post
    console.log('\n🗑️ Deleting a post...');
    const deleteResult = await api.request('deletePost', undefined, { postId: 1 });
    console.log('✅ Delete result:', deleteResult.data);
    
    console.log('\n🎉 Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Real-time chat demo configuration
const chatDemoConfig: ApiManagerConfig = {
  name: 'ChatDemo',
  baseUrl: 'wss://echo.websocket.org',
  
  sockets: {
    echoSocket: {
      transport: 'websockets',
      uri: '/',
      header: () => ({
        'User-Agent': 'APIManager Demo'
      })
    }
  }
};

// WebSocket demo (requires a WebSocket server)
export async function runWebSocketDemo() {
  console.log('🔌 Starting WebSocket Demo...');
  
  const api = new APIManager(chatDemoConfig);
  
  try {
    // Subscribe to messages
    const unsubscribe = api.subscribe('echoSocket', 'default')((message) => {
      console.log('📨 Received message:', message);
    });
    
    // Wait a moment for connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send a test message
    api.publish('echoSocket', 'default')({
      type: 'greeting',
      message: 'Hello from APIManager!',
      timestamp: new Date().toISOString()
    });
    
    // Clean up after 5 seconds
    setTimeout(() => {
      console.log('🔌 Cleaning up WebSocket demo...');
      unsubscribe();
      api.disconnectAll();
    }, 5000);
    
  } catch (error) {
    console.error('❌ WebSocket demo failed:', error);
  }
}

// Export demo runner
export function runDemos() {
  console.log('🎬 Running APIManager Demos\n');
  
  // Run blog API demo
  runBlogApiDemo().then(() => {
    console.log('\n' + '='.repeat(50));
    
    // Uncomment to run WebSocket demo
    // runWebSocketDemo();
  });
}

// Usage comment for documentation
/*
To run these demos:

import { runDemos } from '@rjs/frame/api/examples/SimpleDemo';
runDemos();

Or run individual demos:

import { runBlogApiDemo, runWebSocketDemo } from '@rjs/frame/api/examples/SimpleDemo';
await runBlogApiDemo();
// await runWebSocketDemo();
*/ 