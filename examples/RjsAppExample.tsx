/**
 * RjsApp Configuration Context Example
 * Demonstrates how to use the enhanced RjsApp with configuration management
 */

import React from "react";
import { RjsApp, Route, useAppConfig, type AuthContext } from "../src";

// Example page component that uses configuration
const HomePage: React.FC = () => {
  const { config, authContext, isLoading, error } = useAppConfig();

  if (isLoading) {
    return <div>Loading page...</div>;
  }

  if (error) {
    return <div>Error loading configuration: {error.message}</div>;
  }

  // Helper function to display user information with type safety
  const renderUserInfo = (authContext: AuthContext) => (
    <div
      style={{
        background: "#e8f4f8",
        padding: "15px",
        borderRadius: "5px",
        marginBottom: "20px",
      }}
    >
      <h3>User Information</h3>
      <div>
        <strong>Username:</strong> {authContext.user.username}
      </div>
      <div>
        <strong>Name:</strong> {authContext.user.name__given}{" "}
        {authContext.user.name__family}
      </div>
      <div>
        <strong>Email:</strong> {authContext.user.telecom__email}
      </div>
      <div>
        <strong>Verified Email:</strong> {authContext.user.verified_email}
      </div>
      <div>
        <strong>Status:</strong> {authContext.user.status}
      </div>
      <div>
        <strong>Super Admin:</strong>{" "}
        {authContext.user.is_super_admin ? "Yes" : "No"}
      </div>
      <div>
        <strong>Realm:</strong> {authContext.realm}
      </div>
      <div>
        <strong>Profile:</strong> {authContext.profile.name}
      </div>
      <div>
        <strong>Organization:</strong> {authContext.organization.name}
      </div>
      <div>
        <strong>IAM Roles:</strong> {authContext.iamroles.join(", ")}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>RjsApp Configuration Example</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Configuration Values</h2>
        <div
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "5px",
            fontFamily: "monospace",
          }}
        >
          <div>
            <strong>Auth Login Redirect:</strong>{" "}
            {config?.get("auth.loginRedirect")}
          </div>
          <div>
            <strong>Auth Context URL:</strong> {config?.get("auth.context")}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Authorization Context</h2>
        {authContext ? (
          renderUserInfo(authContext)
        ) : (
          <div
            style={{
              color: "#666",
              padding: "15px",
              background: "#f5f5f5",
              borderRadius: "5px",
            }}
          >
            No auth context available
          </div>
        )}
      </div>

      {authContext && (
        <div style={{ marginBottom: "20px" }}>
          <h2>User Permissions</h2>
          <div
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h4>Realm Access Roles:</h4>
            <ul>
              {authContext.user.realm_access.roles.map((role, index) => (
                <li key={index}>{role}</li>
              ))}
            </ul>

            <h4>Resource Access:</h4>
            {Object.entries(authContext.user.resource_access).map(
              ([resource, access]) => (
                <div key={resource}>
                  <strong>{resource}:</strong>
                  <ul>
                    {access.roles.map((role, index) => (
                      <li key={index}>{role}</li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div>
        <h2>All Configuration (Raw)</h2>
        <div
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "5px",
            fontFamily: "monospace",
          }}
        >
          <pre>{JSON.stringify(config?.getAll(), null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

// Example settings page that also uses configuration
const SettingsPage: React.FC = () => {
  const { config, authContext } = useAppConfig();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Settings Page</h1>
      <p>This page also has access to the configuration context.</p>

      <div
        style={{
          background: "#e8f4f8",
          padding: "15px",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <h3>Quick Config Access</h3>
        <p>
          <strong>Login Endpoint:</strong>{" "}
          {config?.get("auth.loginRedirect", "Not configured")}
        </p>
        <p>
          <strong>Context Endpoint:</strong>{" "}
          {config?.get("auth.context", "Not configured")}
        </p>

        {authContext && (
          <div style={{ marginTop: "15px" }}>
            <h4>Current User</h4>
            <p>
              <strong>Welcome:</strong> {authContext.user.name__given}{" "}
              {authContext.user.name__family}
            </p>
            <p>
              <strong>Email:</strong> {authContext.user.telecom__email}
            </p>
            <p>
              <strong>Admin:</strong>{" "}
              {authContext.user.is_super_admin ? "Yes" : "No"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Basic usage without authentication requirement
export const BasicRjsAppExample: React.FC = () => (
  <RjsApp>
    <Route path="/" element={<HomePage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </RjsApp>
);

// Usage with authentication requirement (will show unauthorized screen if not authenticated)
export const AuthRequiredAppExample: React.FC = () => (
  <RjsApp authRequired={true}>
    <Route path="/" element={<ProtectedHomePage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/admin" element={<AdminPage />} />
  </RjsApp>
);

// Usage with remote configuration and authentication requirement
export const RemoteConfigAuthAppExample: React.FC = () => (
  <RjsApp
    configUrl="https://api.example.com/config/production.json"
    authRequired={true}
  >
    <Route path="/" element={<SecureHomePage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </RjsApp>
);

// Usage without authentication requirement but with auth context access
export const OptionalAuthAppExample: React.FC = () => (
  <RjsApp authRequired={false}>
    <Route path="/" element={<FlexibleHomePage />} />
    <Route path="/public" element={<PublicPage />} />
  </RjsApp>
);

// Example component that shows different content based on auth state
const FlexibleHomePage: React.FC = () => {
  const { authContext, isLoading, error } = useAppConfig();

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Configuration error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Welcome to Our App</h1>
      {authContext ? (
        <div>
          <p>
            Hello, {authContext.user.name__given}{" "}
            {authContext.user.name__family}!
          </p>
          <p>You have access to authenticated features.</p>
        </div>
      ) : (
        <div>
          <p>Welcome, guest! You can browse public content.</p>
          <p>
            <a href="/login">Sign in</a> to access more features.
          </p>
        </div>
      )}
    </div>
  );
};

// Component that requires authentication (only shown when auth is available)
const ProtectedHomePage: React.FC = () => {
  const { authContext } = useAppConfig();

  return (
    <div>
      <h1>Protected Home Page</h1>
      <p>
        Welcome, {authContext?.user.name__given}{" "}
        {authContext?.user.name__family}!
      </p>
      <p>This page is only accessible to authenticated users.</p>
      <div>
        <h3>Your Account Info:</h3>
        <ul>
          <li>Email: {authContext?.user.telecom__email}</li>
          <li>Username: {authContext?.user.username}</li>
          <li>Realm: {authContext?.realm}</li>
          <li>
            Super Admin: {authContext?.user.is_super_admin ? "Yes" : "No"}
          </li>
        </ul>
      </div>
    </div>
  );
};

// Simple page components
const HomePage: React.FC = () => (
  <div>
    <h1>Home Page</h1>
    <p>This is a public home page that doesn't require authentication.</p>
  </div>
);

const AboutPage: React.FC = () => (
  <div>
    <h1>About Page</h1>
    <p>This is a public about page.</p>
  </div>
);

const SecureHomePage: React.FC = () => {
  const { authContext } = useAppConfig();

  return (
    <div>
      <h1>Secure Home</h1>
      <p>This entire app requires authentication.</p>
      <p>
        Current user: {authContext?.user.name__given}{" "}
        {authContext?.user.name__family}
      </p>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { authContext } = useAppConfig();

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <h3>Profile Information:</h3>
        <p>
          Name: {authContext?.user.name__given} {authContext?.user.name__family}
        </p>
        <p>Email: {authContext?.user.telecom__email}</p>
        <p>Status: {authContext?.user.status}</p>
        <p>Organization: {authContext?.organization.name}</p>
      </div>
    </div>
  );
};

const AdminPage: React.FC = () => {
  const { authContext } = useAppConfig();

  if (!authContext?.user.is_super_admin) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You don't have admin privileges.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel, {authContext.user.name__given}!</p>
      <div>
        <h3>Admin Features:</h3>
        <ul>
          <li>User Management</li>
          <li>System Configuration</li>
          <li>Analytics Dashboard</li>
        </ul>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { authContext } = useAppConfig();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard, {authContext?.user.name__given}!</p>
      <div>
        <h3>Quick Stats:</h3>
        <p>Roles: {authContext?.user.realm_access.roles.join(", ")}</p>
        <p>IAM Roles: {authContext?.iamroles.join(", ")}</p>
      </div>
    </div>
  );
};

const PublicPage: React.FC = () => (
  <div>
    <h1>Public Page</h1>
    <p>This page is accessible to everyone, authenticated or not.</p>
  </div>
);

// Example showing the state priority handling
export const StatePriorityDemoExample: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">RjsApp State Priority Demo</h2>
      <p className="text-muted-foreground">
        Demonstrates how RjsApp handles different states with proper priority:
        Loading → Error → Unauthorized → Content
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example 1: No auth required */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">No Auth Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            App works regardless of authentication status
          </p>
          <div className="h-32 border-2 border-dashed rounded flex items-center justify-center">
            <RjsApp authRequired={false}>
              <div className="text-center">
                <p className="text-green-600">✓ App Content Loaded</p>
                <p className="text-xs">Works with or without auth</p>
              </div>
            </RjsApp>
          </div>
        </div>

        {/* Example 2: Auth required */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Auth Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Shows unauthorized screen when no auth context
          </p>
          <div className="h-32 border-2 border-dashed rounded flex items-center justify-center">
            <RjsApp authRequired={true}>
              <div className="text-center">
                <p className="text-green-600">✓ Protected Content</p>
                <p className="text-xs">Only shown when authenticated</p>
              </div>
            </RjsApp>
          </div>
        </div>

        {/* Example 3: With invalid config URL */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Config Error Handling</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Shows error screen when config fails to load
          </p>
          <div className="h-32 border-2 border-dashed rounded flex items-center justify-center">
            <RjsApp
              configUrl="https://invalid-url.example.com/config.json"
              authRequired={true}
            >
              <div className="text-center">
                <p className="text-green-600">✓ App Content</p>
                <p className="text-xs">Won't show due to config error</p>
              </div>
            </RjsApp>
          </div>
        </div>

        {/* Example 4: Valid config with auth */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Valid Config + Auth</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Shows content when config loads and auth is available
          </p>
          <div className="h-32 border-2 border-dashed rounded flex items-center justify-center">
            <RjsApp configUrl="/config/production.json" authRequired={true}>
              <div className="text-center">
                <p className="text-green-600">✓ Authenticated App</p>
                <p className="text-xs">Full functionality available</p>
              </div>
            </RjsApp>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          State Priority Order:
        </h4>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>
            <strong>Loading Screen</strong> - Shown while initializing
            configuration
          </li>
          <li>
            <strong>Error Screen</strong> - Shown when configuration fails to
            load
          </li>
          <li>
            <strong>Unauthorized Screen</strong> - Shown when authRequired=true
            but no auth context
          </li>
          <li>
            <strong>App Content</strong> - Shown when everything is properly
            initialized
          </li>
        </ol>
        <p className="text-xs text-blue-600 mt-2">
          Only one screen is ever shown at a time, preventing UI conflicts.
        </p>
      </div>
    </div>
  );
};

// Example showing error handling with different scenarios
export const ErrorHandlingExample: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Error Handling Examples</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Network Error (Invalid Config URL)</h3>
          <RjsApp configUrl="https://nonexistent.example.com/config.json">
            <div>This won't be shown due to config error</div>
          </RjsApp>
        </div>

        <div>
          <h3 className="font-semibold">Auth Required but Not Available</h3>
          <RjsApp authRequired={true}>
            <div>This won't be shown due to missing authentication</div>
          </RjsApp>
        </div>
      </div>
    </div>
  );
};

// Export all examples
export {
  AuthRequiredAppExample,
  BasicRjsAppExample,
  ErrorHandlingExample,
  OptionalAuthAppExample,
  RemoteConfigAuthAppExample,
  StatePriorityDemoExample,
};
