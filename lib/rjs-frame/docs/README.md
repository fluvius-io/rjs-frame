# rjs-frame Documentation

Welcome to the rjs-frame documentation! This framework provides a powerful system for building modular React applications with dynamic page layouts.

## Core Components

- **PageLayout**: Abstract base class for creating custom page layouts
- **PageSlot**: Component for rendering modules within layouts  
- **PageModule**: Base class for creating reusable modules
- **PageLayoutOptions**: Debug dialog for inspecting and controlling page layouts

## Getting Started

- **Installation & Setup**: See main README for package installation
- **Quick Start Guide**: Basic usage patterns and examples
- **Basic Components**: See sections below for PageLayout, PageModule, and PageSlot
- **State Management**: Understanding the PageState system
- **Debug Tools**: Using the PageLayoutOptions dialog

## Feature Documentation

### Essential Features
- [PageLayout Options Dialog](./pagelayout-options.md) - Debug dialog with X-Ray mode, layout inspection, and instance management
- [LocalStorage Persistence](./localStorage-persistence.md) - Automatic state persistence including X-Ray settings and global state

### Advanced Features
- **URL Parameter Management** - Reading and managing URL parameters
- **Module State Management** - Per-module state persistence
- **Instance Management** - Singleton pattern for PageLayout components

## Quick Examples

### Basic Layout Structure

```typescript
import { PageLayout, PageSlot } from 'rjs-frame';

export class MyLayout extends PageLayout {
  renderContent() {
    return (
      <div>
        <header>
          <PageSlot name="header" />
        </header>
        <main>
          <PageSlot name="main" />
        </main>
        <aside>
          <PageSlot name="sidebar" />
        </aside>
        <footer>
          <PageSlot name="footer" />
        </footer>
      </div>
    );
  }
}
```

### Creating Modules

```typescript
import { PageModule } from 'rjs-frame';

export class HeaderModule extends PageModule {
  renderContent() {
    return (
      <nav>
        <h1>My App</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    );
  }
}

export class SidebarModule extends PageModule {
  renderContent() {
    return (
      <div>
        <h3>Sidebar</h3>
        <p>Sidebar content goes here</p>
      </div>
    );
  }
}
```

### Using the Layout with Modules

```typescript
import { MyLayout } from './layouts/MyLayout';
import { HeaderModule, SidebarModule } from './modules';

function App() {
  return (
    <MyLayout>
      <HeaderModule slotName="header" />
      <SidebarModule slotName="sidebar" />
    </MyLayout>
  );
}
```

**Key Points:**
- All children of PageLayout must be PageModule instances (or subclasses)
- Each PageModule must have a `slotName` prop specifying which slot it belongs to
- PageLayout automatically validates children and groups them by slot name
- The framework throws descriptive errors for invalid children or missing slotName props

## Key Concepts

### 1. **Modular Architecture**
Build applications as collections of independent, reusable modules that can be composed into different layouts.

### 2. **Automatic Module Discovery**  
PageLayout automatically discovers and organizes modules based on their `slotName` props, eliminating the need to manually pass module configurations.

### 3. **Type Safety**
The framework validates that all children are PageModule instances and that each has a required `slotName` prop, providing compile-time and runtime safety.

### 4. **Debug-First Development**
Built-in debugging tools like the PageLayoutOptions dialog help you understand and troubleshoot your layout structure during development.

### 5. **State Persistence**
Automatic localStorage persistence ensures user preferences and debug settings survive page reloads.

## Common Patterns

### Conditional Module Rendering

```typescript
function App() {
  return (
    <MyLayout>
      <HeaderModule slotName="header" />
      {userIsLoggedIn ? (
        <UserSidebarModule slotName="sidebar" />
      ) : (
        <GuestSidebarModule slotName="sidebar" />
      )}
    </MyLayout>
  );
}
```

### Multiple Modules in Same Slot

```typescript
function App() {
  return (
    <MyLayout>
      <HeaderModule slotName="header" />
      <StatsModule slotName="main" />
      <ChartsModule slotName="main" />
      <TableModule slotName="main" />
    </MyLayout>
  );
}
```

### Layout-Specific Styling

```typescript
export class DashboardLayout extends PageLayout {
  renderContent() {
    return (
      <div className="dashboard-layout">
        <PageSlot name="sidebar" className="dashboard-sidebar" />
        <PageSlot name="main" className="dashboard-main" />
      </div>
    );
  }
}
```

### Debug Mode Integration

```typescript
import { getXRayEnabled, setXRayEnabled } from 'rjs-frame';

// Enable X-Ray mode in development
if (process.env.NODE_ENV === 'development') {
  setXRayEnabled(true);
}
```

## Validation and Error Handling

The framework provides comprehensive validation:

### Invalid Children
```typescript
// ❌ This will throw an error
<MyLayout>
  <div>Invalid - not a PageModule</div>
</MyLayout>
```

### Missing slotName
```typescript
// ❌ This will throw an error
<MyLayout>
  <HeaderModule /> {/* Missing slotName prop */}
</MyLayout>
```

### Reserved Slot Names
```typescript
// ❌ This will throw an error - 'main' is reserved
<MyLayout>
  <HeaderModule slotName="main" />
</MyLayout>
```

### Valid Usage
```typescript
// ✅ This works correctly
<MyLayout>
  <HeaderModule slotName="header" />
  <SidebarModule slotName="sidebar" />
</MyLayout>
```

## Best Practices

1. **Use Descriptive Slot Names**: Choose clear, semantic names for your slots
2. **Keep Modules Focused**: Each module should have a single responsibility  
3. **Leverage Debug Tools**: Use Option+O / Win+O to open the PageLayoutOptions dialog during development
4. **Plan Your Layout Hierarchy**: Think about how modules will be composed before building
5. **Use TypeScript**: The framework provides excellent TypeScript support for catching errors early

## Troubleshooting

- **"All children must be PageModule instances"**: Ensure all children extend PageModule class
- **"Missing required slotName prop"**: Add `slotName="yourSlotName"` to each PageModule
- **"Reserved slot name"**: Avoid using 'main' as a slot name
- **Multiple Instance Warnings**: Ensure only one PageLayout is rendered at a time
- **State Not Persisting**: Verify localStorage is available and not blocked

For detailed examples and advanced usage, see the individual feature documentation linked above.