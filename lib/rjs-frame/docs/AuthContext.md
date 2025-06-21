# AuthContext - Typed Authentication Context

The `AuthContext` provides a strongly typed interface for user authentication information in the RjsApp. This ensures type safety and better development experience when working with user data.

## Overview

The `AuthContext` is automatically fetched by RjsApp from the configured authentication endpoint and provides comprehensive user, profile, organization, and permission information.

## Type Structure

### AuthContext Interface

```tsx
interface AuthContext {
  realm: string;
  user: AuthUser;
  profile: AuthProfile;
  organization: AuthOrganization;
  iamroles: string[];
}
```

### AuthUser Interface

```tsx
interface AuthUser {
  active: boolean | null;
  name__family: string;
  name__given: string;
  name__middle: string | null;
  name__prefix: string | null;
  name__suffix: string | null;
  telecom__email: string;
  telecom__phone: string | null;
  username: string;
  verified_email: string;
  verified_phone: string | null;
  is_super_admin: boolean;
  status: string;
  realm_access: RealmAccess;
  resource_access: ResourceAccess;
  last_verified_request: string | null;
  _realm: string | null;
  _id: string;
  _created: string | null;
  _updated: string | null;
  _creator: string;
  _updater: string | null;
  _deleted: string | null;
  _etag: string | null;
}
```

### Supporting Interfaces

```tsx
interface RealmAccess {
  roles: string[];
}

interface ResourceAccess {
  account: ResourceRoles;
  [key: string]: ResourceRoles;
}

interface ResourceRoles {
  roles: string[];
}

interface AuthProfile {
  _id: string;
  name: string;
}

interface AuthOrganization {
  _id: string;
  name: string;
}
```

## Usage

### Basic Usage

```tsx
import { useAppConfig, type AuthContext } from "rjs-frame";

function UserProfile() {
  const { authContext } = useAppConfig();

  if (!authContext) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>
        Welcome, {authContext.user.name__given} {authContext.user.name__family}!
      </h1>
      <p>Email: {authContext.user.telecom__email}</p>
      <p>Status: {authContext.user.status}</p>
      <p>Realm: {authContext.realm}</p>
    </div>
  );
}
```

### Type-Safe Permission Checking

```tsx
function AdminPanel() {
  const { authContext } = useAppConfig();

  if (!authContext?.user.is_super_admin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome, Super Admin!</p>
    </div>
  );
}
```

### Role-Based Access Control

```tsx
function hasRole(authContext: AuthContext | null, role: string): boolean {
  if (!authContext) return false;

  return (
    authContext.iamroles.includes(role) ||
    authContext.user.realm_access.roles.includes(role)
  );
}

function hasResourceAccess(
  authContext: AuthContext | null,
  resource: string,
  permission: string
): boolean {
  if (!authContext) return false;

  const resourceAccess = authContext.user.resource_access[resource];
  return resourceAccess?.roles.includes(permission) || false;
}

function ProtectedComponent() {
  const { authContext } = useAppConfig();

  if (!hasRole(authContext, "uma_authorization")) {
    return <div>Insufficient permissions</div>;
  }

  if (!hasResourceAccess(authContext, "account", "manage-account")) {
    return <div>Cannot manage account</div>;
  }

  return <div>Protected content</div>;
}
```

### User Information Display

```tsx
function UserInfoCard() {
  const { authContext } = useAppConfig();

  if (!authContext) return null;

  const { user, profile, organization } = authContext;

  return (
    <div className="user-info-card">
      <div className="user-basic">
        <h3>
          {user.name__given} {user.name__family}
        </h3>
        <p>@{user.username}</p>
        <p>{user.telecom__email}</p>
        {user.verified_email && <span className="verified">✓ Verified</span>}
      </div>

      <div className="user-context">
        <p>
          <strong>Profile:</strong> {profile.name}
        </p>
        <p>
          <strong>Organization:</strong> {organization.name}
        </p>
        <p>
          <strong>Status:</strong> {user.status}
        </p>
        {user.is_super_admin && (
          <span className="admin-badge">Super Admin</span>
        )}
      </div>

      <div className="user-roles">
        <h4>Roles</h4>
        <ul>
          {authContext.iamroles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### Conditional Rendering Based on Permissions

```tsx
function NavigationMenu() {
  const { authContext } = useAppConfig();

  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      <a href="/profile">Profile</a>

      {hasResourceAccess(authContext, "account", "manage-account") && (
        <a href="/account-settings">Account Settings</a>
      )}

      {authContext?.user.is_super_admin && <a href="/admin">Admin Panel</a>}

      {hasRole(authContext, "uma_authorization") && (
        <a href="/advanced">Advanced Features</a>
      )}
    </nav>
  );
}
```

## Configuration

### Setting Auth Context URL

```tsx
// Default configuration
const defaultConfig = {
  "auth.loginRedirect": "/api/auth/login",
  "auth.context": "/api/auth/context",
};

