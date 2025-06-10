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

interface HeaderProps {
  className?: string;
  slotName?: string;
  data?: Record<string, any>;
}

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
      href: "/dashboard",
      description: "Analytics dashboard",
    },
  ];

  constructor(props: any) {
    super(props);
  }

  protected renderContent(): React.ReactNode {
    const className = (this.props as any).className;

    return (
      <div className={`header-container ${className || ""}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <a href="/" className="flex-shrink-0">
              <img
                src={logoTransparent}
                alt="Invest Mate - Trading Management Platform"
                style={{ height: "60px", margin: "-16px 0px" }}
              />
            </a>

            {/* Main Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {this.navigationItems.map((item) => (
                <DropdownMenu.Root key={item.label}>
                  <DropdownMenu.Trigger asChild>
                    <button className="header-nav__trigger">
                      <item.icon className="header-nav__icon" />
                      <span className="header-nav__label">{item.label}</span>
                      <ChevronDown className="header-nav__chevron" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="header-nav__dropdown-content"
                      sideOffset={5}
                      align="start"
                    >
                      <DropdownMenu.Item
                        className="header-nav__dropdown-item"
                        asChild
                      >
                        <a href={item.href}>
                          <item.icon className="header-nav__dropdown-icon" />
                          <div className="header-nav__dropdown-text">
                            <span className="header-nav__dropdown-title">
                              {item.label}
                            </span>
                            <span className="header-nav__dropdown-description">
                              {item.description}
                            </span>
                          </div>
                        </a>
                      </DropdownMenu.Item>

                      <DropdownMenu.Separator className="header-nav__dropdown-separator" />

                      <DropdownMenu.Item
                        className="header-nav__dropdown-item"
                        asChild
                      >
                        <a href={`${item.href}/settings`}>
                          <Activity className="header-nav__dropdown-icon" />
                          <div className="header-nav__dropdown-text">
                            <span className="header-nav__dropdown-title">
                              {item.label} Settings
                            </span>
                            <span className="header-nav__dropdown-description">
                              Configure {item.label.toLowerCase()} preferences
                            </span>
                          </div>
                        </a>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
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
                  <DropdownMenu.Item
                    key={item.label}
                    className="header-nav__mobile-item"
                    asChild
                  >
                    <a href={item.href}>
                      <item.icon className="header-nav__mobile-icon" />
                      <div className="header-nav__mobile-text">
                        <span className="header-nav__mobile-title">
                          {item.label}
                        </span>
                        <span className="header-nav__mobile-description">
                          {item.description}
                        </span>
                      </div>
                    </a>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    );
  }
}
