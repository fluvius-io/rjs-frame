import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserCircle } from "lucide-react";
import React, { useState } from "react";
import { AdminPanelTab } from "./AdminPanelTab";
import { UserAvatar, type UserAvatarProps } from "./UserAvatar";
import { UserDialog, type DialogTab } from "./UserDialog";
import { UserProfileTab } from "./UserProfileTab";
import { UserSettingsTab } from "./UserSettingsTab";

// Import from rjs-frame
import { useAppConfig } from "rjs-frame";

export interface AuthUserAvatarProps
  extends Omit<UserAvatarProps, "name" | "email"> {
  /** Override name from AuthContext */
  name?: string;
  /** Override email from AuthContext */
  email?: string;
  /** Show loading state while fetching auth data */
  showLoadingState?: boolean;
  /** Fallback content when not authenticated */
  fallbackContent?: React.ReactNode;
  /** Callback when admin panel is clicked (only shown for super admins) */
  onAdminClick?: () => void;
}

export function AuthUserAvatar({
  name: nameOverride,
  email: emailOverride,
  showLoadingState = true,
  fallbackContent,
  onAdminClick,
  menuItems,
  ...userAvatarProps
}: AuthUserAvatarProps) {
  const { authContext, isLoading, config } = useAppConfig();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogTabs, setDialogTabs] = useState<DialogTab[]>([]);

  // Loading state
  if (isLoading && showLoadingState) {
    return (
      <div
        className={`flex items-center gap-3 ${userAvatarProps.className || ""}`}
      >
        <div className="flex flex-col items-start text-left">
          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
          <div className="h-3 w-32 bg-muted animate-pulse rounded mt-1"></div>
        </div>
        <div className="w-10 h-10 bg-muted animate-pulse rounded-full"></div>
      </div>
    );
  }

  // No auth context available
  if (!authContext) {
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    }

    // Get login redirect URL from config
    const loginRedirectUrl =
      config?.get("auth.loginRedirect") || "/api/auth/login";

    const handleLoginClick = () => {
      // Redirect to login page with current URL as next parameter
      const currentUrl = window.location.href;
      const encodedNextUrl = encodeURIComponent(currentUrl);
      const separator = loginRedirectUrl.includes("?") ? "&" : "?";
      window.location.href = `${loginRedirectUrl}${separator}next=${encodedNextUrl}`;
    };

    return (
      <button
        onClick={handleLoginClick}
        className={`flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg hover:bg-accent p-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          userAvatarProps.className || ""
        }`}
        title="Click to sign in"
      >
        <div className="flex flex-col items-start text-left">
          <span className="text-sm font-medium">Not signed in</span>
          <span className="text-xs">Please authenticate</span>
        </div>
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
          <UserCircle className="h-6 w-6" />
        </div>
      </button>
    );
  }

  const { user, organization } = authContext;

  // Extract user information from AuthContext
  const fullName = `${user.name__given} ${user.name__family}`.trim();
  const displayName =
    nameOverride || fullName || user.username || "Unknown User";
  const email =
    emailOverride || user.telecom__email || user.verified_email || "";
  const isAdmin = user.is_super_admin;

  // Handle logout by redirecting to config logout URL with the root path as redirect parameter
  const handleLogout = () => {
    const logoutUrl = config?.get("auth.logout") || "/api/auth/logout";
    const separator = logoutUrl.includes("?") ? "&" : "?";
    window.location.href = `${logoutUrl}${separator}redirect=/`;
  };

  // Handle profile click - open profile dialog
  const handleProfileClick = () => {
    setDialogTitle("User Profile");
    setDialogTabs([
      {
        id: "profile",
        label: "Profile",
        content: <UserProfileTab />,
      },
    ]);
    setDialogOpen(true);
  };

  // Handle settings click - open settings dialog
  const handleSettingsClick = () => {
    setDialogTitle("User Settings");
    setDialogTabs([
      {
        id: "settings",
        label: "Settings",
        content: <UserSettingsTab />,
      },
    ]);
    setDialogOpen(true);
  };

  // Handle admin panel click - open admin dialog
  const handleAdminClick = () => {
    // If custom onAdminClick is provided, use it
    if (onAdminClick) {
      onAdminClick();
      return;
    }

    // Otherwise, open admin panel dialog
    setDialogTitle("Admin Panel");
    setDialogTabs([
      {
        id: "admin",
        label: "Admin Panel",
        content: <AdminPanelTab />,
      },
    ]);
    setDialogOpen(true);
  };

  // Create admin menu item if user is super admin
  const adminMenuItem = isAdmin ? (
    <DropdownMenu.Item
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
      onSelect={(e) => {
        e.preventDefault();
        handleAdminClick();
      }}
    >
      <span>🛡️</span>
      <span>Admin Panel</span>
    </DropdownMenu.Item>
  ) : null;

  // Combine admin menu item with custom menu items
  const enhancedMenuItems = (
    <>
      {adminMenuItem}
      {adminMenuItem && menuItems && (
        <DropdownMenu.Separator className="h-px bg-border my-1" />
      )}
      {menuItems}
    </>
  );

  return (
    <>
      <UserAvatar
        name={displayName}
        email={email}
        organization={organization?.name}
        menuItems={enhancedMenuItems}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onLogoutClick={handleLogout}
        {...userAvatarProps}
      />

      <UserDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogTitle}
        tabs={dialogTabs}
      />
    </>
  );
}
