# PageLayout Breadcrumb Management

RJS-Frame's `PageLayout` component includes built-in breadcrumb functionality that automatically manages navigation context and updates the global page name. Breadcrumbs are stored in the global page state and shared across the entire application.

## Overview

The breadcrumb system in `PageLayout` offers:

- **Initial breadcrumb from props**: Set via `title` prop
- **Global state storage**: Breadcrumbs stored in pageState, not local component state
- **Dynamic navigation**: Add/remove breadcrumb entries programmatically  
- **Automatic page name updates**: Global page name stays in sync with breadcrumbs
- **Context integration**: Child components can access breadcrumb methods
- **Type safety**: Full TypeScript support

## Basic Usage

### Setting Initial Breadcrumb

```typescript
import { PageLayout } from 'rjs-frame';

class MyLayout extends PageLayout {
  renderContent() {
    return <div>{this.modules.main}</div>;
  }
}

// Usage with initial breadcrumb
<MyLayout title="Dashboard">
  {/* child modules */}
</MyLayout>
```

When `title` is provided, it becomes the first entry in the breadcrumb array and sets the initial page name.

## Breadcrumb Methods

### Global Functions (Store-based)

```typescript
import { setBreadcrumbs, pushBreadcrumb, popBreadcrumb, getBreadcrumbs } from 'rjs-frame';

// Set entire breadcrumb path
setBreadcrumbs(['App', 'Users', 'John Doe', 'Edit']);

// Add entry to end
pushBreadcrumb('Settings');

// Remove last entry  
popBreadcrumb();

// Get current breadcrumbs
const currentPath = getBreadcrumbs();
```

### Component Methods

The PageLayout component also provides instance methods that delegate to the store functions:

```typescript
// Current breadcrumbs: ['Dashboard']
this.pushPage('Settings');
// Result: ['Dashboard', 'Settings']
// Page name becomes: "Dashboard > Settings"

// Remove last entry
this.popPage();
// Result: ['Dashboard']

// Set entire path
this.setBreadcrumbs(['App', 'Users', 'John Doe', 'Edit']);

// Get current breadcrumbs
const currentPath = this.getBreadcrumbs();
```

## Global State Integration

Breadcrumbs are now stored in the global `pageState`:

```typescript
interface PageState {
  name: string;
  time: string;
  breadcrumbs: string[];  // <-- Breadcrumbs stored here
  pageParams: PageParams;
  linkParams: LinkParams;
  // ... other properties
}
```

This means:
- Breadcrumbs persist across component remounts
- Multiple components can access the same breadcrumb state
- Breadcrumbs are automatically synchronized across the entire application
- State changes trigger updates in all subscribed components

## Access from Child Components

### Using the Hook (Functional Components)

```typescript
import { usePageLayout } from 'rjs-frame';

const NavigationComponent: React.FC = () => {
  const { breadcrumbs, pushPage, popPage, setBreadcrumbs } = usePageLayout();

  return (
    <div>
      <nav>Current Path: {breadcrumbs.join(' > ')}</nav>
      <button onClick={() => pushPage('Users')}>
        Navigate to Users
      </button>
      <button onClick={() => popPage()}>
        Go Back
      </button>
    </div>
  );
};
```

### Direct Store Access

```typescript
import { pageStore, pushBreadcrumb, popBreadcrumb } from 'rjs-frame';

// Access breadcrumbs directly from store
const handleNavigation = (page: string) => {
  pushBreadcrumb(page);
};

// Subscribe to breadcrumb changes
const unsubscribe = pageStore.subscribe((state) => {
  console.log('Breadcrumbs changed:', state.breadcrumbs);
});
```

## Automatic Page Name Updates

The breadcrumb system automatically updates the page name whenever breadcrumbs change:

| Breadcrumbs | Page Name |
|-------------|-----------|
| `[]` | *(no update)* |
| `['Dashboard']` | `"Dashboard"` |
| `['Dashboard', 'Users']` | `"Dashboard > Users"` |
| `['App', 'Admin', 'Settings']` | `"App > Admin > Settings"` |

This ensures the global page state always reflects the current navigation context.

## Component Lifecycle

### Initialization

1. `PageLayout` constructor receives `title` prop
2. Component subscribes to pageStore for breadcrumb updates
3. `componentDidMount` sets initial breadcrumbs from `title` prop if provided
4. Store automatically updates page name

### Updates

1. When `title` prop changes, breadcrumbs reset to `[newTitle]`
2. When breadcrumb store functions are called, all subscribed components update
3. Page name automatically updates via store subscription

### Cleanup

1. Component unsubscribes from pageStore on unmount
2. Breadcrumb state persists in global store

## API Reference

### PageLayout Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string?` | Initial breadcrumb entry |

### Global Store Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `setBreadcrumbs` | `(breadcrumbs: string[]) => void` | Set entire breadcrumb path |
| `pushBreadcrumb` | `(breadcrumb: string) => void` | Add entry to breadcrumbs |
| `popBreadcrumb` | `() => void` | Remove last breadcrumb entry |
| `getBreadcrumbs` | `() => string[]` | Get current breadcrumbs |

### PageLayout Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `pushPage` | `(pageName: string) => void` | Add entry to breadcrumbs |
| `popPage` | `() => void` | Remove last breadcrumb entry |
| `setBreadcrumbs` | `(breadcrumbs: string[]) => void` | Set entire breadcrumb path |
| `getBreadcrumbs` | `() => string[]` | Get current breadcrumbs |

### usePageLayout Hook

Returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `breadcrumbs` | `string[]` | Current breadcrumb array |
| `pushPage` | `(pageName: string) => void` | Add breadcrumb entry |
| `popPage` | `() => void` | Remove last entry |
| `setBreadcrumbs` | `(breadcrumbs: string[]) => void` | Set breadcrumb path |
| `getBreadcrumbs` | `() => string[]` | Get breadcrumbs copy |

## Migration Guide

### From Previous Version

If you were using the previous version with `pageName` prop:

```typescript
// Before
<MyLayout pageName="Dashboard">

// After  
<MyLayout title="Dashboard">
```

### Benefits of Global State

The new global state approach provides:

- **Persistence**: Breadcrumbs survive component remounts
- **Consistency**: Single source of truth across entire application
- **Reactivity**: All components automatically update when breadcrumbs change
- **Accessibility**: Direct store access for complex navigation scenarios

## Summary

The updated breadcrumb system provides:

- ✅ **Global state storage**: Breadcrumbs stored in pageState for persistence
- ✅ **Automatic page name management**: No manual `setPageName()` calls needed
- ✅ **Flexible access**: Both component methods and direct store functions
- ✅ **Cross-component consistency**: All components see the same breadcrumb state
- ✅ **Type safety**: Full TypeScript support
- ✅ **React patterns**: Works with both class and functional components
- ✅ **Easy migration**: Simple prop rename from `pageName` to `title`

This system ensures consistent navigation state management across your entire application while maintaining the simplicity of the component API. 