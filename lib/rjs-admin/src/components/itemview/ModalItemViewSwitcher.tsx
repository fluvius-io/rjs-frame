import { updatePageParams, usePageContext } from "rjs-frame";
import ModalItemView from "./ModalItemView";

const ModalItemViewSwitcher = ({ children }: { children: React.ReactNode }) => {
  const { pageParams } = usePageContext();
  const isModalOpen = Boolean(pageParams.modal);

  if (!isModalOpen) {
    return null;
  }

  const [modalType, itemId] = (pageParams.modal as string).split(".");
  const modalClose = () => {
    updatePageParams({ modal: undefined });
  };

  return (
    <ModalItemView
      open={isModalOpen}
      onOpenChange={modalClose}
      itemId={itemId}
      resourceName="user-profile:profile"
      title={`User Details [${modalType}]`}
      defaultTab="details"
    >
      {children}
    </ModalItemView>
  );
};

export default ModalItemViewSwitcher;
