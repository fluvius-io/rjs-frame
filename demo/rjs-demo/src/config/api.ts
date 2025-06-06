import { APIManager, ApiCollectionConfig } from 'rjs-frame';
import { appConfig } from './index';

// Create API configuration
export function createApiManagerConfig(): ApiCollectionConfig {
  return {
    name: 'RJS Demo API',
    baseUrl: 'https://jsonplaceholder.typicode.com',
    debug: true,
    
    queries: {
      getUsers: {
        uri: '/users'
      },
      getUser: {
        uri: (params?: any) => `/users/${params?.id}`
      },
      getPosts: {
        uri: '/posts'
      },
      getPost: {
        uri: (params?: any) => `/posts/${params?.id}`
      },
      getUserPosts: {
        uri: (params?: any) => `/users/${params?.userId}/posts`
      }
    },
    
    commands: {
      createPost: {
        uri: '/posts'
      },
      updatePost: {
        uri: (params?: any) => `/posts/${params?.id}`
      },
      deletePost: {
        uri: (params?: any) => `/posts/${params?.id}`
      }
    },
    
    requests: {
      getComments: {
        uri: (params?: any) => `/posts/${params?.postId}/comments`,
        method: 'GET'
      },
      createComment: {
        uri: '/comments',
        method: 'POST'
      }
    }
  };
}

// Create and export the API instance
export const apiManager = new APIManager(createApiManagerConfig());

// Export as default
export default apiManager;

// Log configuration in debug mode
if (appConfig.features.debugMode) {
  console.log('🔧 API Manager Configuration:', {
    baseUrl: appConfig.api.baseUrl,
    debug: appConfig.api.debug,
    timeout: appConfig.api.timeout,
    retries: appConfig.api.retries
  });
} 