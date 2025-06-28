import {
  ItemView,
  ModalView,
  SwitcherViewComponentProps,
} from "../components/view";

export function UserProfileModal(props: SwitcherViewComponentProps) {
  const { itemId, defaultTab, onOpenChange } = props;

  return (
    <ModalView open={true} onOpenChange={onOpenChange || (() => {})}>
      <ItemView
        itemId={itemId}
        resourceName="user-profile:profile"
        defaultTab={defaultTab || "details"}
      >
        <ItemView.TabItem name="details" label="Details">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Details</h3>
            <p>This tab shows detailed user information in a modal.</p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                Modal content can be customized with tabs and custom content.
              </p>
            </div>
          </div>
        </ItemView.TabItem>

        <ItemView.TabItem name="settings" label="Settings">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Settings</h3>
            <p>This tab shows user settings and preferences.</p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">
                Settings content in modal view.
              </p>
            </div>
          </div>
        </ItemView.TabItem>

        <ItemView.TabItem name="activity" label="Activity">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Activity</h3>
            <p>This tab shows user activity and history.</p>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600">
                Activity logs displayed in modal format.
              </p>
            </div>
          </div>
        </ItemView.TabItem>
      </ItemView>
    </ModalView>
  );
}

export default UserProfileModal;
