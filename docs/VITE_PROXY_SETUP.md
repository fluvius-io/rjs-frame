# Vite Proxy Setup Guide for rjs-admin

This guide shows how to configure Vite to forward API calls from `/api/*` to your backend server running at `http://localhost:8000` for both regular development and Storybook.

## ✅ Prerequisites

Before using the ApiPaginatedList component examples, make sure:

1. **Your backend server is running** on `http://localhost:8000`
2. **Your backend provides these endpoints**:
   - `http://localhost:8000/_info/idm.user` (metadata endpoint)
   - `http://localhost:8000/idm.user/` (data endpoint, optional)
3. **Proxy is configured** in both Vite and Storybook

## Setup for Consumer Applications

Since the PaginatedList component with API metadata functionality is typically used in consumer applications, you need to configure the proxy in your **consumer app's** `vite.config.ts` file.

### Regular Development Server Configuration

Add the following configuration to your consumer app's `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
} as any) // Use 'as any' if you encounter TypeScript version conflicts
```

### Storybook Configuration

For Storybook, update your `.storybook/main.ts` file:

```typescript
import { createRequire } from "node:module";
import type { StorybookConfig } from '@storybook/react-vite';
import path, { dirname, join } from 'path';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  viteFinal: async (config) => {
    // Ensure proper alias resolution
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // Add proxy configuration for API calls
    config.server = config.server || {};
    config.server.proxy = {
      '/api': 'http://localhost:8000',
    };

    return config;
  }
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
```

### Advanced Configuration with Options

For more control over the proxy behavior:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Optional: Remove '/api' prefix when forwarding
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/_info': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
} as any)
```

### Configuration Options Explained

- **`target`**: The backend server URL
- **`changeOrigin`**: Changes the origin of the host header to match the target
- **`secure`**: Set to false for HTTP backends (true for HTTPS)
- **`rewrite`**: Optional function to rewrite the request path

## Testing the Setup

### 1. Start Your Backend Server

Make sure your backend server is running on `http://localhost:8000`:

```bash
# Test if backend is accessible
curl http://localhost:8000/_info/idm.user
```

You should see the metadata JSON response.

### 2. Test Regular Development Server

**Start your Vite dev server**:
```bash
cd app/rjs-shadcn  # or your consumer app directory
npm run dev
```

**Test API calls** from your frontend:
```javascript
// This will be forwarded to http://localhost:8000/_info/idm.user
fetch('/api/_info/idm.user')

// This will be forwarded to http://localhost:8000/idm.user/
fetch('/api/idm.user/')
```

### 3. Test Storybook

**Start Storybook**:
```bash
cd lib/rjs-admin  # Library directory
npm run storybook
```

**Use Storybook examples** (these now make real API calls):
- Navigate to "ApiPaginatedList" examples in Storybook
- The "Users from Real API" story will fetch from your actual backend
- Check browser console for API request logs

### 4. Verify Proxy is Working

Open browser console and look for:
- ✅ Successful API calls to `/api/_info/idm.user`
- ✅ Data loading in the ApiPaginatedList component
- ❌ If you see CORS errors or network failures, the proxy might not be working

## Using with PaginatedList

With the proxy configured, you can now use the PaginatedList component with your API:

```tsx
import { ApiPaginatedList } from 'rjs-admin';

function UsersTable() {
  return (
    <ApiPaginatedList
      metadataUrl="/api/_info/idm.user"  // Proxied to backend
      dataUrl="/api/idm.user/"           // Proxied to backend
      title="Users"
      showSearch
      showFilters
    />
  );
}
```

## Backend API Requirements

Your backend server must provide these endpoints:

### Metadata Endpoint: `/api/_info/idm.user`
Must return metadata in this format:
```json
{
  "fields": {
    "_id": {
      "label": "User ID",
      "sortable": true,
      "hidden": false,
      "identifier": true,
      "factory": null,
      "source": null
    }
    // ... more fields
  },
  "params": {
    "_id:eq": {
      "index": 4,
      "field_name": "_id",
      "operator": "eq",
      "widget": null
    }
    // ... more operators
  },
  "sortables": ["_id", "name__family"],
  "default_order": ["_id:asc"]
}
```

### Data Endpoint: `/api/idm.user/` (Optional)
Should support query parameters:
- `page` - Page number
- `limit` - Items per page
- `sort` - Sort field and direction (e.g., "name__family:asc")
- `search` - Search query
- `filter[n][field]`, `filter[n][operator]`, `filter[n][value]` - Filters

Response format:
```json
{
  "data": [...],     // Array of user objects
  "total": 150,      // Total number of users
  "page": 1,         // Current page
  "pageSize": 10     // Items per page
}
```

## Real API Integration

✅ **Both regular dev server and Storybook now make real API calls** to your backend server through the proxy.

### Development Server (`npm run dev`)
- Configure proxy in `vite.config.ts`
- API calls from your app components will be proxied

### Storybook (`npm run storybook`)
- Configure proxy in `.storybook/main.ts`
- Storybook examples will make real API calls
- **"Users from Real API"** - Fetches both metadata and data from your server
- **"Users from API Metadata"** - Fetches metadata from server, uses sample data fallback
- **Check browser console** for detailed API request logs

## Quick Test Commands

```bash
# Test backend is running
curl http://localhost:8000/_info/idm.user

# Start consumer app with proxy
cd app/rjs-shadcn && npm run dev

# Start Storybook with proxy
cd lib/rjs-admin && npm run storybook
```

## Common Issues and Solutions

### CORS Issues
If you encounter CORS issues, the proxy should resolve them since all requests appear to come from the same origin.

### Backend Not Running
If your backend server is not running on `http://localhost:8000`, you'll see network errors in the browser console. Make sure:
- Backend server is started
- Endpoints are available at `http://localhost:8000/_info/idm.user`
- Proxy configuration matches your backend URL

### TypeScript Version Conflicts
If you encounter TypeScript errors in `vite.config.ts`, add `as any` type assertion:
```typescript
export default defineConfig({
  // ... your config
} as any)
```

### Path Rewriting
If your backend expects requests without the `/api` prefix:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

This would forward `/api/_info/idm.user` to `http://localhost:8000/_info/idm.user`.

### HTTPS Backend
For HTTPS backends:

```typescript
proxy: {
  '/api': {
    target: 'https://localhost:8000',
    changeOrigin: true,
    secure: true, // Set to true for HTTPS
  },
}
```

### Custom Headers
To add custom headers:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    configure: (proxy, options) => {
      proxy.on('proxyReq', (proxyReq, req, res) => {
        proxyReq.setHeader('X-Special-Header', 'value');
      });
    },
  },
}
```

## Alternative: Environment-based Configuration

For different environments:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const backendUrl = mode === 'development' 
    ? 'http://localhost:8000' 
    : 'https://api.yourapp.com';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': backendUrl,
        '/_info': backendUrl,
      },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  } as any;
});
```

## Multiple Backends

To proxy different paths to different backends:

```typescript
server: {
  proxy: {
    '/api/auth': 'http://localhost:8001',    // Auth service
    '/api/users': 'http://localhost:8002',   // User service
    '/api': 'http://localhost:8000',         // Default API
    '/_info': 'http://localhost:8000',       // Metadata service
  },
}
```

Remember: The order matters - more specific paths should come first! 