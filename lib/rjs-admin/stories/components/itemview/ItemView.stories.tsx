import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Button } from "../../../src/components/common/Button";
import {
  ItemView,
  TabItem,
  useItemView,
} from "../../../src/components/itemview/ItemView";
import "../../../src/lib/api";

// Custom tab component for stories
const UserProfileTab: React.FC = () => {
  const { item, loading, error } = useItemView();

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!item) return <div>No user data</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h3>User Profile</h3>
      <div style={{ display: "grid", gap: "1rem", maxWidth: "400px" }}>
        <div>
          <label style={{ fontWeight: "bold" }}>Name:</label>
          <p>
            {item.name__given} {item.name__family}
          </p>
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Email:</label>
          <p>{item.verified_email}</p>
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Role:</label>
          <p>{item.role}</p>
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Status:</label>
          <p
            style={{
              color: item.status === "active" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {item.status}
          </p>
        </div>
      </div>
    </div>
  );
};

const UserSettingsTab: React.FC = () => {
  const { item, refreshItem } = useItemView();

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3>User Settings</h3>
        <Button size="sm" onClick={refreshItem}>
          Refresh Data
        </Button>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <div>
          <h4>User Preferences</h4>
          <p>
            Settings for user: {item?.name__given} {item?.name__family}
          </p>
        </div>

        <div>
          <h4>Account Information</h4>
          <div
            style={{
              background: "#f5f5f5",
              padding: "1rem",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "0.875rem",
            }}
          >
            <p>User ID: {item?.id}</p>
            <p>Email: {item?.verified_email}</p>
            <p>Role: {item?.role}</p>
            <p>Status: {item?.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Organization tab components
const OrganizationDetailsTab: React.FC = () => {
  const { item } = useItemView();

  if (!item) return <div>No organization data</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Organization Details</h3>
      <div style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}>
        <div>
          <label style={{ fontWeight: "bold" }}>Name:</label>
          <p>{item.name}</p>
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>DBA Name:</label>
          <p>{item.dba_name || "N/A"}</p>
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Type:</label>
          <p>{item.type}</p>
        </div>
        <div>
          <label style={{ fontWeight: "bold" }}>Status:</label>
          <p
            style={{
              color: item.status === "active" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {item.status}
          </p>
        </div>
      </div>
    </div>
  );
};

const OrganizationUsersTab: React.FC = () => {
  const { itemId } = useItemView();

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Organization Users</h3>
      <p>Users for organization ID: {itemId}</p>
      <div
        style={{
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "4px",
          textAlign: "center",
        }}
      >
        <p>This tab could fetch and display users from a separate API</p>
        <p>
          e.g., APIManager.query("idm:user", {"{"} search: {"{"}{" "}
          organization_id: itemId {"}"} {"}"})
        </p>
      </div>
    </div>
  );
};

// Advanced tab with data fetching
const UserActivityTab: React.FC = () => {
  const { item, itemId } = useItemView();
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (itemId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setActivities([
          { id: 1, action: "Login", timestamp: "2024-01-15T10:30:00Z" },
          {
            id: 2,
            action: "Profile Update",
            timestamp: "2024-01-14T15:45:00Z",
          },
          {
            id: 3,
            action: "Password Change",
            timestamp: "2024-01-13T08:20:00Z",
          },
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [itemId]);

  return (
    <div style={{ padding: "1rem" }}>
      <h3>User Activity</h3>
      <p>
        Recent activity for: {item?.name__given} {item?.name__family}
      </p>

      {loading ? (
        <div>Loading activities...</div>
      ) : (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                padding: "0.75rem",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                background: "white",
              }}
            >
              <div style={{ fontWeight: "bold" }}>{activity.action}</div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof ItemView> = {
  title: "ItemView/ItemView",
  component: ItemView,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ItemView is a generic component for retrieving and displaying items using APIManager with tab functionality and context support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    itemId: {
      control: "text",
      description: "The unique identifier of the item to fetch",
    },
    resourceName: {
      control: "text",
      description: "The API endpoint name to fetch from",
    },
    defaultTab: {
      control: "select",
      options: ["details", "profile", "settings", "activity"],
      description: "Default active tab",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    onError: {
      action: "error",
      description: "Callback function called when an error occurs",
    },
    onLoad: {
      action: "loaded",
      description: "Callback function called when data is loaded",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicUser: Story = {
  args: {
    itemId: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    resourceName: "idm:user",
  },
};

export const WithCustomTabs: Story = {
  args: {
    itemId: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    resourceName: "idm:user",
    defaultTab: "profile",
  },
  render: (args) => (
    <ItemView {...args}>
      <TabItem name="profile" label="Profile">
        <UserProfileTab />
      </TabItem>
      <TabItem name="settings" label="Settings">
        <UserSettingsTab />
      </TabItem>
    </ItemView>
  ),
};

export const Organization: Story = {
  args: {
    itemId: "org123",
    resourceName: "idm:organization",
  },
};

export const OrganizationWithTabs: Story = {
  args: {
    itemId: "org123",
    resourceName: "idm:organization",
    defaultTab: "details",
  },
  render: (args) => (
    <ItemView {...args}>
      <TabItem name="details" label="Details">
        <OrganizationDetailsTab />
      </TabItem>
      <TabItem name="users" label="Users">
        <OrganizationUsersTab />
      </TabItem>
    </ItemView>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    itemId: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    resourceName: "idm:user",
    className: "custom-item-view-style",
  },
};

export const WithParameters: Story = {
  args: {
    itemId: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    resourceName: "idm:user",
    params: {
      cache: false,
      headers: {
        "X-Custom-Header": "value",
      },
    },
  },
};

export const WithMultipleTabs: Story = {
  args: {
    itemId: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    resourceName: "idm:user",
    defaultTab: "profile",
  },
  render: (args) => (
    <ItemView {...args}>
      <TabItem name="profile" label="Profile">
        <UserProfileTab />
      </TabItem>
      <TabItem name="settings" label="Settings">
        <UserSettingsTab />
      </TabItem>
      <TabItem name="activity" label="Activity">
        <UserActivityTab />
      </TabItem>
    </ItemView>
  ),
};

export const LoadingState: Story = {
  args: {
    itemId: "loading-user",
    resourceName: "idm:user",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the loading state when fetching data",
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    itemId: "invalid-user",
    resourceName: "idm:user",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the error state when data cannot be fetched",
      },
    },
  },
};

export const WithCallbacks: Story = {
  args: {
    itemId: "42a7f9a5-7e12-4384-a97d-abe9271797dd",
    resourceName: "idm:user",
    onLoad: (data) => console.log("User loaded:", data),
    onError: (error) => console.error("Error:", error),
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates the use of callback functions for data events",
      },
    },
  },
};
