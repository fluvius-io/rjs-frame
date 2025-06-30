import {
  DataTable,
  ItemView,
  QueryBuilderPanel,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule, updatePageParams, usePageContext } from "rjs-frame";
import { AlgorithmCard, Header, SignalDetailView } from "../components";

const SignalItemView = () => {
  const pageContext = usePageContext();

  if (!pageContext.pageParams.algo) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
        No algorithm selected
      </div>
    );
  }

  const itemId = pageContext.pageParams.algo as string;
  return (
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
      <ItemView.TabItem name="signal-detail" label="Signal Detail">
        <SignalDetailView />
      </ItemView.TabItem>
    </ItemView>
  );
};

export default function SignalsPage() {
  return (
    <ThreeColumnLayout
      sidebarWidth="lg"
      slotClasses={{
        main: "no-padding",
        sidebar: "no-padding",
        rightPanel: "no-padding",
      }}
    >
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <QueryBuilderPanel
          fields={[
            "id",
            "name",
            "market",
            "tags",
            "compute_tier",
          ]}
          metaSource="trade-signal:signal"
          className="no-border h-full"
        />
      </PageModule>

      <PageModule slotName="main" className="h-full">
        <DataTable
          resourceName="trade-signal:signal"
          className="no-border h-full"
          showHeaderTitle={false}
          queryState={{
            select: ["key", "name", "market", "compute_tier", "tags"],
          }}
          title="Signals"
          description="Signals are the core of the trading system. They are the inputs to the trading system."
          onActivate={(id) => {
            updatePageParams({ algo: id as string });
          }}
        />
      </PageModule>

      <PageModule slotName="rightPanel">
        <SignalItemView />
      </PageModule>

      <PageModule className="p-4" slotName="footer">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2025 Invest Mate (invest-mate.net). All rights reserved.</p>
          <p>Last updated: 2 minutes ago</p>
        </div>
      </PageModule>
    </ThreeColumnLayout>
  );
}
