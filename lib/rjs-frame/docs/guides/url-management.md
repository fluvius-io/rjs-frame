# URL Fragment Management with `/-/` Separator

RJS-Frame now supports a special URL structure that separates page names from URL fragments using the `/-/` separator. This ensures that when adding or updating URL fragments, the page name is never accidentally changed.

## URL Structure

```
/pageName/-/fragment1:value1/fragment2:value2/booleanFlag
```

### Examples

- `/admin/-/filter:active/sort:name/page:1/debug`
- `/dashboard/-/user:123/tab:overview/readonly`
- `/search/-/query:javascript/type:tutorial/advanced`

### Fragment Types

- **String values**: `filter:active`, `sort:name`, `page:1`
- **Boolean flags**: `debug`, `readonly`, `advanced` (no colon, value becomes `true`)
- **Empty values**: `filter:` or `filter` (both become empty string)

### Fragment Name Requirements

**Fragment argument names must match the pattern: `[\w\d_]+`**

✅ **Valid names:**
- `filter`, `sort`, `page`, `debug`, `readonly`
- `user_id`, `item_count`, `is_active`
- `Tab1`, `Section2`, `myParam`

❌ **Invalid names:**
- `my-param` (hyphens not allowed)
- `filter.type` (dots not allowed)
- `user@domain` (special characters not allowed)
- `param with spaces` (spaces not allowed)

Invalid fragment names will be skipped with a console warning and won't appear in the URL or parsed parameters.

## Why Use the `/-/` Separator?

### Problem Solved

Before this feature, URL fragments were directly appended to the page name:
```
/admin/filter:active/sort:name  # Risk: filter could be mistaken for page name
```

With the `/-/` separator, the structure is unambiguous:
```
/admin/-/filter:active/sort:name  # Clear: 'admin' is page name, rest are fragments
```

### Benefits

1. **Page Name Protection**: Impossible to accidentally change the page name when updating fragments
2. **Clear Structure**: Unambiguous separation between page name and fragments
3. **Boolean Flags**: Support for flag-like parameters without values
4. **Name Validation**: Ensures consistent, safe fragment naming with `[\w\d_]+` pattern
5. **Backward Compatibility**: Legacy format still supported
6. **Type Safety**: TypeScript ensures correct usage

## Core Functions

### Parsing URLs

```typescript
import { parseUrlPath } from 'rjs-frame';

const result = parseUrlPath('/admin/-/filter:active/sort:name/debug');
console.log(result);
// {
//   pagePath: 'admin',
//   pageParams: { filter: 'active', sort: 'name', debug: true },
//   linkParams: {}
// }
```

### Building URLs

```typescript
import { buildUrlFromAppState } from 'rjs-frame';

const appState = {
  name: 'admin',
  breadcrumbs: ['admin'],
  pageParams: {
    filter: 'pending',
    sort: 'date',
    page: '2',
    debug: true,
    readonly: false  // false values are omitted from URL
  },
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

const url = buildUrlFromAppState(appState);
console.log(url); // '/admin/-/filter:pending/sort:date/page:2/debug'
```

## Fragment Value Types

### String Values
```typescript
// Input: { filter: 'active', sort: 'name' }
// Output: '/admin/-/filter:active/sort:name'

const parsed = parseUrlPath('/admin/-/filter:active/sort:name');
console.log(parsed.pageParams);
// { filter: 'active', sort: 'name' }
```

### Boolean Flags
```typescript
// Input: { debug: true, readonly: true }
// Output: '/admin/-/debug/readonly'

const parsed = parseUrlPath('/admin/-/debug/readonly');
console.log(parsed.pageParams);
// { debug: true, readonly: true }
```

### Mixed Types
```typescript
// Input: { filter: 'active', debug: true, page: '1' }
// Output: '/admin/-/filter:active/page:1/debug'

const parsed = parseUrlPath('/admin/-/filter:active/page:1/debug');
console.log(parsed.pageParams);
// { filter: 'active', page: '1', debug: true }
```

### Boolean False Handling
```typescript
// Boolean false values are omitted from URLs
const appStateWithFalse = {
  name: 'admin',
  breadcrumbs: ['admin'],
  pageParams: {
    filter: 'active',
    debug: true,
    readonly: false  // This will not appear in the URL
  },
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

const url = buildUrlFromAppState(appStateWithFalse);
console.log(url); // '/admin/-/filter:active/debug'
```

