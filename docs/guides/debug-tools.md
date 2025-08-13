# PageLayout Options Dialog

The PageLayoutOptions dialog is a powerful debugging and inspection tool built into rjs-frame that provides real-time information about your page layout and debugging controls.

## Overview

The PageLayoutOptions dialog is a full-screen overlay that shows:
- Layout information and statistics
- Module slot details and content
- Debug controls (X-Ray mode)
- Instance management information

## Accessing the Dialog

### Keyboard Shortcuts
- **`Option+O`** / **`Win+O`**: Toggle the PageLayoutOptions dialog
- **`Option+X`** / **`Win+X`**: Quick toggle X-Ray mode without opening dialog
- **`Esc`**: Close the dialog

### Automatic Singleton Management

Only one PageLayout instance can be active at a time. The dialog:
- Only appears for the active PageLayout instance
- Shows warnings if multiple instances are detected
- Automatically manages cleanup when instances change

## Dialog Sections

### 1. Layout Information

Displays key metrics about your current layout:

```
Layout ID: GenericLayout
Module Slots: 3
Total Modules: 2
Instance Status: Active
```

- **Layout ID**: The class name of your PageLayout component
- **Module Slots**: Number of different module slots defined
- **Total Modules**: Total number of modules across all slots
- **Instance Status**: Whether this instance is the active one

### 2. Module Slots Details

Shows a breakdown of each module slot and its content:

```
header: 1 module(s)
sidebar: 0 module(s)  
main: 1 module(s)
footer: 0 module(s)
```

This helps you understand:
- Which slots have content
- How many modules are in each slot
- Empty slots that might need attention

### 3. Debug Options

#### X-Ray Mode Toggle

```
☑ Enable X-Ray Mode
Shows visual borders around layout components for debugging
```

**X-Ray Mode Features:**
- **Page Layout**: Red semi-transparent overlay borders with hover effects
- **Page Slots**: Blue semi-transparent overlay borders with slot name and parameter information
- **Page Modules**: Green semi-transparent overlay borders with hover effects
- **Non-intrusive**: Uses CSS pseudo-elements that don't affect element sizes or layout
- **Status Indicators**: Shows slot names and parameters as overlay labels

**Persistence**: X-Ray mode setting is automatically saved to localStorage and persists across browser sessions.

### 4. Warning Messages

If multiple PageLayout instances are detected:

```
⚠️ Warning: 2 PageLayout instances detected. 
Only the active instance responds to keyboard shortcuts.
```

**For Inactive Instances:**
- X-Ray toggle is disabled
- Footer shows "This instance is inactive and won't respond to keyboard shortcuts"
- Dialog clearly indicates the instance status

## Usage Examples

### Basic Integration

```typescript
import { PageLayout, PageSlot } from 'rjs-frame';

export class MyLayout extends PageLayout {
  renderContent() {
    return (
      <div>
        <PageSlot name="header" />
        <PageSlot name="main" />
        <PageSlot name="footer" />
      </div>
    );
  }
}

// The dialog is automatically available - just press Ctrl+O
```

### Quick X-Ray Toggle

For rapid debugging, you can toggle X-Ray mode directly without opening the full dialog:

```typescript
// Just press Option+X / Win+X
// No need to open the PageLayoutOptions dialog
// The X-Ray mode will toggle immediately and persist to localStorage
```

**Benefits of Quick Toggle:**
- **Faster workflow**: No need to open and navigate the dialog
- **Persistent setting**: Changes are automatically saved to localStorage
- **Visual feedback**: Immediate visual indication when X-Ray mode activates
- **Cross-platform**: Works consistently on Mac, Windows, and Linux

### Custom Styling with X-Ray

```css
/* Your layout styles */
.page-layout.x-ray {
  /* X-Ray mode uses pseudo-elements for non-intrusive overlays */
  
  .page-slot {
    /* Page slots get blue overlay borders via ::before pseudo-element */
    /* Slot information displayed via ::after pseudo-element */
  }
  
  .page-module {
    /* Page modules get green overlay borders via ::before pseudo-element */
  }
}

/* Custom slot styling that works with X-Ray */
.header-slot {
  background: #f8f9fa;
  
  .x-ray & {
    background: #e3f2fd; /* Different color in X-Ray mode */
    
    /* You can customize the X-Ray overlays */
    &::after {
      background-color: rgba(33, 150, 243, 0.9) !important;
      color: white !important;
    }
  }
}
```

### Programmatic X-Ray Control

