# AuthUserAvatar Component

The `AuthUserAvatar` component is an enhanced version of the `UserAvatar` component that automatically integrates with the AuthContext from `rjs-frame`. It extends the base `UserAvatar` by automatically populating user information from the authentication context.

## Overview

- **Base Component**: Extends `UserAvatar` from rjs-admin
- **Data Source**: Automatically uses `AuthContext` from `rjs-frame`
- **Fallback Support**: Graceful handling when authentication is not available
- **Override Capability**: Allows manual override of auth-derived data
- **Login Redirect**: Clickable fallback that redirects to login page

## Key Features

### 🔄 Automatic Data Integration

- Automatically extracts user name from `AuthContext.user.name__given` and `AuthContext.user.name__family`
- Uses primary email from `AuthContext.user.telecom__email` or falls back to `verified_email`
- Generates initials from the full name automatically

### 🛡️ Admin Support

- Automatically shows admin menu item for users with `is_super_admin: true`
- Provides `onAdminClick` callback for admin panel navigation

### 📱 Loading & Error States

- Shows loading skeleton while AuthContext is being fetched
- Provides customizable fallback content for unauthenticated users
- **Clickable login redirect**: Default fallback redirects to `config["auth.loginRedirect"]`
- Gracefully handles missing or invalid auth data

### 🎨 Customization Options

- All original `UserAvatar` props are supported
- Override auth-derived name and email when needed
- Add custom menu items alongside admin functionality
- Custom CSS classes and styling

## Basic Usage

```tsx
import { AuthUserAvatar } from "rjs-admin";
import { RjsApp } from "rjs-frame";

function MyApp() {
  return (
    <RjsApp>
      <header>
        <AuthUserAvatar
          onProfileClick={() => navigate("/profile")}
          onSettingsClick={() => navigate("/settings")}
          onLogoutClick={() => handleLogout()}
          onAdminClick={() => navigate("/admin")} // Only shown for admins
        />
      </header>
    </RjsApp>
  );
}
```

## Authentication Flow

### When User is Authenticated

Shows the standard UserAvatar with user information from AuthContext.

### When User is Not Authenticated

Shows a clickable fallback that automatically redirects to the login page:

```tsx
// Default behavior - clicking redirects to config["auth.loginRedirect"]
<AuthUserAvatar />

// The fallback will show:
// "Not signed in"
// "Please authenticate"
// And clicking anywhere redirects to the login URL
```

### Login Redirect Configuration

The component automatically uses the login redirect URL from your app configuration:

```json
{
  "auth.loginRedirect": "/api/auth/login",
  "auth.context": "/api/auth/context"
}
```

If no configuration is available, it defaults to `/login`.

## Advanced Usage

### With Custom Overrides

```tsx
<AuthUserAvatar
  name="Custom Display Name" // Override auth-derived name
  email="custom@example.com" // Override auth-derived email
  avatarUrl="/custom-avatar.jpg" // Add custom avatar image
  initials="CD" // Override auto-generated initials
  onProfileClick={() => navigate("/profile")}
  onSettingsClick={() => navigate("/settings")}
  onLogoutClick={() => handleLogout()}
/>
```

### With Custom Menu Items

```tsx
<AuthUserAvatar
  onProfileClick={() => navigate("/profile")}
  onSettingsClick={() => navigate("/settings")}
  onLogoutClick={() => handleLogout()}
  onAdminClick={() => navigate("/admin")}
  menuItems={
    <>
      <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer">
        <span>🎨</span>
        <span>Theme</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer">
        <span>🔔</span>
        <span>Notifications</span>
      </div>
    </>
  }
/>
```

### With Custom Fallback (Overrides Default Login Redirect)

```tsx
<AuthUserAvatar
  onLogoutClick={() => handleLogout()}
  fallbackContent={
    <div className="flex items-center gap-3 p-2 border border-dashed rounded-lg">
      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
        👤
      </div>
      <div>
        <div className="text-sm font-medium">Guest User</div>
        <button
          onClick={() => navigate("/login")}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    </div>
  }
/>
```

## Props API

### AuthUserAvatarProps

Extends all `UserAvatarProps` except `name` and `email` are now optional:

| Prop               | Type              | Default                    | Description                                      |
| ------------------ | ----------------- | -------------------------- | ------------------------------------------------ |
| `name`             | `string`          | _from AuthContext_         | Override display name                            |
| `email`            | `string`          | _from AuthContext_         | Override email address                           |
| `showLoadingState` | `boolean`         | `true`                     | Show loading skeleton while fetching auth        |
| `fallbackContent`  | `ReactNode`       | _clickable login redirect_ | Custom content when not authenticated            |
| `onAdminClick`     | `() => void`      | -                          | Callback for admin panel (shown only for admins) |
| ...rest            | `UserAvatarProps` | -                          | All other UserAvatar props                       |

