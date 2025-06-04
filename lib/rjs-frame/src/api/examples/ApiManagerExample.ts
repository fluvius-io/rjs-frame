/**
 * APICollection Examples
 * Comprehensive examples demonstrating various APICollection features
 */

import { APICollection } from '../APIManager';
import { ApiCollectionConfig } from '../types';

// Basic API configuration example
const basicApiConfig: ApiCollectionConfig = {
  name: 'BasicAPI',
  baseUrl: 'https://api.example.com',
  debug: true,
  
  commands: {
    createUser: {
      uri: '/users'
    }
  },
  
  queries: {
    getUsers: {
      uri: '/users'
    },
    
    getUserById: {
      uri: "/users/{userId}"
    },
    
    getUserProfile: {
      uri: "/users/{userId}"
    }
  },
  
  sockets: {
    chatSocket: {
      transport: 'websockets',
      uri: '/ws/chat'
    },
    
    notificationSocket: {
      transport: 'sse',
      uri: "/sse/notifications?user={userId}"
    }
  }
};

// Chat API configuration example
const chatApiConfig: ApiCollectionConfig = {
  name: 'ChatAPI',
  baseUrl: 'https://chat.example.com',
  debug: false,
  
  commands: {
    sendMessage: {
      uri: '/messages'
    }
  },
  
  sockets: {
    messageSocket: {
      transport: 'websockets',
      uri: '/ws/messages'
    }
  }
};

// E-commerce API configuration example
const ecommerceApiConfig: ApiCollectionConfig = {
  name: 'EcommerceAPI',
  baseUrl: 'https://shop.example.com/api',
  debug: true,
  
  commands: {
    createOrder: {
      uri: '/orders'
    }
  },
  
  queries: {
    getProducts: {
      uri: "/products?category={category}&limit={limit}"
    }
  },
  
  sockets: {
    priceUpdates: {
      transport: 'websockets',
      uri: '/ws/prices'
    }
  }
};

export class ApiCollectionExamples {
  static async basicExample() {
    const api = new APICollection(basicApiConfig);
    
    try {
      // Create a new user
      console.log('Creating user...');
      const createResult = await api.send('createUser', {
        name: 'John Doe',
        email: 'john@example.com'
      });
      console.log('User created:', createResult.data);
      
      // Get all users
      console.log('Fetching users...');
      const usersResult = await api.query('getUsers');
      console.log('Users:', usersResult.data);
      
      // Get specific user
      console.log('Fetching specific user...');
      const userResult = await api.query('getUserById', { path: { userId: '123' } });
      console.log('User:', userResult.data);
      
    } catch (error) {
      console.error('Basic example error:', error);
    }
  }
  
  static async chatExample() {
    const api = new APICollection(chatApiConfig);
    
    try {
      // Send a message
      console.log('Sending message...');
      const messageResult = await api.send('sendMessage', {
        content: 'Hello, world!',
        user_id: 'user123'
      });
      console.log('Message sent:', messageResult.data);
      
      // Subscribe to real-time messages
      console.log('Subscribing to messages...');
      const unsubscribe = api.subscribe('messageSocket', 'general')((message) => {
        console.log('New message received:', message);
      });
      
      // Clean up after 30 seconds
      setTimeout(() => {
        unsubscribe();
        console.log('Unsubscribed from all channels');
      }, 30000);
      
    } catch (error) {
      console.error('Chat example error:', error);
    }
  }
  
  static async ecommerceExample() {
    const api = new APICollection(ecommerceApiConfig);
    
    try {
      // Get products
      console.log('Fetching products...');
      const productsResult = await api.query('getProducts', {
        search: {
          category: 'electronics',
          limit: '10'
        }
      });
      console.log('Products:', productsResult.data);
      
      // Create an order
      console.log('Creating order...');
      const orderResult = await api.send('createOrder', {
        items: [
          { product_id: 'prod123', quantity: 2, price: 29.99 },
          { product_id: 'prod456', quantity: 1, price: 49.99 }
        ],
        customer_id: 'cust789'
      });
      console.log('Order created:', orderResult.data);
      
      // Subscribe to price updates
      console.log('Subscribing to price updates...');
      const unsubscribe = api.subscribe('priceUpdates', 'electronics')((priceUpdate) => {
        console.log('Price update:', priceUpdate);
      });
      
      // Clean up after 60 seconds
      setTimeout(() => {
        unsubscribe();
        console.log('Unsubscribed from price updates');
      }, 60000);
      
    } catch (error) {
      console.error('E-commerce example error:', error);
    }
  }
  
  static async runAllExamples() {
    console.log('🚀 Running APICollection Examples\n');
    
    await this.basicExample();
    console.log('\n---\n');
    
    await this.chatExample();
    console.log('\n---\n');
    
    await this.ecommerceExample();
    
    console.log('\n✅ All examples completed!');
  }
} 