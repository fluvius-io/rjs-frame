# rjs-frame Documentation

## Overview

rjs-frame is a React library that provides a modular architecture for building complex applications. It consists of three main components that work together to create flexible, reusable layouts:

- **PageLayout**: Abstract base class for defining page layouts
- **PageModule**: Base class for creating modular components
- **ModuleSlot**: Component for rendering modules within layouts

## Core Concepts

### 1. PageLayout

`PageLayout` is an abstract React component that serves as the foundation for creating custom page layouts. It manages the organization and rendering of modules within a page.

#### Key Features

- **Module Management**: Automatically organizes and normalizes modules passed as props
- **Context Provider**: Provides layout context to child components
- **Lifecycle Hooks**: Offers `onMount()` and `onUnmount()` methods for custom logic
- **Reserved Keys**: Protects the 'main' module key for layout children

#### Basic Usage

```typescript
import { PageLayout, PageLayoutProps } from 'rjs-frame';

interface CustomLayoutProps extends PageLayoutProps {
  // Add custom props here
}

class CustomLayout extends PageLayout<CustomLayoutProps> {
  renderContent(): React.ReactNode {
    return (
      <div className="custom-layout">
        <header>
          <ModuleSlot name="header" />
        </header>
        <main>
          <ModuleSlot name="main" />
        </main>
        <aside>
          <ModuleSlot name="sidebar" />
        </aside>
        <footer>
          <ModuleSlot name="footer" />
        </footer>
      </div>
    );
  }
}
```

#### Advanced Usage with Lifecycle

```typescript
class DashboardLayout extends PageLayout {
  protected onMount(): void {
    // Custom logic when layout mounts
    console.log('Dashboard layout mounted');
  }

  protected onUnmount(): void {
    // Cleanup logic when layout unmounts
    console.log('Dashboard layout unmounted');
  }

  renderContent(): React.ReactNode {
    return (
      <div className="dashboard-layout">
        <ModuleSlot name="sidebar" />
        <div className="main-content">
          <ModuleSlot name="main" />
        </div>
      </div>
    );
  }
}
```

### 2. PageModule

`PageModule` is a base class for creating modular components that can be easily integrated into different layouts. A page module is aware and can integrate with the layout facilities via the module slot context and page context.

A page module must located within a module slot and subscribe to its context.

#### Key Features

- **Unique Identification**: Each module has a unique ID for tracking
- **Lifecycle Management**: Built-in mount/unmount lifecycle methods
- **Standardized Interface**: Consistent API across all modules

#### Basic Usage

```typescript
import { PageModule } from 'rjs-frame';

interface StatsModuleProps {
  title: string;
  value: number;
  trend?: 'up' | 'down';
}

class StatsModule extends PageModule<StatsModuleProps> {
  renderContent(): React.ReactNode {
    const { title, value, trend } = this.props;
    
    return (
      <div className="stats-module">
        <h3>{title}</h3>
        <div className="value">{value}</div>
        {trend && (
          <div className={`trend trend-${trend}`}>
            {trend === 'up' ? '↗' : '↘'}
          </div>
        )}
      </div>
    );
  }
}
```

#### Module with State and Effects

```typescript
import { PageModule } from 'rjs-frame';
import { useState, useEffect } from 'react';

interface DataTableModuleProps {
  apiEndpoint: string;
}

class DataTableModule extends PageModule<DataTableModuleProps> {
  renderContent(): React.ReactNode {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch(this.props.apiEndpoint)
        .then(res => res.json())
        .then(data => {
          setData(data);
          setLoading(false);
        });
    }, [this.props.apiEndpoint]);

    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    return (
      <div className="data-table-module">
        <table>
          {/* Render table content */}
        </table>
      </div>
    );
  }
}
```

### 3. ModuleSlot

`ModuleSlot` is a component that renders modules within a specific slot in the layout. It retrieves modules from the PageLayout context and renders them in the designated area.

#### Key Features

- **Context Integration**: Automatically retrieves modules from PageLayout context
- **Multiple Module Support**: Can render multiple modules in a single slot
- **Fallback Content**: Supports default content when no modules are provided
- **Debug Indicators**: Visual indicators for development (green borders, status indicators)

#### Basic Usage

```typescript
import { ModuleSlot } from 'rjs-frame';

// In your layout component
<div className="sidebar">
  <ModuleSlot name="sidebar" />
</div>

<div className="main-content">
  <ModuleSlot name="main" />
</div>
```

#### With Fallback Content

```typescript
<ModuleSlot name="optional-section">
  <div className="default-content">
    No modules provided for this section
  </div>
</ModuleSlot>
```

## Complete Example

Here's a complete example showing how all three components work together:

### 1. Define Modules

```typescript
// modules/SidebarModule.tsx
import { PageModule } from 'rjs-frame';

class SidebarModule extends PageModule {
  renderContent(): React.ReactNode {
    return (
      <nav className="sidebar">
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/analytics">Analytics</a></li>
          <li><a href="/users">Users</a></li>
        </ul>
      </nav>
    );
  }
}

// modules/StatsModule.tsx
class StatsModule extends PageModule<{ stats: any[] }> {
  renderContent(): React.ReactNode {
    return (
      <div className="stats-grid">
        {this.props.stats.map(stat => (
          <div key={stat.id} className="stat-card">
            <h3>{stat.title}</h3>
            <div className="value">{stat.value}</div>
          </div>
        ))}
      </div>
    );
  }
}
```

