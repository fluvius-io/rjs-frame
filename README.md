# rjs-frame

A comprehensive, framework-agnostic utility library for managing Single Page Application (SPA) state and server communications. Built with TypeScript, rjs-frame provides a powerful set of tools for building modular, maintainable web applications with robust state management, API communication, and advanced debugging capabilities.

## 🚀 Key Features

### 🧩 Modular Architecture
- **Component-based design** with `PageLayout`, `PageModule`, and `PageSlot` system
- **Automatic module discovery** and organization by slot names
- **Type-safe development** with full TypeScript support
- **Conditional rendering** with parameter-based component visibility

### 🔄 State Management
- **Nano-stores integration** for lightweight, reactive state management
- **Automatic persistence** to localStorage for settings and module state
- **URL-driven state** with automatic synchronization between URL and application state
- **Breadcrumb navigation** system with history management

### 🌐 API Management
- **Configuration-driven API system** with `APIManager` and `APICollection`
- **Multiple operation types**: Commands (POST), Queries (GET), General Requests
- **Real-time communication** via WebSockets and Server-Sent Events
- **Automatic retry and reconnection** for resilient connections
- **Response transformation** and data processing pipelines

### 🛠️ Developer Experience
- **Built-in debugging tools** with X-Ray mode for visual component inspection
- **Page Layout Options** dialog for real-time parameter editing
- **Hot-reloadable configuration** for rapid development
- **Comprehensive error handling** with user-friendly error screens

## 📦 Installation

```bash
npm install rjs-frame
```

### Peer Dependencies
```bash
npm install react react-dom react-router-dom
```

## 🏃‍♂️ Quick Start

### 1. Basic Page Layout

```typescript
import { PageLayout, PageSlot, PageModule } from 'rjs-frame';

// Define your layout structure
class MyAppLayout extends PageLayout {
  renderContent() {
    return (
      <div className="app-layout">
        <header>
          <PageSlot name="header" />
        </header>
        <main>
          <PageSlot name="main" />
        </main>
        <aside>
          <PageSlot name="sidebar" />
        </aside>
      </div>
    );
  }
}

// Create reusable modules
class NavigationModule extends PageModule {
  renderContent() {
    return (
      <nav>
        <h1>My Application</h1>
        {/* Navigation content */}
      </nav>
    );
  }
}

class ContentModule extends PageModule {
  renderContent() {
    return (
      <article>
        <h2>Welcome to rjs-frame</h2>
        <p>Building modular SPAs made easy!</p>
      </article>
    );
  }
}

// Compose your application
function App() {
  return (
    <MyAppLayout>
      <NavigationModule slotName="header" />
      <ContentModule slotName="main" />
    </MyAppLayout>
  );
}
```

### 2. API Management

```typescript
import { APIManager, ApiCollectionConfig } from 'rjs-frame';

// Define your API configuration
const apiConfig: ApiCollectionConfig = {
  name: 'MyAPI',
  baseUrl: 'https://api.example.com',
  
  // Define commands (POST operations)
  commands: {
    createUser: {
      uri: '/users',
      data: (userData) => ({
        ...userData,
        created_at: new Date().toISOString()
      }),
      response: (response) => response.user
    }
  },
  
  // Define queries (GET operations)
  queries: {
    listUsers: {
      uri: '/users',
      meta: '/users/_meta'
    },
    getUserById: {
      uri: '/users/{id}' // Dynamic URI with parameters
    }
  },
  
  // Real-time communication
  sockets: {
    userUpdates: {
      uri: 'ws://localhost:8080/users/updates'
    }
  }
};

// Initialize and use the API
const api = APIManager.registerConfig(apiConfig);

// Send commands
const newUser = await api.send('createUser', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Query data
const users = await api.query('listUsers');
const user = await api.queryItem('getUserById', 'user-123');

// Subscribe to real-time updates
const subscription = api.subscribe('userUpdates', 'user-123');
subscription.subscribe((data) => {
  console.log('User updated:', data);
});
```

### 3. State Management

