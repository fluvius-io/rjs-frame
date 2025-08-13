# Browser History Titles

RJS-Frame now automatically generates meaningful page titles for browser history entries, making it easier to identify pages when using the browser's back/forward navigation.

## How It Works

When you navigate to different pages or update page parameters, RJS-Frame automatically:

1. **Updates the browser tab title** (`document.title`)
2. **Sets descriptive titles for history entries** (visible in browser back/forward dropdown)
3. **Stores page state data** in the history entry for potential future use

## Title Format Examples

### Basic Page Paths
- `/home` → "Home"
- `/admin` → "Admin" 
- `/dashboard/settings` → "Dashboard > Settings"
- `/users/profile/edit` → "Users > Profile > Edit"

### Pages with Parameters
- `/admin/-/debug:true` → "Admin (debug)"
- `/admin/-/debug:false` → "Admin (!debug)"
- `/admin/-/filter:active/page:2` → "Admin (filter:active, page:2)"
- `/dashboard/settings/-/view:grid/sort:name` → "Dashboard > Settings (view:grid, sort:name)"

## Multi-Segment Path Support

The library now properly handles multi-segment page paths:

```javascript
import { buildUrlPath, generatePageTitle } from 'rjs-frame';

// Multi-segment paths are supported
buildUrlPath('dashboard/settings', { theme: 'dark' })
// Returns: "/dashboard/settings/-/theme:dark"

generatePageTitle('users/profile/edit', { tab: 'security' })
// Returns: "Users > Profile > Edit (tab:security)"
```

## Path Normalization

The library automatically normalizes paths by:
- Removing leading and trailing slashes
- Collapsing consecutive slashes
- Handling empty segments gracefully

```javascript
// These all produce the same result:
buildUrlPath('admin/dashboard', {})
buildUrlPath('/admin/dashboard/', {})
buildUrlPath('//admin//dashboard//', {})
// All return: "/admin/dashboard"
```

## History State Data

Each history entry stores structured data that can be accessed via the `popstate` event:

```javascript
window.addEventListener('popstate', (event) => {
  if (event.state) {
    console.log('Page name:', event.state.pageName); // Logical page identifier
    console.log('Page params:', event.state.params);
    console.log('Link params:', event.state.linkParams);
  }
});
```

**Note**: History entries use `pageName` (the logical page identifier, usually the first path segment) rather than the full `pagePath` for cleaner history labels.

## Page Name vs Page Path

The library maintains a clear separation between:

- **`pageName`**: Logical page identifier stored in state (e.g., "Settings", "User Profile")
- **`pagePath`**: URL path structure for routing (e.g., "dashboard/settings", "users/profile/edit")

These are **completely independent** and can be set separately:

```javascript
// Set the logical page name (for history labels and state)
setPageName('Settings');

// Set the URL path structure (for routing and URLs)
setPagePath('dashboard/settings/advanced');

// Result:
// • Browser history shows: "Settings"
// • URL shows: "/dashboard/settings/advanced"
// • Page state: { name: "Settings", ... }
```

### Independent Control

```javascript
// You can have any combination:

// Simple case - both aligned
setPageName('Admin');
setPagePath('admin');

// Complex case - different concepts
setPageName('User Profile'); 
setPagePath('users/profile/edit');

// Deep URLs with simple names
setPageName('Analytics');
setPagePath('dashboard/reports/analytics/monthly');
```

### Functions

- **`setPageName(name)`**: Sets only the logical page identifier in state
- **`setPagePath(path)`**: Sets only the URL path structure (uses stored pageName for history)
- **Combined usage**: Use both functions together for full control

## Manual Title Generation

You can also manually generate titles using the utility functions:

```javascript
import { generatePageTitle, updateDocumentTitle } from 'rjs-frame';

// Generate a title with multi-segment path
const title = generatePageTitle('dashboard/analytics', { view: 'monthly', year: '2024' });
console.log(title); // "Dashboard > Analytics (view:monthly, year:2024)"

// Update document title
updateDocumentTitle('Custom Page Title');
```

## API Updates

### Updated Functions
- `setPageName(pageName: string)` - Sets the logical page identifier (independent of URL)
- `setPagePath(pagePath: string)` - Sets the URL path structure (independent of page name)
- `buildUrlPath(pagePath: string, params)` - Updated to use pagePath parameter

### Complete Independence
Unlike before, `setPageName` and `setPagePath` are now completely separate:
- `setPageName('User Settings')` - Only affects page state and history labels
- `setPagePath('dashboard/config/user')` - Only affects URL structure

## Customization

If you need custom title formatting, you can override the default behavior by calling `updateDocumentTitle()` after your navigation updates:

```javascript
import { updatePageParams, updateDocumentTitle } from 'rjs-frame';

// Update page params (this sets default title)
updatePageParams({ filter: 'completed' });

// Override with custom title
updateDocumentTitle('My Custom Title');
```

## Browser Compatibility

This feature works in all modern browsers that support the HTML5 History API. The title parameter in `pushState`/`replaceState` is supported by all major browsers, though some may not display it in all contexts. 