### 2. Create Layout

```typescript
// layouts/DashboardLayout.tsx
import { PageLayout, ModuleSlot } from 'rjs-frame';

class DashboardLayout extends PageLayout {
  renderContent(): React.ReactNode {
    return (
      <div className="dashboard-layout">
        <aside className="sidebar-area">
          <ModuleSlot name="sidebar" />
        </aside>
        <main className="main-area">
          <div className="stats-section">
            <ModuleSlot name="stats" />
          </div>
          <div className="content-section">
            <ModuleSlot name="main" />
          </div>
        </main>
      </div>
    );
  }
}
```

### 3. Use in Application

```typescript
// App.tsx
import { DashboardLayout } from './layouts/DashboardLayout';
import { SidebarModule } from './modules/SidebarModule';
import { StatsModule } from './modules/StatsModule';

function App() {
  const statsData = [
    { id: 1, title: 'Revenue', value: '$12,345' },
    { id: 2, title: 'Users', value: '1,234' },
    { id: 3, title: 'Orders', value: '567' }
  ];

  return (
    <DashboardLayout
      modules={{
        sidebar: <SidebarModule />,
        stats: <StatsModule stats={statsData} />
      }}
    >
      <div className="main-content">
        <h1>Welcome to Dashboard</h1>
        <p>This content goes in the 'main' slot automatically.</p>
      </div>
    </DashboardLayout>
  );
}
```

## Advanced Patterns

### Multiple Modules in One Slot

```typescript
<DashboardLayout
  modules={{
    sidebar: [
      <NavigationModule />,
      <UserProfileModule />,
      <QuickActionsModule />
    ],
    main: <MainContentModule />
  }}
/>
```

### Conditional Module Rendering

```typescript
function App() {
  const user = useUser();
  
  return (
    <DashboardLayout
      modules={{
        sidebar: <SidebarModule />,
        stats: user.role === 'admin' ? <AdminStatsModule /> : <UserStatsModule />,
        actions: user.permissions.includes('manage') && <AdminActionsModule />
      }}
    >
      <MainContent />
    </DashboardLayout>
  );
}
```

### Dynamic Module Loading

```typescript
function App() {
  const [modules, setModules] = useState({});
  
  useEffect(() => {
    // Load modules based on user preferences or route
    const loadModules = async () => {
      const sidebarModule = await import('./modules/SidebarModule');
      const statsModule = await import('./modules/StatsModule');
      
      setModules({
        sidebar: <sidebarModule.default />,
        stats: <statsModule.default />
      });
    };
    
    loadModules();
  }, []);
  
  return (
    <DashboardLayout modules={modules}>
      <MainContent />
    </DashboardLayout>
  );
}
```

## Development Features

### Debug Indicators

In development mode, rjs-frame provides visual indicators to help with debugging:

- **Green Borders**: ModuleSlot components have green borders to show their boundaries
- **Yellow Status Indicators**: Small yellow circles indicate the status of each slot
- **Module Count**: Visual indication of how many modules are in each slot

These indicators are automatically included when you import the rjs-frame styles:

```typescript
// In your main.tsx or App.tsx
import 'rjs-frame/dist/style.css';
```

### Best Practices

1. **Module Naming**: Use descriptive names for module slots (e.g., 'sidebar', 'header', 'stats')
2. **Module Reusability**: Design modules to be as reusable as possible
3. **Props Interface**: Always define TypeScript interfaces for module props
4. **Error Boundaries**: Wrap modules in error boundaries for better error handling
5. **Performance**: Use React.memo() for modules that don't need frequent re-renders

### TypeScript Support

rjs-frame is built with TypeScript and provides full type safety:

```typescript
interface CustomModuleProps {
  title: string;
  data: any[];
  onAction?: (id: string) => void;
}

class CustomModule extends PageModule<CustomModuleProps> {
  // TypeScript will enforce prop types
  renderContent(): React.ReactNode {
    // Implementation
  }
}
```

## API Reference

### PageLayout

```typescript
abstract class PageLayout<P extends PageLayoutProps = PageLayoutProps> extends React.Component<P> {
  protected get modules(): Record<string, React.ReactNode[]>;
  protected onMount(): void;
  protected onUnmount(): void;
  abstract renderContent(): React.ReactNode;
}
```

### PageModule

```typescript
abstract class PageModule<P = {}> extends React.Component<P> {
  readonly moduleId: string;
  protected onMount(): void;
  protected onUnmount(): void;
  abstract renderContent(): React.ReactNode;
}
```

### ModuleSlot

```typescript
interface ModuleSlotProps {
  name: string;
  children?: React.ReactNode;
}

function ModuleSlot({ name, children }: ModuleSlotProps): React.ReactNode;
```

This documentation provides a comprehensive guide to using rjs-frame's modular architecture. The combination of PageLayout, PageModule, and ModuleSlot creates a powerful system for building maintainable and flexible React applications. 