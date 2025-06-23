import { useAppContext } from "rjs-frame";

export function AdminPanelTab() {
  const { authContext, config } = useAppContext();

  if (!authContext || !authContext.user.is_super_admin) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground">
          You don't have admin privileges.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Admin Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Admin Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-2">System Status</h4>
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Version:</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-2">Quick Stats</h4>
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Active Users:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Total Sessions:</span>
                <span>--</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Admin Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left">
            <div className="font-medium">User Management</div>
            <div className="text-sm text-muted-foreground">
              Manage user accounts and permissions
            </div>
          </button>

          <button className="p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left">
            <div className="font-medium">System Settings</div>
            <div className="text-sm text-muted-foreground">
              Configure system parameters
            </div>
          </button>

          <button className="p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left">
            <div className="font-medium">Audit Logs</div>
            <div className="text-sm text-muted-foreground">
              View system activity logs
            </div>
          </button>

          <button className="p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left">
            <div className="font-medium">Data Export</div>
            <div className="text-sm text-muted-foreground">
              Export system data
            </div>
          </button>
        </div>
      </div>

      {/* Configuration Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configuration</h3>
        <div className="p-4 rounded-lg border bg-card">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auth Context URL:</span>
              <span className="font-mono text-xs">
                {config?.get("auth.context") || "Not configured"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Login Redirect:</span>
              <span className="font-mono text-xs">
                {config?.get("auth.loginRedirect") || "Not configured"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Logout URL:</span>
              <span className="font-mono text-xs">
                {config?.get("auth.logout") || "Not configured"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin User Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Admin User Details</h3>
        <div className="p-4 rounded-lg border bg-card">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Username:</span>
              <span>{authContext.user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono text-xs">{authContext.user._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Super Admin:</span>
              <span className="text-green-600">Yes</span>
            </div>
            {authContext.organization && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organization:</span>
                <span>{authContext.organization.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

AdminPanelTab.displayName = "AdminPanelTab";
