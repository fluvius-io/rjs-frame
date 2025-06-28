import { ItemView, ModalView, SwitcherViewComponentProps } from "rjs-admin";
import { AlgorithmCard } from "../components";

export function AlgoModal(props: SwitcherViewComponentProps) {
  const { itemId, title, onOpenChange } = props;

  return (
    <ModalView
      open={true}
      onOpenChange={onOpenChange || (() => {})}
      title={title || "User Details"}
    >
      <ItemView
        itemId={itemId}
        resourceName="trade-signal:signal"
        className="no-border h-full"
        defaultTab="algo"
        itemJsonView={true}
      >
        <ItemView.TabItem name="algo" label="Algorithm">
          <AlgorithmCard className="h-full no-border" />
        </ItemView.TabItem>
        <ItemView.TabItem name="config" label="Configuration">
          <div>Configuration</div>
        </ItemView.TabItem>
      </ItemView>
    </ModalView>
  );
}

export default AlgoModal;
