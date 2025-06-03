# API Manager

A comprehensive, configuration-driven API management system for TypeScript/JavaScript applications. The APIManager provides a unified interface for handling HTTP requests, real-time communication, and complex API workflows.

## Features

- 🚀 **Configuration-driven**: Define your entire API structure in a single TypeScript configuration
- 🔄 **Multiple Operation Types**: Commands (POST), Queries (GET), General Requests, and Real-time Communication
- 🛡️ **Type Safety**: Full TypeScript support with configurable data validation
- 🔌 **Real-time Support**: WebSockets and Server-Sent Events with automatic reconnection
- 🎯 **Dynamic URI Generation**: Flexible URI construction with functions and parameters
- 🔧 **Data Processing**: Transform and validate data at every step
- 📊 **Response Processing**: Transform API responses to match your application needs
- 🗂️ **Header Management**: Dynamic header generation based on context

## Quick Start

```typescript
import { APIManager, ApiManagerConfig } from '@rjs/frame/api';

// Define your API configuration
const apiConfig: ApiManagerConfig = {
  name: 'MyAPI',
  baseUrl: 'https://api.example.com',
  
  commands: {
    createUser: {
      uri: '/users',
      data: (userData: { name: string; email: string }) => ({
        ...userData,
        created_at: new Date().toISOString()
      }),
      resp: (response) => response.user
    }
  },
  
  queries: {
    listUsers: {
      uri: '/users',
      meta: '/users/_meta'
    }
  }
};

// Initialize the API manager
const api = new APIManager(apiConfig);

// Use it in your application
const newUser = await api.send('createUser', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

## Configuration Structure

### Root Configuration

```typescript
interface ApiManagerConfig {
  name: string;           // API name for identification
  baseUrl: string;        // Base URL for all requests
  commands?: Record<string, CommandConfig>;   // POST operations
  queries?: Record<string, QueryConfig>;     // GET operations with metadata
  sockets?: Record<string, SocketConfig>;    // Real-time communication
  requests?: Record<string, RequestConfig>;  // General HTTP requests
}
```

### Commands (POST Operations)

Commands are for actions that modify server state:

```typescript
interface CommandConfig {
  uri: string | UriGenerator;              // Endpoint URI
  data?: DataSchema;                       // Data validation/transformation
  resp?: ResponseProcessor | null;         // Response transformation
  header?: HeaderConfig;                   // Request headers
}
```

**Example:**
```typescript
commands: {
  createPost: {
    uri: '/posts',
    data: (postData: { title: string; content: string }) => ({
      ...postData,
      created_at: new Date().toISOString(),
      status: 'draft'
    }),
    header: { 'Content-Type': 'application/json' },
    resp: (response) => response.post
  }
}
```

### Queries (GET Operations)

Queries are for retrieving data, often with metadata support:

```typescript
interface QueryConfig {
  uri: string | UriGenerator;              // Endpoint URI
  meta?: string | UriGenerator;            // Metadata endpoint
  resp?: ResponseProcessor | null;         // Response transformation
  header?: HeaderConfig;                   // Request headers
}
```

**Example:**
```typescript
queries: {
  searchPosts: {
    uri: (config, params) => `/posts?q=${params?.search}&limit=${params?.limit || 10}`,
    meta: '/posts/_meta',
    resp: (response) => ({
      posts: response.data,
      pagination: response.pagination,
      totalCount: response.total
    })
  }
}
```

### Sockets (Real-time Communication)

Support for WebSockets and Server-Sent Events:

```typescript
interface SocketConfig {
  transport: 'websockets' | 'sse' | 'mqtt' | 'webrtc';
  uri: string | UriGenerator;              // Connection URI
  header?: HeaderConfig;                   // Connection headers
}
```

**Example:**
```typescript
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
    uri: (config, params) => `/sse/user/${params?.userId}/notifications`
  }
}
```

### Requests (General HTTP)

For any HTTP method and custom request patterns:

```typescript
interface RequestConfig {
  method: HttpMethod;                      // HTTP method
  uri: string | UriGenerator;              // Endpoint URI
  data?: DataSchema;                       // Data validation/transformation
  resp?: ResponseProcessor | null;         // Response transformation
  header?: HeaderConfig;                   // Request headers
}
```

## Usage Patterns

### Basic Operations

```typescript
const api = new APIManager(config);

// Send commands (POST)
const result = await api.send('createUser', userData, { contextParam: 'value' });