```typescript
import { 
  getAppState, 
  updatePageParams, 
  updateModuleState,
  subscribeToAppState 
} from 'rjs-frame';

// Get current application state
const currentState = getAppState();

// Update URL parameters (automatically syncs with browser URL)
updatePageParams({ view: 'dashboard', tab: 'analytics' });

// Update module-specific state with persistence
updateModuleState('myModule', { 
  collapsed: false, 
  selectedItems: ['item1', 'item2'] 
});

// Subscribe to state changes
const unsubscribe = subscribeToAppState((state) => {
  console.log('State updated:', state);
});
```

## 🏗️ Core Architecture

### Component Hierarchy
```
PageLayout (base class)
├── PageSlot (renders modules by name)
│   └── PageModule (your content components)
└── PageLayoutOptions (debug dialog)
```

### State Flow
```
URL ↔ AppState ↔ Components
     ↕
localStorage (persistence)
```

### API Flow
```
APIManager → APICollection → HTTP/WebSocket → Server
     ↕                ↕
Configuration    Response Processing
```

## 🛠️ Advanced Features

### URL Fragment Management
rjs-frame provides sophisticated URL management with fragment-based parameters:

```typescript
// URL: /dashboard/-/view:analytics/tab:users/debug
// Automatically parsed into pageParams:
{
  view: 'analytics',
  tab: 'users', 
  debug: true
}
```

### Conditional Rendering
Control component visibility based on application state:

```typescript
<PageModule 
  slotName="admin" 
  condition={{ role: 'admin', feature: 'advanced' }}
>
  <AdminPanel />
</PageModule>
```

### Real-time Communication
Built-in support for WebSockets and Server-Sent Events:

```typescript
// WebSocket connection with automatic reconnection
const wsConnection = api.subscribe('liveData', 'channel1');
wsConnection.subscribe(data => updateUI(data));

// Server-Sent Events
const sseConnection = api.subscribe('notifications');
sseConnection.subscribe(notification => showToast(notification));
```

## 🐛 Debugging Tools

### X-Ray Mode
Press `Alt+O` (or `Option+O` on Mac) to activate:
- **Visual component boundaries** with slot identification
- **State inspector** showing current page and module state
- **Parameter editor** for real-time URL parameter manipulation
- **Module organization viewer** with slot assignments

### Built-in Error Handling
- Graceful error boundaries with recovery options
- Network timeout handling with retry mechanisms
- Validation errors with helpful developer messages
- Loading states with smooth transitions

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Getting Started Guide](./docs/guides/README.md)** - Step-by-step tutorials
- **[API Reference](./docs/api/README.md)** - Complete technical documentation
- **[Migration Guide](./docs/migration/README.md)** - Upgrading from previous versions
- **[Examples](./examples/)** - Working code examples

## 🎯 Use Cases

### Dashboard Applications
```typescript
// Multi-panel dashboards with dynamic content
<DashboardLayout>
  <MetricsModule slotName="metrics" />
  <ChartsModule slotName="charts" condition={{ view: 'analytics' }} />
  <TableModule slotName="data" />
</DashboardLayout>
```

### Content Management Systems
```typescript
// Flexible CMS with conditional editing tools
<CMSLayout>
  <ContentEditor slotName="main" />
  <ToolbarModule slotName="toolbar" condition={{ mode: 'edit' }} />
  <PreviewModule slotName="preview" condition={{ mode: 'preview' }} />
</CMSLayout>
```

### Admin Panels
```typescript
// Role-based admin interfaces
<AdminLayout>
  <UserManagement slotName="main" condition={{ role: 'admin' }} />
  <AuditLog slotName="sidebar" condition={{ permission: 'audit' }} />
</AdminLayout>
```

## 🔧 Configuration

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "node"
  }
}
```

### Vite Configuration
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'umd']
    }
  }
});
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and ensure all tests pass before submitting a pull request.

## 📄 License

MIT License - see LICENSE file for details.

## 🚀 Framework Agnostic

While the examples show React integration, rjs-frame's core utilities (API management, state management, URL utilities) can be used with any JavaScript framework or vanilla JS applications.

---

Built with ❤️ for modern web development
