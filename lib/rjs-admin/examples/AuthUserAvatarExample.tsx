/**
 * AuthUserAvatar Usage Examples
 * Demonstrates how to use the AuthUserAvatar component with AuthContext
 */

import React from "react";
import { RjsApp } from "rjs-frame";
import { AuthUserAvatar } from "../src/components/common/AuthUserAvatar";

// Basic usage example
export const BasicAuthUserAvatarExample: React.FC = () => (
  <RjsApp>
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Basic AuthUserAvatar</h2>
      <p className="text-muted-foreground">
        Automatically uses user information from AuthContext
      </p>

      <AuthUserAvatar
        onProfileClick={() => console.log("Profile clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
        onLogoutClick={() => console.log("Logout clicked")}
      />
    </div>
  </RjsApp>
);

// Example with admin functionality
export const AdminAuthUserAvatarExample: React.FC = () => (
  <RjsApp>
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Admin AuthUserAvatar</h2>
      <p className="text-muted-foreground">
        Shows admin menu item for super admin users
      </p>

      <AuthUserAvatar
        onProfileClick={() => console.log("Profile clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
        onLogoutClick={() => console.log("Logout clicked")}
        onAdminClick={() => console.log("Admin panel clicked")}
      />
    </div>
  </RjsApp>
);

// Example with customized props
export const CustomizedAuthUserAvatarExample: React.FC = () => (
  <RjsApp>
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Customized AuthUserAvatar</h2>
      <p className="text-muted-foreground">
        Add custom avatar URL and handle events
      </p>

      <AuthUserAvatar
        avatarUrl="https://api.dicebear.com/7.x/avatars/svg?seed=Custom"
        initials="CD"
        onProfileClick={() => console.log("Profile clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
        onLogoutClick={() => console.log("Logout clicked")}
      />
    </div>
  </RjsApp>
);

// Example with custom menu items
export const CustomMenuAuthUserAvatarExample: React.FC = () => (
  <RjsApp>
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">AuthUserAvatar with Custom Menu</h2>
      <p className="text-muted-foreground">
        Add custom menu items to the dropdown
      </p>

      <AuthUserAvatar
        onProfileClick={() => console.log("Profile clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
        onLogoutClick={() => console.log("Logout clicked")}
        onAdminClick={() => console.log("Admin panel clicked")}
        menuItems={
          <>
            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <span>🎨</span>
              <span>Theme Settings</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <span>🔔</span>
              <span>Notifications</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <span>📊</span>
              <span>Dashboard</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <span>❓</span>
              <span>Help & Support</span>
            </div>
          </>
        }
      />
    </div>
  </RjsApp>
);

const config = {
  "auth.loginRedirect": "/login",
};

// Example demonstrating clickable login redirect
export const LoginRedirectExample: React.FC = () => (
  <div className="p-6 space-y-6">
    <h2 className="text-xl font-bold">Clickable Login Redirect</h2>
    <p className="text-muted-foreground">
      When not authenticated, the component shows a clickable fallback that
      redirects to the login page
    </p>

    <div className="border rounded-lg p-4 bg-muted/50">
      <p className="text-sm mb-4 font-medium">
        Without RjsApp wrapper (not authenticated):
      </p>
      <AuthUserAvatar
        showLoadingState={false}
        onProfileClick={() => console.log("Profile clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
        onLogoutClick={() => console.log("Logout clicked")}
      />
      <p className="text-xs text-muted-foreground mt-2">
        ↑ This fallback is clickable and will redirect to
        config["auth.loginRedirect"] or "/login"
      </p>
    </div>

    <div className="border rounded-lg p-4 bg-blue-50">
      <p className="text-sm mb-4 font-medium">
        With custom configuration via RjsApp:
      </p>
      <RjsApp config={config}>
        <AuthUserAvatar
          showLoadingState={false}
          onProfileClick={() => console.log("Profile clicked")}
          onSettingsClick={() => console.log("Settings clicked")}
          onLogoutClick={() => console.log("Logout clicked")}
        />
      </RjsApp>
      <p className="text-xs text-muted-foreground mt-2">
        ↑ Will use auth.loginRedirect from the custom config file
      </p>
    </div>
  </div>
);

// Example with custom fallback for unauthenticated users
export const FallbackAuthUserAvatarExample: React.FC = () => (
  <div className="p-6 space-y-6">
    <h2 className="text-xl font-bold">AuthUserAvatar with Custom Fallback</h2>
    <p className="text-muted-foreground">
      Shows custom content when user is not authenticated (overrides default
      clickable redirect)
    </p>

    <AuthUserAvatar
      showLoadingState={false}
      fallbackContent={
        <div className="flex items-center gap-3 p-3 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            👤
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-blue-800">
              Welcome, Guest!
            </span>
            <span className="text-xs text-blue-600">
              Please sign in to access your account
            </span>
            <button
              onClick={() => alert("Custom login action")}
              className="mt-1 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      }
    />
  </div>
);

// Example showing different loading states
export const LoadingStatesExample: React.FC = () => (
  <div className="p-6 space-y-8">
    <div>
      <h2 className="text-xl font-bold mb-4">Loading States</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">
            With Loading State (default)
          </h3>
          <RjsApp>
            <AuthUserAvatar />
          </RjsApp>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Without Loading State</h3>
          <RjsApp>
            <AuthUserAvatar showLoadingState={false} />
          </RjsApp>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">
            Not Authenticated (Clickable)
          </h3>
          <AuthUserAvatar showLoadingState={false} />
          <p className="text-xs text-muted-foreground mt-1">
            ↑ Click to redirect to login page
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Example in a typical app header
export const AppHeaderExample: React.FC = () => (
  <RjsApp>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">App Header Usage</h2>

      <header className="flex items-center justify-between p-4 bg-background border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">My Application</h1>
        </div>

        <nav className="flex items-center gap-4">
          <button className="px-3 py-2 text-sm hover:bg-accent rounded">
            Dashboard
          </button>
          <button className="px-3 py-2 text-sm hover:bg-accent rounded">
            Projects
          </button>
          <button className="px-3 py-2 text-sm hover:bg-accent rounded">
            Teams
          </button>

          <AuthUserAvatar
            className="ml-4"
            onProfileClick={() => alert("Navigate to profile")}
            onSettingsClick={() => alert("Navigate to settings")}
            onLogoutClick={() => alert("Logout user")}
            onAdminClick={() => alert("Navigate to admin panel")}
          />
        </nav>
      </header>

      <div className="p-4 text-center text-muted-foreground">
        <p>This is your application content</p>
        <p className="text-xs mt-2">
          If not authenticated, clicking the user avatar will redirect to login
        </p>
      </div>
    </div>
  </RjsApp>
);
