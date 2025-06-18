import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { ReactNode } from "react";

export interface UserAvatarProps {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's organization */
  organization?: string;
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
  organization,
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
        <button className={`user-avatar__trigger ${className}`}>
          <Avatar.Root className="user-avatar__image-container">
            <Avatar.Image
              src={avatarUrl}
              alt={name}
              className="user-avatar__image"
            />
            <Avatar.Fallback className="user-avatar__fallback">
              {fallbackInitials}
            </Avatar.Fallback>
          </Avatar.Root>
          <div className="user-avatar__user-info">
            <span className="user-avatar__user-name">{name}</span>
            <span className="user-avatar__user-email">{email}</span>
          </div>
          <ChevronDown className="user-avatar__dropdown-icon" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="user-avatar__dropdown-content"
          sideOffset={5}
          align="end"
        >
          <div className="user-avatar__dropdown-header">
            <p className="user-avatar__dropdown-header-name">{name}</p>
            <p className="user-avatar__dropdown-header-email">{email}</p>
            {organization && (
              <p className="user-avatar__dropdown-header-email">
                {organization}
              </p>
            )}
          </div>

          <DropdownMenu.Item
            className="user-avatar__dropdown-item"
            onSelect={onProfileClick}
          >
            <UserCircle className="user-avatar__dropdown-item-icon" />
            <span>Profile</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="user-avatar__dropdown-item"
            onSelect={onSettingsClick}
          >
            <Settings className="user-avatar__dropdown-item-icon" />
            <span>Settings</span>
          </DropdownMenu.Item>

          {menuItems && (
            <>
              <DropdownMenu.Separator className="user-avatar__dropdown-separator" />
              {menuItems}
            </>
          )}

          <DropdownMenu.Separator className="user-avatar__dropdown-separator" />

          <DropdownMenu.Item
            className="user-avatar__dropdown-item--destructive"
            onSelect={onLogoutClick}
          >
            <LogOut className="user-avatar__dropdown-item-icon" />
            <span>Log out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
