import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { ReactNode } from "react";

export interface UserAvatarProps {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's profile image URL */
  avatarUrl?: string;
  /** User's initials for fallback */
  initials?: string;
  /** Custom menu items to add to the dropdown */
  menuItems?: ReactNode;
  /** Callback for profile click */
  onProfileClick?: () => void;
  /** Callback for settings click */
  onSettingsClick?: () => void;
  /** Callback for logout click */
  onLogoutClick?: () => void;
  /** Custom className for the trigger button */
  className?: string;
}

export function UserAvatar({
  name,
  email,
  avatarUrl,
  initials,
  menuItems,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className = "",
}: UserAvatarProps) {
  // Generate initials from name if not provided
  const fallbackInitials =
    initials ||
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`flex items-center gap-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-semibold">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
          <Avatar.Root className="w-10 h-10">
            <Avatar.Image
              src={avatarUrl}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
            <Avatar.Fallback className="w-full h-full rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              {fallbackInitials}
            </Avatar.Fallback>
          </Avatar.Root>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-background rounded-md border shadow-lg p-1 z-50"
          sideOffset={5}
          align="end"
        >
          <div className="px-3 py-2 border-b">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
            onClick={onProfileClick}
          >
            <UserCircle className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
            onClick={onSettingsClick}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenu.Item>

          {menuItems && (
            <>
              <DropdownMenu.Separator className="h-px bg-border my-1" />
              {menuItems}
            </>
          )}

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none text-destructive"
            onClick={onLogoutClick}
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
