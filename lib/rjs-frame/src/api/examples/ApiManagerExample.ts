/**
 * API Manager Usage Examples
 * Demonstrates various configuration patterns and usage scenarios
 */

import { APIManager } from '../APIManager';
import { ApiManagerConfig } from '../types';

// ===== EXAMPLE 1: Basic CRUD API Configuration =====

const basicApiConfig: ApiManagerConfig = {
  name: 'UserAPI',
  baseUrl: 'https://api.example.com',
  
  commands: {
    createUser: {
      uri: '/users',
      data: (userData: { name: string; email: string }) => {
        // Validate and transform data
        if (!userData.name || !userData.email) {
          throw new Error('Name and email are required');
        }
        return {
          ...userData,
          created_at: new Date().toISOString()
        };
      },
      resp: (response) => response.user,
      header: { 'X-API-Version': '1.0' }
    },
    
    updateUser: {
      uri: (config, params) => `/users/${params?.userId}`,
      data: (userData: Partial<{ name: string; email: string }>) => ({
        ...userData,
        updated_at: new Date().toISOString()
      }),
      resp: (response) => response.user
    }
  },
  
  queries: {
    listUsers: {
      uri: '/users',
      meta: '/users/_meta',
      resp: (response) => ({
        users: response.data,
        pagination: response.pagination
      })
    },
    
    getUser: {
      uri: (config, params) => `/users/${params?.userId}`,
      resp: (response) => response.user
    }
  },
  
  requests: {
    deleteUser: {
      method: 'DELETE',
      uri: (config, params) => `/users/${params?.userId}`,
      resp: () => ({ success: true })
    }
  }
};

// ===== EXAMPLE 2: Real-time Chat API Configuration =====

const chatApiConfig: ApiManagerConfig = {
  name: 'ChatAPI',
  baseUrl: 'https://chat.example.com',
  
  commands: {
    sendMessage: {
      uri: '/messages',
      data: { 
        message: '', 
        channel: '', 
        user_id: '' 
      },
      resp: (response) => response.message
    }
  },
  
  queries: {
    getMessages: {
      uri: (config, params) => `/channels/${params?.channelId}/messages`,
      meta: (config, params) => `/channels/${params?.channelId}/messages/_meta`
    }
  },
  
  sockets: {
    chatSocket: {
      transport: 'websockets',
      uri: '/ws/chat',
      header: (params) => ({
        'Authorization': `Bearer ${params?.token}`
      })
    },
    
    notifications: {
      transport: 'sse',
      uri: (config, params) => `/sse/notifications?user=${params?.userId}`
    }
  }
};

// ===== EXAMPLE 3: E-commerce API with Complex Data Processing =====

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

const ecommerceApiConfig: ApiManagerConfig = {
  name: 'EcommerceAPI',
  baseUrl: 'https://shop.example.com/api/v2',
  
  commands: {
    createOrder: {
      uri: '/orders',
      data: (orderData: { items: OrderItem[]; customer_id: string }) => {
        // Calculate totals and validate
        const total = orderData.items.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        
        return {
          ...orderData,
          total,
          order_date: new Date().toISOString(),
          status: 'pending'
        };
      },
      header: (params) => ({
        'Authorization': `Bearer ${params?.authToken}`,
        'X-Customer-ID': params?.customerId
      }),
      resp: (response) => ({
        orderId: response.order.id,
        total: response.order.total,
        status: response.order.status
      })
    }
  },
  
  queries: {
    searchProducts: {
      uri: (config, params) => {
        const query = new URLSearchParams();
        if (params?.search) query.set('q', params.search);
        if (params?.category) query.set('category', params.category);
        if (params?.minPrice) query.set('min_price', params.minPrice);
        if (params?.maxPrice) query.set('max_price', params.maxPrice);
        return `/products?${query.toString()}`;
      },
      meta: '/products/_meta',
      resp: (response) => ({
        products: response.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price / 100, // Convert cents to dollars
          category: p.category,
          imageUrl: p.images?.[0]?.url
        })),
        facets: response.facets,
        totalCount: response.total_count
      })
    }
  },
  
  sockets: {
    priceUpdates: {
      transport: 'websockets',
      uri: '/ws/prices',
      header: (params) => ({
        'Authorization': `Bearer ${params?.authToken}`
      })
    }
  }
};

// ===== USAGE EXAMPLES =====

export class ApiManagerExamples {
  
  static async basicCrudExample() {
    const api = new APIManager(basicApiConfig);
    
    try {
      // Create a user
      const newUser = await api.send('createUser', {
        name: 'John Doe',
        email: 'john@example.com'
      });
      console.log('Created user:', newUser.data);
      
      // Get user metadata
      const metadata = await api.getQueryMetadata('listUsers');
      console.log('User list metadata:', metadata.data);
      
      // List users
      const users = await api.query('listUsers');
      console.log('Users:', users.data);
      
      // Update user
      const updatedUser = await api.send('updateUser', 
        { name: 'John Smith' }, 
        { userId: newUser.data.id }
      );
      console.log('Updated user:', updatedUser.data);
      
      // Delete user
      await api.request('deleteUser', undefined, { userId: newUser.data.id });
      console.log('User deleted');
      
    } catch (error) {
      console.error('API Error:', error);
    }
  }
  
