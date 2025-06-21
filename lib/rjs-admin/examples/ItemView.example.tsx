import React from "react";
import { Button } from "../src/components/common/Button";
import {
  ItemView,
  TabItem,
  useItemView,
} from "../src/components/itemview/ItemView";

/**
 * ItemView Usage Examples
 * Demonstrates different ways to use the ItemView component
 */

// Basic usage example
export const BasicItemViewExample: React.FC = () => (
  <div>
    <h2>Basic Item View</h2>
    <ItemView
      itemId="42a7f9a5-7e12-4384-a97d-abe9271797dd"
      resourceName="idm:user"
    />
  </div>
);

// Custom tab component example
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

// ItemView with custom tabs
export const CustomTabsExample: React.FC = () => (
  <div>
    <h2>Item View with Custom Tabs</h2>
    <ItemView
      itemId="42a7f9a5-7e12-4384-a97d-abe9271797dd"
      resourceName="idm:user"
      defaultTab="profile"
    >
      <TabItem name="profile" label="Profile">
        <UserProfileTab />
      </TabItem>
      <TabItem name="settings" label="Settings">
        <UserSettingsTab />
      </TabItem>
    </ItemView>
  </div>
);

// Organization item view example
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

export const OrganizationItemViewExample: React.FC = () => (
  <div>
    <h2>Organization Item View</h2>
    <ItemView itemId="org123" resourceName="idm:organization">
      <TabItem name="details" label="Details">
        <OrganizationDetailsTab />
      </TabItem>
      <TabItem name="users" label="Users">
        <OrganizationUsersTab />
      </TabItem>
    </ItemView>
  </div>
);

// ItemView with parameters
export const ItemViewWithParamsExample: React.FC = () => (
  <div>
    <h2>Item View with Parameters</h2>
    <ItemView
      itemId="42a7f9a5-7e12-4384-a97d-abe9271797dd"
      resourceName="idm:user"
      params={{
        cache: false,
        headers: {
          "X-Custom-Header": "value",
        },
      }}
      onLoad={(data) => console.log("User loaded:", data)}
      onError={(error) => console.error("Error:", error)}
    />
  </div>
);

// All examples combined
export const ItemViewExamples: React.FC = () => (
  <div
    style={{
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <h1>ItemView Component Examples</h1>
    <p style={{ color: "#666", marginBottom: "20px" }}>
      Generic item view component with tab functionality and context support
    </p>

    <div style={{ marginBottom: "40px" }}>
      <BasicItemViewExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <CustomTabsExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <OrganizationItemViewExample />
    </div>

    <div style={{ marginBottom: "40px" }}>
      <ItemViewWithParamsExample />
    </div>
  </div>
);

export default ItemViewExamples;