```typescript
import { getXRayEnabled, setXRayEnabled } from 'rjs-frame';

// Check if X-Ray is enabled
if (getXRayEnabled()) {
  console.log('X-Ray mode is active');
}

// Toggle X-Ray programmatically
const toggleXRay = () => {
  setXRayEnabled(!getXRayEnabled());
};

// Enable X-Ray for debugging
if (process.env.NODE_ENV === 'development') {
  setXRayEnabled(true);
}
```

## Component Architecture

### PageLayoutOptions Component

The dialog is implemented as a separate `PageLayoutOptions` component with these props:

```typescript
interface PageLayoutOptionsProps {
  isVisible: boolean;
  layoutId: string;
  modules: Record<string, React.ReactNode[]>;
  xRayEnabled: boolean;
  isActiveInstance: boolean;
  totalInstances: number;
  onClose: () => void;
  onToggleXRay: () => void;
}
```

### Integration with PageLayout

```typescript
render() {
  return (
    <PageLayoutContext.Provider value={contextValue}>
      <div className={className}>
        {this.renderContent()}
      </div>
      <PageLayoutOptions
        isVisible={this.state.showOptions && PageLayout.activeInstance === this}
        layoutId={this.layoutId}
        modules={this.modules}
        xRayEnabled={xRayEnabled}
        isActiveInstance={PageLayout.activeInstance === this}
        totalInstances={PageLayout.instanceCount}
        onClose={this.closeOptions}
        onToggleXRay={this.toggleXRay}
      />
    </PageLayoutContext.Provider>
  );
}
```

## Styling and Customization

### CSS Classes

The dialog uses these CSS classes that can be customized:

```css
.page-layout-options-overlay     /* Full-screen overlay */
.page-layout-options-dialog      /* Main dialog container */
.page-layout-options-header      /* Dialog header */
.page-layout-options-content     /* Main content area */
.page-layout-options-footer      /* Dialog footer */

.page-layout-info               /* Layout information section */
.page-layout-controls           /* Debug controls section */
.info-grid                      /* Grid layout for info items */
.info-item                      /* Individual info items */
.warning-message                /* Warning message styling */
.inactive-warning               /* Inactive instance warnings */
```

### Animations

The dialog includes smooth animations:

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    transform: translateY(-20px) scale(0.95);
    opacity: 0;
  }
  to { 
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
```

## Best Practices

### 1. Development Workflow

```typescript
// Enable X-Ray during development
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    setXRayEnabled(true);
  }
}, []);
```

### 2. Page Slot Organization

Use descriptive names for page slots to make the dialog more useful:

```typescript
// Good - clear slot names
<PageSlot name="main-content" />
<PageSlot name="sidebar-navigation" />
<PageSlot name="footer-links" />

// Less helpful - generic names
<PageSlot name="slot1" />
<PageSlot name="content" />
<PageSlot name="bottom" />
```

### 3. Layout Documentation

The dialog serves as live documentation for your layout structure. Keep slot names consistent with your design system.

## Troubleshooting

### Dialog Won't Open

1. **Check Console**: Look for JavaScript errors
2. **Multiple Instances**: Ensure only one PageLayout is rendered
3. **Event Listeners**: Verify the active instance is set correctly

```typescript
// Debug active instance
console.log('Active Instance:', PageLayout.getActiveInstanceInfo());
```

### X-Ray Mode Not Working

1. **CSS Loading**: Ensure rjs-frame styles are loaded
2. **Class Application**: Check if `.x-ray` class is applied to page-layout
3. **State Persistence**: Verify localStorage is working

```typescript
// Debug X-Ray state
console.log('X-Ray Enabled:', getXRayEnabled());
console.log('localStorage:', localStorage.getItem('rjs-frame:appSettings'));
```

### Performance Considerations

The dialog is lightweight and only renders when visible. However:

- Page slot counting is done on each render
- Multiple instances create overhead for event listeners
- Large module trees may slow down the info display

## Security Considerations

The dialog exposes layout structure information which is generally safe but consider:

- Don't expose sensitive module data in slot names
- Consider disabling in production if needed
- The localStorage persistence uses client-side storage only

## Integration with Development Tools

### Browser DevTools Integration

The dialog complements browser DevTools by:
- Providing rjs-frame specific information
- Offering visual debugging via X-Ray mode
- Showing live page slot statistics
- Displaying instance management information

### CI/CD Integration

```typescript
// Automated testing
it('should have correct page slots', () => {
  render(<MyLayout />);
  
  // Programmatically access layout info
  const info = PageLayout.getActiveInstanceInfo();
  expect(info.activeInstance).toBe('MyLayout');
});
```

This PageLayoutOptions dialog provides an essential debugging tool that grows more valuable as your application's layout complexity increases. 
