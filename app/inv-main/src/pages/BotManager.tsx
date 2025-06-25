import {
  DataTable,
  ItemView,
  useItemView,
  QueryBuilderPanel,
  ThreeColumnLayout,
} from "rjs-admin";
import {
  PageModule,
  updatePageParams,
  useAppContext,
  usePageContext,
} from "rjs-frame";
import {
  Header,
  PortfolioCard,
  BotDefinitionDetailView,
  BotInstanceDetailView,
  BlockListView,
} from "../components";

const BotItemView = () => {
  const pageContext = usePageContext();

  if (!pageContext.pageParams.bot_id) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
        No bot selected
      </div>
    );
  }

  const itemId = pageContext.pageParams.bot_id as string;
  const status = pageContext.pageParams.status as string;
  return (
      <ItemView
        itemId={itemId}
        resourceName="trade-bot:bot-listing"
        className="no-border h-full"
        itemJsonView={true}
        defaultTab="bot-info"
      >
        <ItemView.TabItem name="bot-info" label="Bot Info">
          {status == 'INACTIVE' ? <BotDefinitionDetailView/> : <BotInstanceDetailView/>}
        </ItemView.TabItem>      
      </ItemView>
    );
};

export default function BotManager() {
  const { config: appConfig } = useAppContext();

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
        <PortfolioCard />
        <BlockListView
          resourceName="trade-manager:block-listing"
        />
        <BlockListView
          resourceName="trade-manager:block-listing"
        />
      </PageModule>

      <PageModule slotName="main" className="h-full">
        <DataTable
          resourceName="trade-bot:bot-listing"
          className="no-border h-full"
          showHeaderTitle={false}
          queryState={{
            select: ["name", "started_date", "profit", "profit_value", "applied_blocks", "status"],
          }}
          onActivate={(id, row) => {
            updatePageParams({ 
              bot_id: id as string,
              status: row.status as string,
            });
          }}
        />
      </PageModule>

      <PageModule slotName="rightPanel">
        <BotItemView />
      </PageModule>

      <PageModule className="p-4" slotName="footer">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2025 {appConfig?.get("app.name")}. All rights reserved.</p>
          <p>Version: {appConfig?.get("app.version")}</p>
        </div>
      </PageModule>
    </ThreeColumnLayout>
  );
}