// Query data (GET)
const users = await api.query('listUsers', { page: 1, limit: 10 });

// Get query metadata
const metadata = await api.getQueryMetadata('listUsers');

// Make general requests
const response = await api.request('customOperation', data, params);
```

### Real-time Communication

```typescript
// Subscribe to a channel
const unsubscribe = api.subscribe('chatSocket', 'general', { token: 'auth-token' })(
  (message) => {
    console.log('New message:', message);
  }
);

// Publish to a channel (WebSocket only)
api.publish('chatSocket', 'general')({ 
  text: 'Hello, world!', 
  user: 'john' 
});

// Unsubscribe when done
unsubscribe();

// Disconnect all sockets
api.disconnectAll();
```

## Advanced Features

### Dynamic URI Generation

```typescript
// Simple string URIs are automatically prefixed with baseUrl
uri: '/users'  // becomes: https://api.example.com/users

// Function URIs receive config and params
uri: (config, params) => {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  return `/users?page=${page}&limit=${limit}`;
}
```

### Data Processing Pipeline

```typescript
// Static data (merged with user data)
data: { created_at: new Date().toISOString() }

// Data processing function (validates and transforms)
data: (userData) => {
  // Validation - throw exceptions for invalid data
  if (!userData.name || !userData.email) {
    throw new Error('Name and email are required');
  }
  
  // Processing and transformation
  return {
    ...userData,
    name: userData.name.trim(),
    email: userData.email.toLowerCase(),
    created_at: new Date().toISOString()
  };
}

// Validation-only function (returns original data if valid)
data: (userData) => {
  // Validation with exceptions
  if (!userData.email || !userData.email.includes('@')) {
    throw new Error('Valid email is required');
  }
  
  // Return original data unchanged
  return userData;
}
```

**Function Behavior:**
- **Validation**: Functions should throw exceptions for invalid data
- **Processing**: Functions should return the processed/transformed data
- **Validation-only**: Functions can return the original data unchanged if just validating

### Response Processing

```typescript
// Extract specific data from response
resp: (response) => response.user

// Transform response structure
resp: (response) => ({
  items: response.data.map(item => ({ ...item, processed: true })),
  meta: {
    total: response.pagination.total,
    hasMore: response.pagination.has_more
  }
})

// Skip response processing
resp: null
```

### Dynamic Headers

```typescript
// Static headers
header: { 'X-API-Version': '1.0', 'Accept': 'application/json' }

// Dynamic headers based on parameters
header: (params) => ({
  'Authorization': `Bearer ${params?.token}`,
  'X-User-ID': params?.userId,
  'X-Request-ID': crypto.randomUUID()
})
```

## Error Handling

The API Manager provides specific error types:

```typescript
import { ApiError, ValidationError, ConfigurationError } from '@rjs/frame/api';

try {
  const result = await api.send('createUser', userData);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message, 'Status:', error.status);
  } else if (error instanceof ValidationError) {
    console.error('Validation Error:', error.message, 'Field:', error.field);
  } else if (error instanceof ConfigurationError) {
    console.error('Configuration Error:', error.message);
  }
}
```

## Real-time Communication Details

### WebSocket Features
- Automatic reconnection with exponential backoff
- Channel-based subscription system
- JSON message handling
- Connection state management

### Server-Sent Events Features
- Automatic reconnection
- Event-based message routing
- Text and JSON message support
- Graceful fallback handling

## Integration Examples

### With React

```typescript
import { useEffect, useState } from 'react';
import { APIManager } from '@rjs/frame/api';

function useApiManager(config) {
  const [api] = useState(() => new APIManager(config));
  
  useEffect(() => {
    return () => api.disconnectAll();
  }, [api]);
  
  return api;
}

function ChatComponent() {
  const api = useApiManager(chatConfig);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const unsubscribe = api.subscribe('chatSocket', 'general')((message) => {
      setMessages(prev => [...prev, message]);
    });
    
    return unsubscribe;
  }, [api]);
  
  const sendMessage = async (text) => {
    await api.send('sendMessage', { text, channel: 'general' });
  };
  
  // ... component JSX
}
```

### With Node.js Server

```typescript
// Server-side API manager for internal service communication
const internalApi = new APIManager({
  name: 'InternalAPI',
  baseUrl: process.env.INTERNAL_API_URL,
  
  commands: {
    notifyService: {
      uri: (config, params) => `/services/${params.service}/notify`,
      header: () => ({
        'Authorization': `Bearer ${process.env.INTERNAL_TOKEN}`,
        'X-Source-Service': process.env.SERVICE_NAME
      })
    }
  }
});