// Custom configuration
<RjsApp configUrl="/config/app.json">
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</RjsApp>;
```

### Example Configuration File

```json
{
  "auth.loginRedirect": "/api/auth/login",
  "auth.context": "/api/auth/me",
  "api.baseUrl": "https://api.example.com"
}
```

## Error Handling

### Handling Missing Auth Context

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authContext, isLoading, error } = useAppConfig();

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (error) {
    return <ErrorScreen error={error} title="Authentication Error" />;
  }

  if (!authContext) {
    return (
      <div>
        <h2>Authentication Required</h2>
        <p>Please log in to access this content.</p>
        <button onClick={() => (window.location.href = "/login")}>
          Sign In
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
```

### Graceful Degradation

```tsx
function UserGreeting() {
  const { authContext } = useAppConfig();

  if (!authContext) {
    return <div>Welcome, Guest!</div>;
  }

  const displayName =
    authContext.user.name__given || authContext.user.username || "User";

  return <div>Welcome back, {displayName}!</div>;
}
```

## Mock Data for Testing

```tsx
import type { AuthContext } from "rjs-frame";

export const mockAuthContext: AuthContext = {
  realm: "dev-1.fluvius.io",
  user: {
    active: null,
    name__family: "Le X.",
    name__given: "Hung",
    name__middle: null,
    name__prefix: null,
    name__suffix: null,
    telecom__email: "hunglx@adaptive-bits.com",
    telecom__phone: null,
    username: "hunglx",
    verified_email: "hunglx@adaptive-bits.com",
    verified_phone: null,
    is_super_admin: true,
    status: "PENDING",
    realm_access: {
      roles: [
        "default-roles-dev-1.fluvius.io",
        "offline_access",
        "uma_authorization",
      ],
    },
    resource_access: {
      account: {
        roles: ["manage-account", "manage-account-links", "view-profile"],
      },
    },
    last_verified_request: null,
    _realm: null,
    _id: "44d2f8cb-0d46-4323-95b9-c5b4bdbf6205",
    _created: null,
    _updated: null,
    _creator: "a0a829be-8686-4356-9908-80d509d473f7",
    _updater: null,
    _deleted: null,
    _etag: null,
  },
  profile: {
    _id: "44d2f8cb-0d46-4323-95b9-c5b4bdbf6205",
    name: "Default Profile",
  },
  organization: {
    _id: "44d2f8cb-0d46-4323-95b9-c5b4bdbf6205",
    name: "Default Organization",
  },
  iamroles: [
    "default-roles-dev-1.fluvius.io",
    "offline_access",
    "uma_authorization",
  ],
};
```

## Integration with Page State

For applications using the legacy AppState, you can access the typed auth context:

```tsx
import { useAppConfig } from "rjs-frame";

function MyPageModule() {
  const { authContext } = useAppConfig(); // Typed AuthContext
  // Use authContext instead of appState.auth for type safety
}
```

## Best Practices

### 1. Always Check for Null

```tsx
// ✅ Good
if (authContext?.user.is_super_admin) {
  // Handle admin functionality
}

// ❌ Bad
if (authContext.user.is_super_admin) {
  // May throw error if authContext is null
}
```

### 2. Create Helper Functions

```tsx
// Create reusable permission checking functions
export function isAdmin(authContext: AuthContext | null): boolean {
  return authContext?.user.is_super_admin || false;
}

export function canManageAccount(authContext: AuthContext | null): boolean {
  return hasResourceAccess(authContext, "account", "manage-account");
}
```

### 3. Use Type Guards

```tsx
function isValidAuthContext(auth: any): auth is AuthContext {
  return (
    auth &&
    typeof auth.realm === "string" &&
    auth.user &&
    typeof auth.user.username === "string" &&
    auth.profile &&
    auth.organization
  );
}
```

### 4. Handle Loading States

```tsx
function AuthDependentComponent() {
  const { authContext, isLoading } = useAppConfig();

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  if (!authContext) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome, {authContext.user.name__given}!</div>;
}
```

## Migration from Generic AuthState

If migrating from the generic `AuthState`, update your components:

```tsx
// Before (generic AuthState)
const { auth } = appState;
const userName = auth.user?.name;

// After (typed AuthContext)
const { authContext } = useAppConfig();
const userName = authContext?.user.name__given;
```

The typed AuthContext provides better IntelliSense, compile-time error checking, and ensures your code matches the expected API structure.
