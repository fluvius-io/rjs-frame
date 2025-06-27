import React from "react";
import { TabbedItemView } from "../src/components/itemview";

const TabbedItemViewExample: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">TabbedItemView Example</h2>

      <TabbedItemView
        itemId="93380e50-9ffe-4f10-8895-b6ea2b644713"
        resourceName="idm:user"
        defaultTab="details"
      >
        <TabbedItemView.TabItem name="details" label="Details">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <p>This tab shows detailed user information.</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                Custom content can be added here for the Details tab.
              </p>
            </div>
          </div>
        </TabbedItemView.TabItem>

        <TabbedItemView.TabItem name="settings" label="Settings">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Settings</h3>
            <p>This tab shows user settings and preferences.</p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">
                Settings content can be customized here.
              </p>
            </div>
          </div>
        </TabbedItemView.TabItem>

        <TabbedItemView.TabItem name="activity" label="Activity">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Activity</h3>
            <p>This tab shows user activity and history.</p>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600">
                Activity logs and history can be displayed here.
              </p>
            </div>
          </div>
        </TabbedItemView.TabItem>
      </TabbedItemView>
    </div>
  );
};

export default TabbedItemViewExample;