## Data Mapping

The component automatically maps AuthContext data as follows:

| AuthContext Path                               | Component Usage             |
| ---------------------------------------------- | --------------------------- |
| `user.name__given + user.name__family`         | Display name                |
| `user.telecom__email \|\| user.verified_email` | Email address               |
| `user.username`                                | Fallback for display name   |
| `user.is_super_admin`                          | Shows/hides admin menu item |

## Configuration Integration

The component automatically reads configuration values:

| Config Key           | Usage                                          |
| -------------------- | ---------------------------------------------- |
| `auth.loginRedirect` | URL for login redirect when not authenticated  |
| `auth.context`       | URL for fetching auth context (used by RjsApp) |

## Loading States

### With AuthContext Loading

```tsx
// Shows loading skeleton automatically
<AuthUserAvatar showLoadingState={true} />
```

### Without Loading State

```tsx
// Shows clickable fallback immediately if no auth
<AuthUserAvatar showLoadingState={false} />
```

## Authentication States

### 1. Loading

Shows animated skeleton while fetching auth data.

### 2. Authenticated

Shows full UserAvatar with user information and dropdown menu.

### 3. Not Authenticated (Default)

Shows clickable button that redirects to login:

- Hover effects for better UX
- Focus ring for accessibility
- Tooltip indicating clickability
- Automatic redirect to `config["auth.loginRedirect"]`

### 4. Not Authenticated (Custom Fallback)

Uses your custom `fallbackContent` instead of default redirect.

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
    // AuthUserAvatar will handle this automatically with clickable redirect
    return (
      <div>
        <h2>Authentication Required</h2>
        <AuthUserAvatar /> {/* Will show clickable login */}
      </div>
    );
  }

  return <>{children}</>;
}
```

### Graceful Degradation

```tsx
function UserGreeting() {
  // AuthUserAvatar automatically handles all states
  return (
    <div className="flex items-center gap-4">
      <span>Welcome!</span>
      <AuthUserAvatar />
    </div>
  );
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

### 1. Always Wrap with RjsApp

```tsx
// ✅ Correct
<RjsApp>
  <AuthUserAvatar />
</RjsApp>

// ❌ Incorrect - AuthContext won't be available
<AuthUserAvatar />
```

### 2. Handle Loading States Appropriately

```tsx
// ✅ Good - shows loading skeleton
<AuthUserAvatar showLoadingState={true} />

// ✅ Also good - immediate fallback for better UX in some cases
<AuthUserAvatar showLoadingState={false} />
```

### 3. Provide Meaningful Callbacks

```tsx
// ✅ Good - actual navigation logic
<AuthUserAvatar
  onProfileClick={() => router.push('/profile')}
  onSettingsClick={() => router.push('/settings')}
  onLogoutClick={() => auth.logout()}
  onAdminClick={() => router.push('/admin')}
/>

// ❌ Avoid - no-op callbacks
<AuthUserAvatar onProfileClick={() => {}} />
```

### 4. Use Override Props Sparingly

```tsx
// ✅ Good - trust AuthContext data
<AuthUserAvatar />

// ⚠️ Use only when necessary - for testing or special cases
<AuthUserAvatar name="Test User" email="test@example.com" />
```

### 5. Configure Login Redirect Properly

```tsx
// ✅ Good - proper configuration
<RjsApp configUrl="/config/app.json">
  <AuthUserAvatar />
</RjsApp>

// With config file:
{
  "auth.loginRedirect": "/auth/login",
  "auth.context": "/api/auth/me"
}
```

## Migration from UserAvatar

If you're currently using `UserAvatar`, migration is straightforward:

```tsx
// Before
<UserAvatar
  name={user.fullName}
  email={user.email}
  onProfileClick={() => navigate('/profile')}
  onLogoutClick={() => logout()}
/>

// After - much simpler and with automatic login redirect!
<AuthUserAvatar
  onProfileClick={() => navigate('/profile')}
  onLogoutClick={() => logout()}
/>
```

The `AuthUserAvatar` will automatically:

- Extract `name` and `email` from AuthContext
- Show clickable login redirect when not authenticated
- Handle all loading and error states
- Provide admin functionality for super admin users

This makes your code cleaner, more maintainable, and provides better UX out of the box.
