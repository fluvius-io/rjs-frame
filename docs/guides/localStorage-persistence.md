# LocalStorage Persistence in rjs-frame

This guide explains how rjs-frame automatically persists certain state data to localStorage and provides APIs for managing persistent global and module state.

## Overview

rjs-frame automatically persists two key parts of the AppState to localStorage:

- **AppSettings**: Application-wide settings and preferences
- **ModuleState**: Module-specific data and configurations

This ensures that user preferences, debug settings, and module configurations survive page reloads and browser sessions.

## Automatic Persistence

### What Gets Saved

```typescript
// localStorage keys used by rjs-frame
'rjs-frame:appSettings'  // Contains global application state
'rjs-frame:moduleState'  // Contains module-specific state
```

### When Data is Saved

State is automatically saved to localStorage whenever:
- `appSettings` changes in the AppState
- `moduleState` changes in the AppState
- The state update is processed through `updateAppState()`

### Default State Structure

```typescript
// Default appSettings
{
  _id: '',
  xRay: false
}

// Default moduleState  
{}
```

## XRay Debug Mode

The XRay flag is now stored in appSettings and persists across browser sessions.

### Using XRay Mode

#### Keyboard Shortcuts
- Press `Option+O` / `Win+O` to open PageLayout Options dialog, then toggle "Enable X-Ray Mode" checkbox
- Press `Option+X` / `Win+X` for quick X-Ray toggle without opening dialog
- Setting is automatically saved to localStorage

#### Programmatic Access

```typescript
import { getXRayEnabled, setXRayEnabled } from 'rjs-frame';

// Check current XRay status
const isEnabled = getXRayEnabled(); // boolean

// Enable/disable XRay mode
setXRayEnabled(true);   // Enable
setXRayEnabled(false);  // Disable
```

#### PageLayout Prop (Backward Compatibility)

```typescript
// Still works for initial setup
<PageLayout xRay={true}>
  {/* ... */}
</PageLayout>
```

**Note**: The prop only sets the initial value. Once the user toggles XRay via the UI, the localStorage value takes precedence.

### XRay Visual Indicators

When XRay mode is enabled:
- **Page Layout**: Red border with hover effects
- **Module Slots**: Blue borders with status indicators
- **Page Modules**: Green borders with hover effects

## AppSettings API

### Basic Operations

```typescript
import { 
  getAppSettings,
  setAppSettings,
  updateAppSettings
} from 'rjs-frame';

// Read global state
const theme = getAppSettings('theme', 'light'); // with default value
const userPrefs = getAppSettings('userPreferences'); // without default

// Set single value
setAppSettings('theme', 'dark');
setAppSettings('language', 'en-US');

// Update multiple values at once
updateAppSettings({
  theme: 'dark',
  language: 'es',
  userPreferences: {
    sidebar: 'collapsed',
    notifications: true
  }
});
```

### TypeScript Support

```typescript
// Type-safe global state access
const theme = getAppSettings<'light' | 'dark'>('theme', 'light');
const userSettings = getAppSettings<UserSettings>('userSettings', {});

// Setting typed values
setAppSettings<string>('currentUser', 'john.doe');
setAppSettings<UserPreferences>('preferences', {
  darkMode: true,
  language: 'en'
});
```

### Common Use Cases

```typescript
// User preferences
setAppSettings('sidebarCollapsed', true);
setAppSettings('defaultPageSize', 20);
setAppSettings('userTimezone', 'America/New_York');

// Application settings
setAppSettings('debugMode', true);
setAppSettings('apiEnvironment', 'staging');
setAppSettings('featureFlags', { newDashboard: true });

// Reading with fallbacks
const pageSize = getAppSettings('defaultPageSize', 10);
const isDebug = getAppSettings('debugMode', false);
```

## ModuleState API

ModuleState is primarily used by PageModule components to persist their internal state.

### Structure

```typescript
// ModuleState structure
{
  [moduleId: string]: {
    component: string;           // Required: module component name
    [key: string]: any;         // Optional: module-specific data
  }
}
```

### API Usage

```typescript
import { updateModuleState } from 'rjs-frame';

// Update module state
updateModuleState({
  'sidebar-module-123': {
    component: 'SidebarModule',
    isExpanded: true,
    selectedTab: 'settings',
    lastUpdated: Date.now()
  },
  'data-table-456': {
    component: 'DataTableModule',
    sortColumn: 'name',
    sortDirection: 'asc',
    pageSize: 25
  }
});
```

### PageModule Integration

PageModule components automatically manage their moduleState:

```typescript
class CustomModule extends PageModule {
  componentDidMount() {
    super.componentDidMount();
    
    // Module state is automatically created with component info
    // You can access it via this.state.appState.moduleState[this.moduleId]
  }
  
  saveCustomData() {
    // Update module-specific state
    updateModuleState({
      [this.moduleId]: {
        component: this.constructor.name,
        customData: 'your data here',
        timestamp: Date.now()
      }
    });
  }
}
```

## Error Handling

### SSR Safety

All localStorage operations are safely handled in SSR environments:

```typescript
// Automatically returns defaults if window is undefined
const theme = getAppSettings('theme', 'light'); // Works in SSR
```

