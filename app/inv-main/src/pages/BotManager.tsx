import { CopyIcon, FilePlus, PauseIcon, PlayIcon } from "lucide-react";
import {
  DataTable,
  ItemView,
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
  BotDefinitionDetailView,
  BotInstanceDetailView,
  Header,
  PortfolioCard,
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
      itemJsonView={false}
      defaultTab="bot-info"
    >
      <ItemView.TabItem name="bot-info" label="Bot Info">
        {status == "INACTIVE" ? (
          <BotDefinitionDetailView />
        ) : (
          <BotInstanceDetailView />
        )}
      </ItemView.TabItem>
    </ItemView>
  );
};

export default function BotManager() {
  const { config: appConfig } = useAppContext();
  const tableActions = [
    {
      label: "Add Bot",
      className: "dt-query-builder-trigger button-primary text-nowrap",
      icon: <FilePlus className="w-4 h-4" />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>, data: any) => {
        console.log(
          "Simulate API call to duplicate bot ... no action performed.",
          data
        );
      },
    },
    {
      label: "Duplicate",
      className: "dt-query-builder-trigger button-primary text-nowrap",
      icon: <CopyIcon className="w-4 h-4" />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>, data: any) => {
        console.log(
          "Simulate API call to duplicate bot ... no action performed.",
          data
        );
      },
    },
  ];
  const rowActions = [
    {
      label: "Duplicate",
      icon: <CopyIcon className="w-4 h-4" />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>, row: any) => {
        console.log(
          "Simulate API call to duplicate bot ... no action performed.",
          e
        );
      },
    },
    {
      label: (row: any) => (row.status == "INACTIVE" ? "Start" : "Stop"),
      icon: (row: any) =>
        row.status == "INACTIVE" ? (
          <PlayIcon className="w-4 h-4" />
        ) : (
          <PauseIcon className="w-4 h-4" />
        ),
      onClick: (e: React.MouseEvent<HTMLButtonElement>, row: any) => {
        row.status = row.status == "INACTIVE" ? "ACTIVE" : "INACTIVE";
        console.log(
          "Simulate API call to update bot status ... no action performed.",
          e
        );
      },
    },
  ];

  const batchActions = [
    {
      label: "Duplicate",
      icon: <CopyIcon className="w-4 h-4" />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>, row: any) => {
        console.log(
          "Simulate API call to duplicate bot ... no action performed.",
          e
        );
      },
    },
    {
      label: (row: any) => (row.status == "INACTIVE" ? "Start" : "Stop"),
      icon: (row: any) =>
        row.status == "INACTIVE" ? (
          <PlayIcon className="w-4 h-4" />
        ) : (
          <PauseIcon className="w-4 h-4" />
        ),
      onClick: (e: React.MouseEvent<HTMLButtonElement>, row: any) => {
        row.status = row.status == "INACTIVE" ? "ACTIVE" : "INACTIVE";
        console.log(
          "Simulate API call to update bot status ... no action performed.",
          e
        );
      },
    },
  ];

  return (
    <ThreeColumnLayout
      sidebarWidth="lg"
      slotClasses={{
        main: "no-padding",
        sidebar: "no-padding flex flex-col gap-4",
        rightPanel: "no-padding",
      }}
    >
      <Header slotName="header" />

      <PageModule slotName="sidebar">
        <PortfolioCard />
      </PageModule>

      <PageModule slotName="sidebar">
        <QueryBuilderPanel
          fields={["bot_name", "status"]}
          metaSource="trade-bot:bot-listing"
          className="no-border h-full"
        />
      </PageModule>
      <PageModule slotName="main" className="h-full">
        <DataTable
          title="Bot Manager"
          description="Manage your trading bots and their instances"
          resourceName="trade-bot:bot-listing"
          className="no-border h-full"
          showHeaderTitle={false}
          tableActions={tableActions}
          batchActions={batchActions}
          queryState={{
            select: [
              "name",
              "started_date",
              "profit",
              "profit_value",
              "applied_blocks",
              "status",
            ],
          }}
          onActivate={(id, row) => {
            updatePageParams({
              bot_id: id as string,
              status: row.status as string,
            });
          }}
          rowActions={rowActions}
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
