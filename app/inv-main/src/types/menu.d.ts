// Type definitions for menu.json
export interface MenuItemData {
  label: string;
  icon: string;
  href: string;
  description: string;
  submenu?: {
    label: string;
    icon: string;
    href: string;
    description: string;
  }[];
}

export interface MenuData {
  navigationItems: MenuItemData[];
}

declare module "*/menu.json" {
  const value: MenuData;
  export default value;
}
