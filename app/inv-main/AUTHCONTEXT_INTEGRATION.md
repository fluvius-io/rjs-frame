# AuthContext Integration in inv-main

## Overview

The inv-main application has been updated to use the new `AuthUserAvatar` component from `rjs-admin`, which automatically integrates with the AuthContext from `rjs-frame`.

## Changes Made

### 1. Updated Header Component

**File**: `src/pages/HomePage.tsx`

**Before**:

```tsx
import { UserAvatar } from "rjs-admin";

<UserAvatar
  name="John Doe"
  email="john.doe@investmate.com"
  avatarUrl="/api/placeholder/40/40"
  onProfileClick={() => console.log("Profile clicked")}
  onSettingsClick={() => console.log("Settings clicked")}
  onLogoutClick={() => console.log("Logout clicked")}
/>;
```

**After**:

```tsx
import { AuthUserAvatar } from "rjs-admin";

<AuthUserAvatar
  avatarUrl="/api/placeholder/40/40"
  onProfileClick={() => console.log("Profile clicked")}
  onSettingsClick={() => console.log("Settings clicked")}
  onLogoutClick={() => console.log("Logout clicked")}
  onAdminClick={() => console.log("Admin panel clicked")}
/>;
```

## Benefits

### 🔄 Automatic Data Integration

- User name and email are now automatically extracted from AuthContext
- No need to manually pass user data as props
- Consistent user information across the application

### 🛡️ Admin Support

- Automatically shows admin menu item for super admin users
- Added `onAdminClick` callback for admin panel navigation

### 📱 Better UX

- Shows loading skeleton while AuthContext is being fetched
- Graceful fallback when user is not authenticated
- Type-safe integration with AuthContext structure

## AuthContext Data Mapping

The component automatically uses the following data from AuthContext:

| AuthContext Field                              | Usage                       |
| ---------------------------------------------- | --------------------------- |
| `user.name__given + user.name__family`         | Display name in header      |
| `user.telecom__email \|\| user.verified_email` | Email address               |
| `user.username`                                | Fallback display name       |
| `user.is_super_admin`                          | Shows/hides admin menu item |

## Configuration

The application uses the default AuthContext configuration from RjsApp:

```tsx
// In App.tsx
<RjsApp>{/* Routes */}</RjsApp>
```

Default auth endpoints:

- Login redirect: `/api/auth/login`
- Auth context: `/api/auth/context`

## Testing

To test the integration:

1. **With AuthContext**: The component will show user information from the auth endpoint
2. **Without AuthContext**: Shows "Not signed in" fallback
3. **Loading State**: Shows skeleton while fetching auth data
4. **Admin Users**: Shows additional admin menu item

## Future Enhancements

- Configure custom auth endpoints via RjsApp `configUrl` prop
- Add role-based menu items beyond admin
- Integrate with actual authentication service
- Add user profile management features

## Dependencies

- `rjs-frame`: Provides AuthContext and useAppConfig hook
- `rjs-admin`: Provides AuthUserAvatar component
- TypeScript: Full type safety with AuthContext interface
