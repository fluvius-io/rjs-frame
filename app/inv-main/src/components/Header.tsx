import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  Database,
  Home,
  Search,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React from "react";
import { AuthUserAvatar, Button } from "rjs-admin";
import { PageModule, useLocation } from "rjs-frame";
import logoTransparent from "../assets/img/logo-transparent.png";
import menuData from "../data/menu.json";
import type { MenuItemData } from "../types/menu";
import "./Header.css";

// Icon mapping from string names to React components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Bot,
  Zap,
  TrendingUp,
  Database,
  BarChart3,
  Settings,
  Activity,
  Users,
};

// Navigation Item Type with resolved React components
interface NavigationItemType {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
  submenu?: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    description: string;
  }[];
}

// Helper function to resolve icon names to components
const resolveIcon = (
  iconName: string
): React.ComponentType<{ className?: string }> => {
  return iconMap[iconName] || Home; // Fallback to Home icon if not found
};

// Helper function to convert JSON data to NavigationItemType
const transformNavigationItem = (item: MenuItemData): NavigationItemType => {
  return {
    ...item,
    icon: resolveIcon(item.icon),
    submenu: item.submenu?.map((submenuItem) => ({
      ...submenuItem,
      icon: resolveIcon(submenuItem.icon),
    })),
  };
};

// Simple Navigation Item without JavaScript hover management
const NavigationItem: React.FC<{
  item: NavigationItemType;
}> = ({ item }) => {
  const location = useLocation();
  const handleNavigation = (href: string) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const hasSubmenu = item.submenu && item.submenu.length > 0;

  // Check if current path starts with the item's href (for nested routes)
  const isActive = location.pathname.startsWith(item.href);

  // If no submenu, render as a simple clickable button
  if (!hasSubmenu) {
    return (
      <button
        className={`header-nav__trigger header-nav__trigger--simple ${
          isActive ? "header-nav__trigger--active" : ""
        }`}
        onClick={() => handleNavigation(item.href)}
      >
        <item.icon className="header-nav__icon" />
        <span className="header-nav__label">{item.label}</span>
      </button>
    );
  }

  // If has submenu, render with dropdown behavior
  return (
    <div className="header-nav__container">
      <button
        className={`header-nav__trigger ${
          isActive ? "header-nav__trigger--active" : ""
        }`}
      >
        <item.icon className="header-nav__icon" />
        <span className="header-nav__label">{item.label}</span>
        <ChevronDown className="header-nav__chevron" />
      </button>

      {/* CSS-controlled dropdown */}
      <div className="header-nav__dropdown-content absolute top-full left-0 mt-1">
        <div
          className="header-nav__dropdown-item"
          onClick={() => handleNavigation(item.href)}
        >
          <item.icon className="header-nav__dropdown-icon" />
          <div className="header-nav__dropdown-text">
            <span className="header-nav__dropdown-title">{item.label}</span>
            <span className="header-nav__dropdown-description">
              {item.description}
            </span>
          </div>
        </div>

        <div className="header-nav__dropdown-separator" />
        {item.submenu!.map((submenuItem, index) => {
          const isSubmenuActive = location.pathname.startsWith(
            submenuItem.href
          );
          return (
            <div
              key={index}
              className={`header-nav__dropdown-item ${
                isSubmenuActive ? "header-nav__dropdown-item--active" : ""
              }`}
              onClick={() => handleNavigation(submenuItem.href)}
            >
              <submenuItem.icon className="header-nav__dropdown-icon" />
              <div className="header-nav__dropdown-text">
                <span className="header-nav__dropdown-title">
                  {submenuItem.label}
                </span>
                <span className="header-nav__dropdown-description">
                  {submenuItem.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Mobile Navigation Item Component
const MobileNavigationItem: React.FC<{
  item: NavigationItemType;
}> = ({ item }) => {
  const location = useLocation();
  const handleNavigation = (href: string) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const isActive = location.pathname.startsWith(item.href);

  return (
    <DropdownMenu.Item
      className={`header-nav__mobile-item ${
        isActive ? "header-nav__mobile-item--active" : ""
      }`}
      onSelect={() => handleNavigation(item.href)}
    >
      <item.icon className="header-nav__mobile-icon" />
      <div className="header-nav__mobile-text">
        <span className="header-nav__mobile-title">{item.label}</span>
        <span className="header-nav__mobile-description">
          {item.description}
        </span>
      </div>
    </DropdownMenu.Item>
  );
};

export class Header extends PageModule {
  private navigationItems: NavigationItemType[];

  constructor(props: any) {
    super(props);
    // Transform JSON data to NavigationItemType with resolved icons
    this.navigationItems = menuData.navigationItems.map(
      transformNavigationItem
    );
  }

  private handleLogoClick = () => {
    window.history.pushState(null, "", "/home");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  protected renderContent() {
    const className = (this.props as any).className;

    return (
      <div className={`header-container ${className || ""}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={this.handleLogoClick}
              className="flex-shrink-0 cursor-pointer border-none bg-transparent p-0"
            >
              <img
                src={logoTransparent}
                className="h-12 -my-1"
                alt="Invest Mate - Trading Management Platform"
              />
            </button>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {this.navigationItems.map((item) => (
                <NavigationItem key={item.label} item={item} />
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="header-actions__button"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="header-actions__button"
            >
              <Search className="h-4 w-4" />
            </Button>

            <AuthUserAvatar />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Navigation</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="header-nav__mobile-dropdown"
                sideOffset={5}
                align="start"
              >
                {this.navigationItems.map((item) => (
                  <MobileNavigationItem key={item.label} item={item} />
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    );
  }
}
