import {
  DataTable,
  ItemView,
  QueryBuilderPanel,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule, updatePageParams, usePageContext } from "rjs-frame";
import { Header } from "../components";

const BotItemView = () => {
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
      resourceName="idm:organization"
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

export default function BotManager() {
  return (
    <ThreeColumnLayout
      sidebarWidth="lg"
      slotClasses={{ main: "no-padding", sidebar: "no-padding" }}
    >
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <QueryBuilderPanel
          fields={["id", "name", "dba_name"]}
          metaSource="idm:organization"
          className="no-border h-full"
        />
      </PageModule>

      <PageModule slotName="main" className="h-full">
        <DataTable
          resourceName="idm:organization"
          className="no-border h-full"
          showHeaderTitle={false}
          onActivate={(id) => {
            updatePageParams({ org: id as string });
          }}
        />
      </PageModule>

      <PageModule slotName="rightPanel">
        <BotItemView />
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
