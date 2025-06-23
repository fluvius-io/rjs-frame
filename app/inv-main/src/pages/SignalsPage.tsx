import {
  DataTable,
  ItemView,
  QueryBuilderPanel,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule, updatePageParams, usePageContext } from "rjs-frame";
import { Header } from "../components";

const SignalItemView = () => {
  const pageContext = usePageContext();
  if (!pageContext.pageParams.org) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
        No organization selected
      </div>
    );
  }

  const itemId = pageContext.pageParams.org as string;

  return (
    <ItemView
      itemId={itemId}
      resourceName="trade-signal:signal"
      className="no-border h-full"
    >
      <ItemView.TabItem name="hello" label="Transactions">
        Hello world from bots ...
      </ItemView.TabItem>
      <ItemView.TabItem name="blocks" label="Blocks">
        A lot of blocks here ...
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
          fields={["id", "name", "dba_name"]}
          metaSource="trade-signal:signal"
          className="no-border h-full"
        />
      </PageModule>

      <PageModule slotName="main" className="h-full">
        <DataTable
          resourceName="trade-signal:signal"
          className="no-border h-full"
          showHeaderTitle={false}
          title="Signals"
          description="Signals are the core of the trading system. They are the inputs to the trading system."
          onActivate={(id) => {
            updatePageParams({ org: id as string });
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