// Use in your route handlers
app.post('/api/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    
    // Notify other services
    await internalApi.send('notifyService', 
      { event: 'user.created', user }, 
      { service: 'email-service' }
    );
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Best Practices

1. **Configuration Organization**: Group related operations and use consistent naming
2. **Error Handling**: Always handle API errors gracefully
3. **Type Safety**: Use TypeScript interfaces for your data structures
4. **Resource Cleanup**: Disconnect real-time connections when components unmount
5. **Environment Configuration**: Use environment variables for baseUrl and tokens
6. **Response Caching**: Implement caching strategies for frequently accessed data
7. **Retry Logic**: Consider implementing retry mechanisms for critical operations

## Testing

```typescript
import { APIManager } from '@rjs/frame/api';

// Mock fetch for testing
global.fetch = jest.fn();

describe('APIManager', () => {
  const config = { /* your test config */ };
  const api = new APIManager(config);
  
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });
  
  it('should send commands correctly', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: 1, name: 'Test' } })
    });
    
    const result = await api.send('createUser', { name: 'Test' });
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(result.data.name).toBe('Test');
  });
});
```

## License

MIT License - see LICENSE file for details. 


## Original Prompt

in rjs-frame create an APIManager class that manage various API calls and queries from the server.

The APIManager is initialized using a typescript configuration that have the following structure:

{
     name: <api name>,
     baseUrl: <default api base url>,
     commands: {
          <command name>: {
                 "uri": <command uri / uri generator>,
                 "data": <payload data schema>,
                 "resp": <response processor>,
                 "header": <header data / generator>,
         }
     },
     queries: {
          <query name>: {
                "uri": <query uri / uri generator>,
                "meta": <query metadata uri>,
                "resp" <query response processor>,
                "header": <header data / generator>,
          }
     },
     sockets: {
          <realtime communication channel name>: {
               "type": <type of rtc channel e.g. mqtt/websockets/sse>,
               "uri": <connection uri / uri generator>,
               "header": <header data / generator>,
          }
     },
     requests: {
          <ordinary http requests>: {
               "method": GET | POST | PATCH | OPTIONS | etc.
               "uri": <request uri / uri generator>,
               "data": <payload data schema>,
               "resp": <response processor>,
               "header": <header data / generator>,
          }
     }
}

After initialization, the APIManager provides methods for:

sending http commands (POST) and get the response from command requests. E.g. APIManager.send(command_name, data, [params])

query data from http server (GET) E.g. APIManager.query(query_name, [params])

realtime communication: 
- APIManager.subscribe(socket_name, [channel], [params])(handler_function)
- APIManager.publish(socket_name, [channel], [params])(message)

other type of requests APIManager.request(request_name, [data], [params])

For all types:

uri: if it is a string, use it as it is. If it is a function, call the function with the current (command, query, sockets, request) configuration as the first params, and the user supplied params as the secon params. 

E.g. uri({
                 "uri": <command uri / uri generator>,
                 "data": <payload data schema>,
                 "resp": <response processor>,
                 "header": <header data / generator>,
         }, {args: "abcde"})
Same for `meta` field.

For data configuration, 
  - if it is a mapping, use the data as is.
  - if it is a type, use the type to validate user supplied data.
  - if it is a function, run the function with user supplied data and get the output for next step
  - Error if invalid value

For header configuration
  - if it is a mapping, use the data as is.
  - if it is a function, run the function with user supplied params and get the output for next step
  - Error if invalid value

For resp configuration (response)
  - If it is a function, run the resp function on response data before return
  - If it is null, do nothing
  - Error if invalid value

## API Response Structure

The APIManager returns a consistent response structure with native Headers support:

```typescript
interface ApiResponse<T> {
  data: T;               // Parsed response data
  status: number;        // HTTP status code
  statusText: string;    // HTTP status text
  headers: Headers;      // Native Headers object with methods
}
```

**Headers Object Benefits:**
```typescript
const response = await api.query('getUsers');

// Use Headers methods
const contentType = response.headers.get('content-type');
const hasAuth = response.headers.has('authorization');

// Iterate over headers
response.headers.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});

// Convert to object if needed
const headersObj = Object.fromEntries(response.headers.entries());
```