## Safe Fragment Updates

These functions ensure the page name is never accidentally changed:

### Update All Fragments

```typescript
import { updateUrlFragments } from 'rjs-frame';

// Current URL: /admin/-/filter:active/sort:name
const newUrl = updateUrlFragments({
  filter: 'pending',
  sort: 'date',
  page: '2'
});
// Result: /admin/-/filter:pending/sort:date/page:2
// ✅ Page name 'admin' preserved
```

### Add/Update Single Fragment

```typescript
import { addUrlFragment } from 'rjs-frame';

// Current URL: /admin/-/filter:active/sort:name
const newUrl = addUrlFragment('view', 'grid');
// Result: /admin/-/filter:active/sort:name/view:grid
// ✅ Page name and existing fragments preserved
```

### Remove Single Fragment

```typescript
import { removeUrlFragment } from 'rjs-frame';

// Current URL: /admin/-/filter:active/sort:name
const newUrl = removeUrlFragment('filter');
// Result: /admin/-/sort:name
// ✅ Page name preserved, only 'filter' removed
```

## Page Store Integration

These functions work with the page store and automatically update the browser URL:

### Add Single Parameter

```typescript
import { addSlotParam } from 'rjs-frame';

addSlotParam('tab', 'settings');
// ✅ Adds tab:settings while preserving page name and other params
// ✅ Automatically updates browser URL
// ✅ Updates page store state
```

### Remove Single Parameter

```typescript
import { removeSlotParam } from 'rjs-frame';

removeSlotParam('filter');
// ✅ Removes filter param while preserving page name
// ✅ Automatically updates browser URL
// ✅ Updates page store state
```

### Update Multiple Parameters

```typescript
import { updatePageParamsPartial } from 'rjs-frame';

updatePageParamsPartial({ 
  sort: 'date', 
  page: '1',
  view: 'list'
});
// ✅ Updates only specified params while preserving page name
// ✅ Automatically updates browser URL
// ✅ Updates page store state
```

### Update Browser URL Using Central Method

```typescript
import { updateBrowserLocation, appStateStore } from 'rjs-frame';

// Get current page state and update it
const currentState = appStateStore.get();
const updatedState = {
  ...currentState,
  pageParams: { 
    status: 'active', 
    view: 'list' 
  }
};

updateBrowserLocation(updatedState);
// ✅ Updates URL using central method with appState
// ✅ Handles both path and fragment updates intelligently
// ✅ Provides proper history management
```

## Migration Guide

### From Legacy Format

If you're currently using the legacy format:

```typescript
// Legacy format (still works)
parseUrlPath('/admin/filter:active/sort:name');

// New format (recommended)
parseUrlPath('/admin/-/filter:active/sort:name');
```

### Updating Existing Code

**Before (unsafe):**
```typescript
// ❌ Risk of accidentally changing page name
window.history.replaceState(null, '', `/admin/filter:${newFilter}`);
```

**After (safe):**
```typescript
// ✅ Page name always preserved
addSlotParam('filter', newFilter);
```

## Advanced Usage

### Custom URL Building

```typescript
import { buildUrlFromAppState, URL_FRAGMENT_SEPARATOR } from 'rjs-frame';

// Build complex URLs
const complexAppState = {
  name: 'search',
  breadcrumbs: ['search'],
  pageParams: {
    query: 'react hooks',
    filters: 'language=javascript&difficulty=intermediate',
    page: '1'
  },
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

const complexUrl = buildUrlFromAppState(complexAppState);
// Result: /search/-/query:react hooks/filters:language=javascript&difficulty=intermediate/page:1
```

### Manual URL Parsing

```typescript
import { parseUrlPath, URL_FRAGMENT_SEPARATOR } from 'rjs-frame';

// Check if URL uses new format
const url = '/admin/-/filter:active';
const hasNewFormat = url.includes(URL_FRAGMENT_SEPARATOR);
console.log(hasNewFormat); // true
```

### Fragment Name Validation

