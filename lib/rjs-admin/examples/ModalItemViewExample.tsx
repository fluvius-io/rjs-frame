import React, { useState } from "react";
import { Button } from "../src/components/common/Button";
import { ModalItemView } from "../src/components/itemview";

const ModalItemViewExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">ModalItemView Example</h2>

      <div className="space-y-4">
        <p className="text-gray-600">
          Click the button below to open a modal with item details.
        </p>

        <Button onClick={() => setIsModalOpen(true)} variant="default">
          Open User Details Modal
        </Button>
      </div>

      <ModalItemView
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        itemId="93380e50-9ffe-4f10-8895-b6ea2b644713"
        resourceName="idm:user"
        title="User Details"
        defaultTab="details"
      >
        <ModalItemView.TabItem name="details" label="Details">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <p>This tab shows detailed user information in a modal.</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                Modal content can be customized with tabs and custom content.
              </p>
            </div>
          </div>
        </ModalItemView.TabItem>

        <ModalItemView.TabItem name="settings" label="Settings">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Settings</h3>
            <p>This tab shows user settings and preferences.</p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">
                Settings content in modal view.
              </p>
            </div>
          </div>
        </ModalItemView.TabItem>

        <ModalItemView.TabItem name="activity" label="Activity">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Activity</h3>
            <p>This tab shows user activity and history.</p>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600">
                Activity logs displayed in modal format.
              </p>
            </div>
          </div>
        </ModalItemView.TabItem>
      </ModalItemView>
    </div>
  );
};

export default ModalItemViewExample;
