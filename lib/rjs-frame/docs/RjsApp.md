# RjsApp Component

The `RjsApp` component is the root component for React applications using the `rjs-frame` framework. It provides configuration management, authentication context, and robust error handling with a clear state priority system.

## Overview

- **Configuration Management**: Loads and manages application configuration
- **Authentication Integration**: Fetches and provides authentication context
- **Error Handling**: Graceful error recovery with user-friendly screens
- **Route Integration**: Built-in React Router support
- **Loading States**: Smooth loading experience during initialization
- **Authentication Requirements**: Optional authentication enforcement

## Key Features

### 🔧 Configuration Management

- Loads configuration from local defaults and optional remote sources
- Supports timeout and retry mechanisms for reliable loading
- Provides type-safe configuration access throughout the app

### 🔐 Authentication Integration

- Automatically fetches authentication context from configured endpoints
- Optional authentication requirement enforcement
- Graceful handling of authentication failures

### 📱 State Management with Priority

RjsApp follows a clear state priority system to ensure only one screen is shown at a time:

1. **Loading Screen** (Highest Priority) - During initialization
2. **Error Screen** - When configuration fails to load
3. **Unauthorized Screen** - When `requireAuth=true` but no authentication
4. **App Content** (Lowest Priority) - Normal application content

### 🛡️ Error Handling

- Configuration loading errors with retry functionality
- Network timeout handling
- Authentication failure resilience
- User-friendly error messages with actionable steps

## Basic Usage

### Simple App (No Authentication Required)

```tsx
import { RjsApp, Routes, Route } from "rjs-frame";

function App() {
  return (
    <RjsApp>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </RjsApp>
  );
}
```

### App with Authentication Requirement

```tsx
import { RjsApp, Routes, Route } from "rjs-frame";

function SecureApp() {
  return (
    <RjsApp requireAuth={true}>
      <Routes>
        <Route path="/" element={<ProtectedHome />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </RjsApp>
  );
}
```

When `requireAuth={true}`, users will see an unauthorized screen if they're not authenticated, with a clickable button to redirect to the login page.

### App with Remote Configuration

```tsx
import { RjsApp, Routes, Route } from "rjs-frame";

function ConfigurableApp() {
  return (
    <RjsApp
      configUrl="https://api.example.com/config/app.json"
      requireAuth={true}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </RjsApp>
  );
}
```

## Props API

### RjsAppProps

| Prop          | Type        | Default      | Description                                          |
| ------------- | ----------- | ------------ | ---------------------------------------------------- |
| `children`    | `ReactNode` | **required** | App content (usually Routes)                         |
| `configUrl`   | `string`    | `undefined`  | Optional remote configuration URL                    |
| `requireAuth` | `boolean`   | `false`      | Whether authentication is required to access the app |

## Configuration Structure

### Default Configuration

```json
{
  "auth.loginRedirect": "/api/auth/login",
  "auth.context": "/api/auth/context"
}
```

### Remote Configuration Example

```json
{
  "auth.loginRedirect": "https://auth.myapp.com/login",
  "auth.context": "https://api.myapp.com/auth/me",
  "api.baseUrl": "https://api.myapp.com",
  "features.darkMode": true,
  "analytics.enabled": true
}
```

## State Priority System

The RjsApp component implements a clear state priority system to prevent UI conflicts:

### 1. Loading State (Highest Priority)

```tsx
// Shown while initializing configuration and auth context
<LoadingScreen />
```

### 2. Error State

```tsx
// Shown when configuration fails to load
<ErrorScreen error={configError} />
```

### 3. Unauthorized State

```tsx
// Shown when requireAuth=true but no auth context available
<UnauthorizedScreen loginRedirectUrl={config.get("auth.loginRedirect")} />
```

### 4. App Content (Lowest Priority)

```tsx
// Normal application content
{
  children;
}
```

**Important**: Only one screen is ever shown at a time, ensuring a clean user experience.

## Authentication Scenarios

### Optional Authentication

```tsx
import { RjsApp, useAppConfig } from "rjs-frame";

function FlexibleApp() {
  return (
    <RjsApp requireAuth={false}>
      <HomePage />
    </RjsApp>
  );
}

function HomePage() {
  const { authContext } = useAppConfig();

  return (
    <div>
      <h1>Welcome!</h1>
      {authContext ? (
        <p>Hello, {authContext.user.name__given}!</p>
      ) : (
        <p>
          <a href="/login">Sign in</a> for more features
        </p>
      )}
    </div>
  );
}
```

