import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  Database,
  Search,
  TrendingUp,
  Zap,
} from "lucide-react";
import React from "react";
import { AuthUserAvatar, Button } from "rjs-admin";
import { PageModule } from "rjs-frame";
import logoTransparent from "../assets/img/logo-transparent.png";
import "./Header.css";

// Simple Navigation Item without JavaScript hover management
const NavigationItem: React.FC<{
  item: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    description: string;
  };
}> = ({ item }) => {
  const handleNavigation = (href: string) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="header-nav__container">
      <button className="header-nav__trigger">
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

        <div
          className="header-nav__dropdown-item"
          onClick={() => handleNavigation(`${item.href}/settings`)}
        >
          <Activity className="header-nav__dropdown-icon" />
          <div className="header-nav__dropdown-text">
            <span className="header-nav__dropdown-title">
              {item.label} Settings
            </span>
            <span className="header-nav__dropdown-description">
              Configure {item.label.toLowerCase()} preferences
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Navigation Item Component (unchanged)
const MobileNavigationItem: React.FC<{
  item: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
    description: string;
  };
}> = ({ item }) => {
  const handleNavigation = (href: string) => {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <DropdownMenu.Item
      className="header-nav__mobile-item"
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
  private navigationItems = [
    {
      label: "Bots",
      icon: Bot,
      href: "/bots",
      description: "Automated trading bots",
    },
    {
      label: "Signals",
      icon: Zap,
      href: "/signals",
      description: "Trading signals and alerts",
    },
    {
      label: "Exchange",
      icon: TrendingUp,
      href: "/exchange",
      description: "Exchange trading",
    },
    {
      label: "Data",
      icon: Database,
      href: "/data",
      description: "Market data and analytics",
    },
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/portfolio",
      description: "Analytics dashboard",
    },
  ];

  constructor(props: any) {
    super(props);
  }

  private handleLogoClick = () => {
    window.history.pushState(null, "", "/home");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  protected renderContent(): React.ReactNode {
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
                alt="Invest Mate - Trading Management Platform"
                style={{ height: "60px", margin: "-16px 0px" }}
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
