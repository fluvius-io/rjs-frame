# RJS-Frame Migration Guide

## Breadcrumb System Updates

### PageLayout Prop Change: `pageName` → `title`

**Before:**
```typescript
<MyLayout pageName="Dashboard">
  <MyModule />
</MyLayout>
```

**After:**
```typescript
<MyLayout title="Dashboard">
  <MyModule />
</MyLayout>
```

### Global State Storage

Breadcrumbs are now stored in the global `appState` instead of local component state.

**Benefits:**
- ✅ Persist across component remounts
- ✅ Shared across entire application
- ✅ Real-time updates in all components
- ✅ Direct store access for complex scenarios

### New Store Functions

```typescript
import { setBreadcrumbs, pushBreadcrumb, popBreadcrumb, getBreadcrumbs } from 'rjs-frame';

// Set entire breadcrumb path
setBreadcrumbs(['App', 'Users', 'Edit']);

// Add entry
pushBreadcrumb('Settings');

// Remove last entry
popBreadcrumb();

// Get current breadcrumbs
const breadcrumbs = getBreadcrumbs();
```

### Component Methods (Still Available)

PageLayout component methods still work and delegate to the store functions:

```typescript
class MyLayout extends PageLayout {
  handleNavigation = (page: string) => {
    this.pushPage(page);     // Delegates to pushBreadcrumb()
    this.popPage();          // Delegates to popBreadcrumb()
    this.setBreadcrumbs([]); // Delegates to setBreadcrumbs()
    this.getBreadcrumbs();   // Delegates to getBreadcrumbs()
  };
}
```

### Hook Access (Enhanced)

The `usePageLayout()` hook now provides access to global breadcrumb state:

```typescript
const { breadcrumbs, pushPage, popPage, setBreadcrumbs } = usePageLayout();
// breadcrumbs is now always current across all components
```

### Store Subscription

You can now subscribe directly to breadcrumb changes:

```typescript
import { appStateStore } from 'rjs-frame';

const unsubscribe = appStateStore.subscribe((state) => {
  console.log('Breadcrumbs changed:', state.breadcrumbs);
});
```

## AppState Structure

The `AppState` interface now includes breadcrumbs:

```typescript
interface AppState {
  name: string;
  time: string;
  breadcrumbs: string[];  // <-- New: Global breadcrumb storage
  pageParams: PageParams;
  linkParams: LinkParams;
  appSettings: AppSettings;
  moduleState: ModuleState;
  auth: AuthState;
  other: Record<string, any>;
}
```

## Migration Checklist

### 1. Update PageLayout Usage
- [ ] Change `pageName` prop to `title`
- [ ] Test that breadcrumbs initialize correctly

### 2. Review Component Logic
- [ ] Check if any code depends on local breadcrumb state
- [ ] Consider using global store functions for complex scenarios
- [ ] Update any direct state access to use hook or store

### 3. Test Persistence
- [ ] Verify breadcrumbs persist across component remounts
- [ ] Test that all components see consistent breadcrumb state
- [ ] Confirm automatic page name updates work correctly

### 4. Update Documentation
- [ ] Update any internal documentation references
- [ ] Update component prop documentation
- [ ] Consider training team on new capabilities

## Backward Compatibility

✅ **Component methods still work**: `pushPage()`, `popPage()`, etc.  
✅ **Hook interface unchanged**: `usePageLayout()` provides same API  
✅ **Automatic page name updates**: Still works automatically  
⚠️ **Prop name change**: `pageName` → `title` (simple rename)

## Enhanced Capabilities

The new system provides additional capabilities:

### Cross-Component Communication
```typescript
// Component A
pushBreadcrumb('Users');

// Component B (automatically receives update)
const { breadcrumbs } = usePageLayout();
console.log(breadcrumbs); // ['Dashboard', 'Users']
```

### Advanced Navigation Patterns
```typescript
// Set breadcrumbs based on route
const setBreadcrumbsFromRoute = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  setBreadcrumbs(segments.map(capitalize));
};

// Conditional navigation
const navigateConditionally = (page: string) => {
  const current = getBreadcrumbs();
  if (current.length < 3) {
    pushBreadcrumb(page);
  } else {
    setBreadcrumbs([...current.slice(0, 2), page]);
  }
};
```

### State Persistence
```typescript
// Breadcrumbs survive component lifecycles
const MyComponent = () => {
  const { breadcrumbs } = usePageLayout();
  
  useEffect(() => {
    // Component remounted, but breadcrumbs are preserved
    console.log('Preserved breadcrumbs:', breadcrumbs);
  }, []);
  
  return <nav>{breadcrumbs.join(' > ')}</nav>;
};
```

## Support

If you encounter issues during migration:

1. Check the updated documentation in `BREADCRUMBS.md`
2. Review the examples in `examples/breadcrumb-usage.ts`
3. Ensure you're using the latest version of RJS-Frame
4. Test in a development environment before deploying

The migration should be straightforward for most use cases, with the main change being the prop rename from `pageName` to `title`. 
