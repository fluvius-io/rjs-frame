import type { Meta, StoryObj } from "@storybook/react";
import { RjsApp } from "rjs-frame";
import { AuthUserAvatar } from "./AuthUserAvatar";

const meta: Meta<typeof AuthUserAvatar> = {
  title: "Common/AuthUserAvatar",
  component: AuthUserAvatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    avatarUrl: {
      control: "text",
      description: "URL to user's profile image",
    },
    initials: {
      control: "text",
      description:
        "Custom initials (auto-generated from AuthContext name if not provided)",
    },
    showLoadingState: {
      control: "boolean",
      description: "Show loading state while fetching auth data",
    },
    onProfileClick: { action: "profile clicked" },
    onSettingsClick: { action: "settings clicked" },
    onLogoutClick: { action: "logout clicked" },
    onAdminClick: { action: "admin clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Story with simulated auth context - would need RjsApp wrapper
export const WithMockAuth: Story = {
  decorators: [
    (Story) => (
      <RjsApp>
        <Story />
      </RjsApp>
    ),
  ],
  args: {
    avatarUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=John",
  },
};

// Story showing loading state
export const LoadingState: Story = {
  decorators: [
    (Story) => (
      <RjsApp>
        <Story />
      </RjsApp>
    ),
  ],
  args: {
    showLoadingState: true,
  },
};

// Story showing not authenticated state
export const NotAuthenticated: Story = {
  args: {
    showLoadingState: false,
  },
};

// Story with custom fallback content
export const CustomFallback: Story = {
  args: {
    showLoadingState: false,
    fallbackContent: (
      <div className="flex items-center gap-3 p-2 border border-dashed rounded-lg">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          ?
        </div>
        <div>
          <div className="text-sm font-medium">Guest User</div>
          <div className="text-xs text-muted-foreground">
            Sign in to continue
          </div>
        </div>
      </div>
    ),
  },
};

// Story with name and email overrides - these will work as they're part of AuthUserAvatarProps
export const WithOverrides: Story = {
  decorators: [
    (Story) => (
      <RjsApp>
        <Story />
      </RjsApp>
    ),
  ],
  args: {
    avatarUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=Override",
  },
};

// Story with custom menu items
export const WithCustomMenuItems: Story = {
  decorators: [
    (Story) => (
      <RjsApp>
        <Story />
      </RjsApp>
    ),
  ],
  args: {
    avatarUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=Custom",
    menuItems: (
      <>
        <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <span>🎨</span>
          <span>Theme</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <span>🔔</span>
          <span>Notifications</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <span>📊</span>
          <span>Analytics</span>
        </div>
      </>
    ),
  },
};

// Story demonstrating admin functionality
export const AdminUser: Story = {
  decorators: [
    (Story) => (
      <RjsApp>
        <Story />
      </RjsApp>
    ),
  ],
  args: {
    avatarUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=Admin",
    onAdminClick: () => console.log("Admin panel clicked"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows admin menu item when the user has super admin privileges in AuthContext",
      },
    },
  },
};

// Compact comparison story
export const ComparisonSizes: Story = {
  decorators: [
    (Story) => (
      <RjsApp>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Default Size</h3>
            <Story />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">With Custom Class</h3>
            <AuthUserAvatar className="p-2 bg-muted rounded" />
          </div>
        </div>
      </RjsApp>
    ),
  ],
  args: {},
};
