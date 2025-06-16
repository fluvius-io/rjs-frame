import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "../../../src/components/common/UserAvatar";

const meta: Meta<typeof UserAvatar> = {
  title: "Common/UserAvatar",
  component: UserAvatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "User's full name",
    },
    email: {
      control: "text",
      description: "User's email address",
    },
    avatarUrl: {
      control: "text",
      description: "URL to user's profile image",
    },
    initials: {
      control: "text",
      description: "Custom initials (auto-generated from name if not provided)",
    },
    onProfileClick: { action: "profile clicked" },
    onSettingsClick: { action: "settings clicked" },
    onLogoutClick: { action: "logout clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=John",
  },
};

export const WithoutAvatar: Story = {
  args: {
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
};

export const WithCustomInitials: Story = {
  args: {
    name: "Robert Johnson",
    email: "r.johnson@example.com",
    initials: "RJ",
  },
};

export const LongName: Story = {
  args: {
    name: "Alexander Christopher Montgomery",
    email: "alexander.montgomery@company.com",
    avatarUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=Alexander",
  },
};

export const WithCustomMenuItems: Story = {
  args: {
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=Sarah",
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
      </>
    ),
  },
};