```typescript
import { isValidFragmentName, FRAGMENT_NAME_PATTERN, buildUrlFromAppState } from 'rjs-frame';

// Validate fragment names before using them
console.log(isValidFragmentName('filter'));       // true
console.log(isValidFragmentName('user_id'));      // true
console.log(isValidFragmentName('my-param'));     // false (hyphen not allowed)
console.log(isValidFragmentName('filter.type'));  // false (dot not allowed)

// Check the pattern directly
console.log(FRAGMENT_NAME_PATTERN); // /^[\w\d_]+$/

// Example: Validate parameters before building URL
const params = {
  'valid_param': 'value1',
  'invalid-param': 'value2'  // This will be skipped with warning
};

const appStateWithMixed = {
  name: 'admin',
  breadcrumbs: ['admin'],
  pageParams: params,
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

const url = buildUrlFromAppState(appStateWithMixed);
// Console warning: [RJS-Frame] Invalid fragment name "invalid-param"...
// Result: '/admin/-/valid_param:value1'
```

## Edge Cases

### Empty Fragments

```typescript
const emptyAppState = {
  name: 'admin',
  breadcrumbs: ['admin'],
  pageParams: {},
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

buildUrlFromAppState(emptyAppState); // '/admin'
```

### Empty Page Name

```typescript
const noNameAppState = {
  name: '',
  breadcrumbs: [],
  pageParams: { filter: 'active' },
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

buildUrlFromAppState(noNameAppState); // '/'
```

### Complex Fragment Values

```typescript
const complexFragmentState = {
  name: 'search',
  breadcrumbs: ['search'],
  pageParams: {
    query: 'user name with spaces',
    filters: 'status=active&type=premium'
  },
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

buildUrlFromAppState(complexFragmentState);
// '/search/-/query:user name with spaces/filters:status=active&type=premium'
```

## TypeScript Support

All functions include full TypeScript support:

```typescript
import type { PageParams, AppState } from 'rjs-frame';

const params: PageParams = {
  filter: 'active',
  sort: 'name'
};

const appState: AppState = {
  name: 'admin',
  breadcrumbs: ['admin'],
  pageParams: params,
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

const url = buildUrlFromAppState(appState); // Fully typed
```

## Constants

```typescript
import { URL_FRAGMENT_SEPARATOR } from 'rjs-frame';

console.log(URL_FRAGMENT_SEPARATOR); // '/-/'
```

## Best Practices

1. **Always use safe functions**: Use `addSlotParam`, `removeSlotParam`, etc. instead of manual URL manipulation
2. **Prefer new format**: Use the `/-/` separator for new applications
3. **Validate page names**: Ensure page names don't contain the `/-/` separator
4. **Use TypeScript**: Leverage type safety for better development experience
5. **Test edge cases**: Handle empty values, special characters, and complex scenarios

## Error Prevention

### Common Mistakes

❌ **Manual URL construction:**
```typescript
// Don't do this - can break page name
window.location.pathname = `/admin/filter:${filter}`;
```

❌ **Direct state manipulation:**
```typescript
// Don't do this - bypasses safety checks
appStateStore.set({ ...state, name: 'newPage' });
```

### Correct Approaches

✅ **Use safe utility functions:**
```typescript
addSlotParam('filter', filter);
```

✅ **Use official page name setter:**
```typescript
import { setPageName } from 'rjs-frame';
setPageName('newPage');
```

## Testing

When testing URL functionality:

```typescript
import { parseUrlPath, buildUrlFromAppState } from 'rjs-frame';

// Test URL parsing
const testUrl = '/admin/-/filter:active/sort:name';
const parsed = parseUrlPath(testUrl);
expect(parsed.pagePath).toBe('admin');

// Test URL building
const testAppState = {
  name: 'admin',
  breadcrumbs: ['admin'],
  pageParams: { filter: 'active' },
  linkParams: {},
  time: new Date().toISOString(),
  path: '',
  appSettings: {},
  moduleState: {},
  auth: {},
  other: {}
};

const builtUrl = buildUrlFromAppState(testAppState);
expect(builtUrl).toBe('/admin/-/filter:active');
```

## Summary

The `/-/` separator system provides:

- ✅ **Page name protection**: Never accidentally change page names
- ✅ **Clear structure**: Unambiguous URL format
- ✅ **Fragment validation**: Ensures safe naming with `[\w\d_]+` pattern
- ✅ **Boolean flags**: Support for flag-like parameters without values
- ✅ **Backward compatibility**: Legacy format still works
- ✅ **Type safety**: Full TypeScript support
- ✅ **Store integration**: Automatic browser URL updates
- ✅ **Error prevention**: Safe utility functions prevent common mistakes

Use the safe utility functions to ensure your application's URL handling is robust and maintainable. 