### Required Authentication

```tsx
import { RjsApp } from "rjs-frame";

function SecureApp() {
  return (
    <RjsApp requireAuth={true}>
      <ProtectedContent />
    </RjsApp>
  );
}

function ProtectedContent() {
  const { authContext } = useAppConfig();

  // authContext is guaranteed to be available here
  return (
    <div>
      <h1>Welcome, {authContext.user.name__given}!</h1>
      <p>This content is only shown to authenticated users.</p>
    </div>
  );
}
```

### Role-Based Access Control

```tsx
import { RjsApp, useAppConfig } from "rjs-frame";

function AdminApp() {
  return (
    <RjsApp requireAuth={true}>
      <AdminPanel />
    </RjsApp>
  );
}

function AdminPanel() {
  const { authContext } = useAppConfig();

  if (!authContext.user.is_super_admin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, {authContext.user.name__given}!</p>
    </div>
  );
}
```

## Error Handling

### Configuration Errors

When remote configuration fails to load:

```tsx
// Shows ErrorScreen with retry functionality
<RjsApp configUrl="https://invalid-url.com/config.json">
  <App />
</RjsApp>
```

### Authentication Errors

When auth context cannot be fetched but `requireAuth=false`:

```tsx
function RobustApp() {
  const { authContext, error } = useAppConfig();

  if (error) {
    return <div>Config error: {error.message}</div>;
  }

  return (
    <div>{authContext ? <AuthenticatedContent /> : <PublicContent />}</div>
  );
}
```

### Network Resilience

The RjsApp automatically handles:

- Network timeouts (10 seconds default)
- Retry attempts (2 retries default)
- Graceful fallback to base configuration
- User-friendly error messages

## Advanced Usage

### Custom Error Handling

```tsx
import { RjsApp, useAppConfig } from "rjs-frame";

function AppWithCustomErrorHandling() {
  return (
    <RjsApp configUrl="/config/app.json">
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </RjsApp>
  );
}

function AppContent() {
  const { error, config } = useAppConfig();

  // Custom error handling logic
  if (error) {
    if (error.message.includes("timeout")) {
      return <SlowNetworkWarning />;
    }
    if (error.message.includes("404")) {
      return <ConfigNotFoundError />;
    }
    return <GenericError error={error} />;
  }

  return <MainApp />;
}
```

### Environment-Specific Configuration

```tsx
// Development
<RjsApp configUrl="/config/development.json">
  <App />
</RjsApp>

// Staging
<RjsApp configUrl="https://api-staging.myapp.com/config">
  <App />
</RjsApp>

// Production
<RjsApp configUrl="https://cdn.myapp.com/config/production.json">
  <App />
</RjsApp>
```

## Integration with useAppConfig Hook

The `useAppConfig` hook provides access to configuration and auth context:

```tsx
import { useAppConfig } from "rjs-frame";

function MyComponent() {
  const {
    config, // ConfigManager instance
    authContext, // AuthContext | null
    isLoading, // boolean
    error, // Error | null
  } = useAppConfig();

  // Access configuration values
  const apiUrl = config?.get("api.baseUrl");
  const loginUrl = config?.get("auth.loginRedirect");

  // Access user information
  const userName = authContext?.user.name__given;
  const isAdmin = authContext?.user.is_super_admin;

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {authContext && <div>Welcome, {userName}!</div>}
    </div>
  );
}
```

## Unauthorized Screen

When `requireAuth={true}` and no authentication is available, users see:

### Visual Elements

- Shield icon indicating security requirement
- Clear "Authentication Required" title
- Explanatory message about sign-in requirement
- Clickable "Sign In to Continue" button

### Behavior

- Button redirects to `config["auth.loginRedirect"]`
- Fully accessible with keyboard navigation
- Responsive design for all screen sizes
- Dark theme support

### Customization

The unauthorized screen automatically uses your app's login URL from configuration. No additional setup required.

## Performance Considerations

### Initialization Optimization