### Error Recovery

If localStorage is unavailable or corrupted:
- Warnings are logged to console
- Default values are returned
- Application continues to function normally

```typescript
// Example error handling
try {
  setAppSettings('key', 'value');
} catch (error) {
  console.warn('Failed to save to localStorage:', error);
  // App continues with in-memory state
}
```

## Best Practices

### 1. Use Meaningful Keys

```typescript
// Good
setAppSettings('userPreferences', preferences);
setAppSettings('debugMode', true);

// Avoid
setAppSettings('x', value);
setAppSettings('temp', data);
```

### 2. Provide Default Values

```typescript
// Always provide sensible defaults
const theme = getAppSettings('theme', 'light');
const pageSize = getAppSettings('pageSize', 10);
```

### 3. Type Your Data

```typescript
interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

const prefs = getAppSettings<UserPreferences>('userPreferences', {
  theme: 'light',
  language: 'en',
  notifications: true
});
```

### 4. Batch Updates When Possible

```typescript
// Efficient - single localStorage write
updateAppSettings({
  theme: 'dark',
  language: 'es',
  sidebarCollapsed: true
});

// Less efficient - multiple localStorage writes
setAppSettings('theme', 'dark');
setAppSettings('language', 'es');
setAppSettings('sidebarCollapsed', true);
```

## Migration Guide

### From Local Component State

```typescript
// Before: Component state
class MyLayout extends PageLayout {
  state = { xRayEnabled: false };
  
  toggleXRay = () => {
    this.setState({ xRayEnabled: !this.state.xRayEnabled });
  };
}

// After: Global state
import { getXRayEnabled, setXRayEnabled } from 'rjs-frame';

class MyLayout extends PageLayout {
  toggleXRay = () => {
    setXRayEnabled(!getXRayEnabled());
  };
}
```

### From Custom localStorage Implementation

```typescript
// Before: Manual localStorage
const saveUserPrefs = (prefs) => {
  localStorage.setItem('userPrefs', JSON.stringify(prefs));
};

const loadUserPrefs = () => {
  const stored = localStorage.getItem('userPrefs');
  return stored ? JSON.parse(stored) : {};
};

// After: rjs-frame global state
import { setAppSettings, getAppSettings } from 'rjs-frame';

const saveUserPrefs = (prefs) => {
  setAppSettings('userPreferences', prefs);
};

const loadUserPrefs = () => {
  return getAppSettings('userPreferences', {});
};
```

## Debugging

### Inspect localStorage

You can view the persisted state in browser DevTools:

1. Open DevTools (F12)
2. Go to Application/Storage tab
3. Select Local Storage
4. Look for keys:
   - `rjs-frame:appSettings`
   - `rjs-frame:moduleState`

### Clear Stored State

```typescript
// Clear specific global state
setAppSettings('key', undefined);

// Or manually clear localStorage
localStorage.removeItem('rjs-frame:appSettings');
localStorage.removeItem('rjs-frame:moduleState');
```

### Debug State Changes

```typescript
import { appStateStore } from 'rjs-frame';

// Subscribe to all state changes
const unsubscribe = appStateStore.subscribe((state) => {
  console.log('Global State:', state.appSettings);
  console.log('Module State:', state.moduleState);
});

// Don't forget to unsubscribe
unsubscribe();
```

## Examples

### Complete Theme System

```typescript
import { getAppSettings, setAppSettings } from 'rjs-frame';

type Theme = 'light' | 'dark' | 'auto';

export class ThemeManager {
  static getTheme(): Theme {
    return getAppSettings<Theme>('theme', 'light');
  }
  
  static setTheme(theme: Theme) {
    setAppSettings('theme', theme);
    document.body.className = `theme-${theme}`;
  }
  
  static initializeTheme() {
    const theme = this.getTheme();
    this.setTheme(theme);
  }
}

// Usage in your app
ThemeManager.initializeTheme();
ThemeManager.setTheme('dark'); // Persisted automatically
```

### User Preferences System

```typescript
import { getAppSettings, setAppSettings, updateAppSettings } from 'rjs-frame';

interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}

export class UserPreferencesManager {
  private static readonly defaultPrefs: UserPreferences = {
    language: 'en-US',
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    notifications: {
      email: true,
      push: true,
      desktop: false
    }
  };
  
  static getPreferences(): UserPreferences {
    return getAppSettings<UserPreferences>('userPreferences', this.defaultPrefs);
  }
  
  static updatePreferences(updates: Partial<UserPreferences>) {
    const current = this.getPreferences();
    const updated = { ...current, ...updates };
    setAppSettings('userPreferences', updated);
  }
  
  static updateNotificationSettings(notifications: Partial<UserPreferences['notifications']>) {
    const current = this.getPreferences();
    updateAppSettings({
      userPreferences: {
        ...current,
        notifications: {
          ...current.notifications,
          ...notifications
        }
      }
    });
  }
}

// Usage
UserPreferencesManager.updatePreferences({ language: 'es' });
UserPreferencesManager.updateNotificationSettings({ email: false });
```

This localStorage persistence system provides a robust foundation for maintaining user preferences and application state across browser sessions while maintaining clean, type-safe APIs. 