  static async chatExample() {
    const api = new APIManager(chatApiConfig);
    
    try {
      // Subscribe to chat messages
      const unsubscribe = api.subscribe('chatSocket', 'general', { 
        token: 'user-auth-token' 
      })((message) => {
        console.log('New message:', message);
      });
      
      // Send a message
      await api.send('sendMessage', {
        message: 'Hello, world!',
        channel: 'general',
        user_id: 'user123'
      });
      
      // Subscribe to notifications
      const unsubscribeNotifications = api.subscribe('notifications', undefined, {
        userId: 'user123'
      })((notification) => {
        console.log('Notification:', notification);
      });
      
      // Later, unsubscribe
      setTimeout(() => {
        unsubscribe();
        unsubscribeNotifications();
        api.disconnectAll();
      }, 30000);
      
    } catch (error) {
      console.error('Chat API Error:', error);
    }
  }
  
  static async ecommerceExample() {
    const api = new APIManager(ecommerceApiConfig);
    
    try {
      // Search for products
      const products = await api.query('searchProducts', {
        search: 'laptop',
        category: 'electronics',
        minPrice: 500,
        maxPrice: 2000
      });
      console.log('Found products:', products.data);
      
      // Subscribe to price updates
      const unsubscribe = api.subscribe('priceUpdates', 'electronics', {
        authToken: 'auth-token'
      })((priceUpdate) => {
        console.log('Price update:', priceUpdate);
      });
      
      // Create an order
      const order = await api.send('createOrder', {
        items: [
          { product_id: 'prod-123', quantity: 1, price: 99999 }, // $999.99 in cents
          { product_id: 'prod-456', quantity: 2, price: 4999 }   // $49.99 in cents
        ],
        customer_id: 'cust-789'
      }, {
        authToken: 'auth-token',
        customerId: 'cust-789'
      });
      
      console.log('Order created:', order.data);
      
    } catch (error) {
      console.error('E-commerce API Error:', error);
    }
  }
}

// ===== ADVANCED CONFIGURATION PATTERNS =====

// Dynamic URI generation based on environment
const dynamicApiConfig: ApiManagerConfig = {
  name: 'DynamicAPI',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.prod.com' 
    : 'https://api.dev.com',
    
  commands: {
    upload: {
      uri: (config, params) => {
        const bucket = params?.environment === 'prod' ? 'prod-uploads' : 'dev-uploads';
        return `/upload/${bucket}/${params?.filename}`;
      },
      data: (file: File) => {
        // Convert to FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        return formData;
      },
      header: (params) => ({
        'Authorization': `Bearer ${params?.token}`,
        'X-Upload-Context': params?.context || 'default'
      })
    }
  }
};

// Data validation and processing with exception-based validation
interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
}

const validateAndProcessUser = (data: any): CreateUserRequest => {
  // Validation - throw exceptions for invalid data
  if (!data || typeof data !== 'object') {
    throw new Error('User data must be an object');
  }
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Name is required and must be a string');
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    throw new Error('Valid email is required');
  }
  if (data.age !== undefined && (typeof data.age !== 'number' || data.age < 0)) {
    throw new Error('Age must be a positive number');
  }

  // Return processed data
  return {
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    age: data.age
  };
};

const validatedApiConfig: ApiManagerConfig = {
  name: 'ValidatedAPI',
  baseUrl: 'https://api.example.com',
  
  commands: {
    createUser: {
      uri: '/users',
      data: validateAndProcessUser, // Validates and processes in one function
      resp: (response) => {
        // Ensure response has expected structure
        if (!response.user || !response.user.id) {
          throw new Error('Invalid response format');
        }
        return response.user;
      }
    },
    
    // Example showing data processing (transformation)
    createPost: {
      uri: '/posts',
      data: (postData: { title: string; content: string }) => {
        // Validation
        if (!postData.title || !postData.content) {
          throw new Error('Title and content are required');
        }
        
        // Processing and transformation
        return {
          ...postData,
          slug: postData.title.toLowerCase().replace(/\s+/g, '-'),
          created_at: new Date().toISOString(),
          word_count: postData.content.split(' ').length
        };
      }
    },
    
    // Example showing validation only (returns original data)
    updateProfile: {
      uri: '/profile',
      data: (profileData: any) => {
        // Validation with exceptions
        if (!profileData || typeof profileData !== 'object') {
          throw new Error('Profile data is required');
        }
        if (!profileData.email || !profileData.email.includes('@')) {
          throw new Error('Valid email is required');
        }
        
        // Return original data if validation passes
        return profileData;
      }
    }
  }
}; 