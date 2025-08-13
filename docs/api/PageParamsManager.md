# PageParams Manager Integration

The PageParams manager component has been moved from application-specific modules to the core rjs-frame library and integrated into the PageLayoutOptions dialog.

## What Changed

### ✅ **Moved to rjs-frame Core**
- **From**: `app/rjs-demo/src/modules/ArgumentsModule.tsx` (PageModule)
- **To**: `lib/rjs-frame/src/components/ArgumentsManager.tsx` (Regular Component)

### ✅ **Integrated into PageLayoutOptions**
- PageParams manager is now embedded as a section in the PageLayoutOptions dialog
- Access via `Ctrl+O` keyboard shortcut
- No longer requires separate module slots or imports

### ✅ **Reverted rjs-shadcn Changes**
- Removed ArgumentsModule from rjs-shadcn
- Reverted DashboardLayout to original structure
- Removed temporary UI components (Input, Label, Badge, Alert)

### ✅ **Updated rjs-demo**
- Removed ArgumentsModule usage from HomePage and AdminPage
- Updated documentation to explain new integration
- Added helpful instructions about accessing via PageLayoutOptions

## Features

### **Parameter Validation**
- Real-time validation of parameter names using `[\\w\\d_]+` pattern
- Visual feedback with ✓/✗ indicators
- Error messages explaining validation failures
- Only valid parameters are committed to URLs

### **Boolean Support**
- Parameters without colons become boolean `true`
- Toggle buttons for boolean values
- Convert between string and boolean types
- URL format: `/page/-/string_param:value/boolean_flag`

### **URL Management**
- Central URL management using `updateBrowserLocation()` with appState
- Automatic synchronization with page store
- Support for `/-/` separator format
- Backward compatibility with legacy format

## Usage

### **Access PageParams Manager**
1. Press `Option+O` / `Win+O` to open PageLayoutOptions dialog
2. Scroll to "PageParams" section
3. Add, edit, and validate URL parameters
4. Changes are applied immediately to the browser URL

### **Parameter Name Rules**
- ✅ **Valid**: `filter`, `user_id`, `Tab1`, `debug`, `readonly`
- ❌ **Invalid**: `my-param`, `filter.type`, `user@domain`, `param with spaces`

### **Example URLs**
```
/dashboard/-/filter:active/sort:name/debug
/admin/-/user_id:123/readonly/advanced:true
/search/-/query:javascript/type:tutorial
```

## Technical Details

### **Component Structure**
```typescript
// Regular React component (not PageModule)
export function ArgumentsManager({ onArgumentsChange }: ArgumentsManagerProps)

// Integrated into PageLayoutOptions
<section className="page-layout-arguments">
  <ArgumentsManager />
</section>
```

### **Styling**
- Added comprehensive CSS styles in `RjsFrame.scss`
- Consistent with existing PageLayoutOptions design
- Responsive and accessible interface
- Hover effects and transitions

### **Dependencies**
- Uses existing rjs-frame utilities (`isValidFragmentName`, `FRAGMENT_NAME_PATTERN`)
- Integrates with `appStateStore` for state management
- No external dependencies required

## Benefits

1. **Centralized Access**: Available in all applications using rjs-frame
2. **No Module Slots Required**: No need to allocate sidebar or other slots
3. **Consistent UX**: Same interface across all applications
4. **Reduced Complexity**: No need to import or manage separate modules
5. **Better Integration**: Part of the core debugging/development tools

## Migration

Applications using the old ArgumentsModule can simply remove it:

```typescript
// Before
import { ArgumentsModule } from './modules/ArgumentsModule';
<ArgumentsModule slotName="sidebar" />

// After
// Nothing needed - access via Ctrl+O dialog
```

The PageParams manager is now available by default in all rjs-frame applications through the PageLayoutOptions dialog. 
