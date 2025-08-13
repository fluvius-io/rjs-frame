# rjs-frame Documentation

Welcome to the rjs-frame documentation! This framework provides a powerful system for building modular React applications with dynamic page layouts.

Copyright (c) 2025 [River Flow Solutions, Jsc.](https://riverflow.solutions)

## 📚 Documentation Structure

### 🚀 [Getting Started](./guides/)
- **[Quick Start](./guides/quick-start.md)** - Get up and running in minutes
- **[Basic Concepts](./guides/basic-concepts.md)** - Understanding the framework
- **[Project Setup](./guides/project-setup.md)** - Setting up a new project

### 📖 [User Guides](./guides/)
Core features and functionality:
- **[Creating Layouts](./guides/creating-layouts.md)** - Build custom page layouts
- **[Building Modules](./guides/building-modules.md)** - Create reusable components
- **[State Management](./guides/state-management.md)** - Work with page state
- **[URL Management](./guides/url-management.md)** - Handle URL parameters and fragments

Advanced features:
- **[Debug Tools](./guides/debug-tools.md)** - PageLayoutOptions and X-Ray mode
- **[localStorage Persistence](./guides/localStorage-persistence.md)** - State persistence
- **[Breadcrumb Navigation](./guides/breadcrumbs.md)** - Navigation system
- **[Browser History](./guides/browser-history.md)** - History management

### 🔧 [API Reference](./api/)
Complete technical documentation:
- **[Core Components](./api/#core-components)** - PageLayout, PageModule, PageSlot
- **[Store & State](./api/#store--state-management)** - Page store and state types
- **[URL Utilities](./api/#url-management)** - URL parsing and manipulation
- **[Hooks & Contexts](./api/#hooks)** - React hooks and contexts

### 🔄 [Migration Guides](./migration/)
- **[Migration Guide](./migration/MIGRATION.md)** - Upgrading from previous versions

## 🏗️ Core Architecture

### Component Hierarchy
```
PageLayout (base class)
├── PageSlot (renders modules)
│   └── PageModule (your content)
└── PageLayoutOptions (debug dialog)
```

### Key Concepts

1. **🧩 Modular Architecture** - Build apps as collections of independent modules
2. **🔍 Automatic Discovery** - Layouts automatically organize modules by slot name  
3. **🛡️ Type Safety** - Runtime and compile-time validation
4. **🐛 Debug-First** - Built-in debugging tools for development
5. **💾 State Persistence** - Automatic localStorage integration

## ⚡ Quick Example

```typescript
import { PageLayout, PageSlot, PageModule } from 'rjs-frame';

// 1. Create a Layout
class MyLayout extends PageLayout {
  renderContent() {
    return (
      <div>
        <header><PageSlot name="header" /></header>
        <main><PageSlot name="main" /></main>
        <aside><PageSlot name="sidebar" /></aside>
      </div>
    );
  }
}

// 2. Create Modules
class HeaderModule extends PageModule {
  renderContent() {
    return <nav><h1>My App</h1></nav>;
  }
}

class ContentModule extends PageModule {
  renderContent() {
    return <article>Main content here</article>;
  }
}

// 3. Compose Your App
function App() {
  return (
    <MyLayout>
      <HeaderModule slotName="header" />
      <ContentModule slotName="main" />
    </MyLayout>
  );
}
```

## 🛠️ Development Tools

### Debug Mode
Press `Alt+O` (or `Option+O` on Mac) to open the PageLayoutOptions dialog:
- **X-Ray Mode**: Visual debugging with component boundaries
- **Layout Inspector**: See module organization and slot assignments
- **Page State Viewer**: Inspect current page state and parameters
- **Page Params Manager**: Edit URL parameters in real-time

### State Persistence
All user preferences automatically persist across browser sessions:
- X-Ray mode settings
- Debug dialog preferences  
- Global application state
- Module-specific state

## 🎯 Common Use Cases

### Multi-Page Applications
- Dashboard layouts with sidebars and toolbars
- Content management systems
- Admin panels with dynamic modules

### Component Libraries
- Reusable layout templates
- Modular design systems
- Plugin architectures

### Development Tools
- Debug interfaces
- Component inspectors
- State management dashboards

## 📋 Validation & Error Handling

The framework provides comprehensive validation:

### ✅ Valid Usage
```typescript
<MyLayout>
  <HeaderModule slotName="header" />
  <SidebarModule slotName="sidebar" />
</MyLayout>
```

### ❌ Invalid Usage
```typescript
<MyLayout>
  <div>This will throw an error - not a PageModule</div>
</MyLayout>
```

**Error Message:** "All children must be PageModule instances. Found: div."

## 🔗 Integration Examples

### React Router
```typescript
import { useLocation } from 'react-router-dom';
import { initializeFromBrowserLocation } from 'rjs-frame';

function RouteHandler() {
  const location = useLocation();
  
  useEffect(() => {
    initializeFromBrowserLocation(window.location);
  }, [location.pathname, location.search]);
  
  return null;
}
```

### State Management
```typescript
import { appStateStore, updatePageParams } from 'rjs-frame';

// Subscribe to state changes
const unsubscribe = appStateStore.subscribe((state) => {
  console.log('Page state updated:', state);
});

// Update URL parameters
updatePageParams({ filter: 'active', page: '1' });
```

## 🆘 Getting Help

1. **Check the [Guides](./guides/)** for step-by-step instructions
2. **Browse the [API Reference](./api/)** for detailed technical docs
3. **Review [Migration Guides](./migration/)** when upgrading
4. **Use Debug Tools** (`Alt+O`) to inspect your application structure

## 🗂️ File Structure

```
docs/
├── README.md                    # This file - main documentation hub
├── api/                        # Complete API reference
│   ├── README.md              # API index
│   └── *.md                   # Component and utility docs
├── guides/                     # User guides and tutorials
│   ├── README.md              # Guides index  
│   ├── quick-start.md         # Getting started
│   ├── url-management.md      # URL handling
│   ├── breadcrumbs.md         # Navigation
│   ├── debug-tools.md         # Development tools
│   └── *.md                   # Feature guides
└── migration/                  # Version migration guides
    └── MIGRATION.md           # Upgrade instructions
```

This organized structure makes it easy to find exactly what you need, whether you're just getting started or diving deep into advanced features.