- Configuration loading happens in parallel with component mounting
- Authentication context is fetched immediately after config loads
- Loading states prevent unnecessary re-renders

### Error Recovery

- Failed auth context fetch doesn't break the app (unless `requireAuth=true`)
- Configuration errors are cached to prevent repeated failed requests
- Graceful degradation for network issues

### Memory Management

- Configuration manager is singleton per app instance
- Authentication context is cached until app unmount
- No memory leaks from event listeners or subscriptions

## Best Practices

### 1. Use requireAuth Appropriately

```tsx
// ✅ Good - Public app with optional auth
<RjsApp requireAuth={false}>
  <PublicApp />
</RjsApp>

// ✅ Good - Secure app requiring auth
<RjsApp requireAuth={true}>
  <SecureApp />
</RjsApp>

// ❌ Avoid - Inconsistent requirements
<RjsApp requireAuth={false}>
  <Routes>
    <Route path="/public" element={<PublicPage />} />
    <Route path="/admin" element={<AdminPage />} /> {/* Should require auth */}
  </Routes>
</RjsApp>
```

### 2. Handle Loading States Gracefully

```tsx
function AppContent() {
  const { isLoading, authContext } = useAppConfig();

  // ✅ Good - Show meaningful loading content
  if (isLoading) {
    return <AppSkeleton />;
  }

  // ❌ Avoid - Blank screen during loading
  if (isLoading) return null;
}
```

### 3. Provide Fallbacks for Configuration

```tsx
function AppSettings() {
  const { config } = useAppConfig();

  // ✅ Good - Provide sensible defaults
  const theme = config?.get("ui.theme", "light");
  const apiUrl = config?.get("api.baseUrl", "https://api.example.com");

  // ❌ Avoid - No fallbacks
  const theme = config?.get("ui.theme");
}
```

### 4. Structure Your App Hierarchy

```tsx
// ✅ Good - Clear separation of concerns
<RjsApp requireAuth={true}>
  <AppShell>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </AppShell>
</RjsApp>

// ❌ Avoid - Complex nesting
<RjsApp>
  <div>
    <Header>
      <div>
        <Routes>
          {/* Complex nested structure */}
        </Routes>
      </div>
    </Header>
  </div>
</RjsApp>
```

## Migration Guide

### From Basic React Router

```tsx
// Before
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

// After
function App() {
  return (
    <RjsApp>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </RjsApp>
  );
}
```

### Adding Authentication

```tsx
// Phase 1: Optional auth
<RjsApp requireAuth={false}>
  <AppWithOptionalAuth />
</RjsApp>

// Phase 2: Required auth
<RjsApp requireAuth={true}>
  <SecureApp />
</RjsApp>
```

## Troubleshooting

### Common Issues

**Issue**: "useAppConfig must be used within RjsApp"

```tsx
// ❌ Hook used outside RjsApp
function BadComponent() {
  const { config } = useAppConfig(); // Error!
}

// ✅ Hook used inside RjsApp
<RjsApp>
  <GoodComponent />
</RjsApp>;
```

**Issue**: Configuration not loading

```tsx
// Check network tab for failed requests
// Verify configUrl is accessible
// Check CORS settings for remote configs
```

**Issue**: Authentication not working

```tsx
// Verify auth.context endpoint returns valid AuthContext
// Check auth.loginRedirect URL is correct
// Ensure authentication service is running
```

**Issue**: Multiple screens showing

```tsx
// This is fixed in the latest version
// Only one screen shows at a time now
```

## TypeScript Support

Full TypeScript support with proper type inference:

```tsx
import { RjsApp, useAppConfig, type AuthContext } from "rjs-frame";

interface AppProps {
  requireAuth?: boolean;
}

const App: React.FC<AppProps> = ({ requireAuth = false }) => {
  return (
    <RjsApp requireAuth={requireAuth}>
      <TypedAppContent />
    </RjsApp>
  );
};

const TypedAppContent: React.FC = () => {
  const {
    config, // ConfigManager<AppConfig> | null
    authContext, // AuthContext | null
    isLoading, // boolean
    error, // Error | null
  } = useAppConfig();

  return <div>Fully typed content</div>;
};
```

This comprehensive setup provides a robust foundation for React applications with built-in configuration management, authentication handling, and excellent developer experience.
