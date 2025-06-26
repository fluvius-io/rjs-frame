import { BanIcon, CopyIcon, FilePlus, PauseIcon, PlayIcon } from "lucide-react";
import { cn, DataTable, ItemView, ThreeColumnLayout } from "rjs-admin";
import {
  PageModule,
  updatePageParams,
  useAppContext,
  usePageContext,
} from "rjs-frame";
import {
  BlockListView,
  BotDefinitionDetailView,
  BotInstanceDetailView,
  Header,
  PortfolioCard,
  StockListView,
} from "../components";

const botStatusFormatter = (status: string) => {
  const colorMap = {
    DRAFT: "bg-purple-100 text-purple-800",
    DEACTIVATED: "bg-gray-100 text-gray-800",
    RUNNING: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-600",
    PAUSED: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={cn(
        "text-center text-xs font-medium border-gray-200 rounded-md p-1",
        colorMap[status as keyof typeof colorMap] || "text-gray-400 bg-gray-100"
      )}
    >
      {status}
    </div>
  );
};

const botStatusTransition = (status: string) => {
  const transitionMap = {
    DRAFT: "RUNNING",
    RUNNING: "PAUSED",
    PAUSED: "RUNNING",
    INACTIVE: "RUNNING",
  };
  return transitionMap[status as keyof typeof transitionMap] || "INACTIVE";
};
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
  ];
  const rowActions = [
    {
      label: (row: any) => (row.status == "INACTIVE" ? "Start" : "Stop"),
      icon: (row: any) => {
        switch (row.status) {
          case "INACTIVE":
            return <PlayIcon className="w-4 h-4 text-green-500" />;
          case "RUNNING":
            return <PauseIcon className="w-4 h-4 text-red-500" />;
          case "PAUSED":
            return <PlayIcon className="w-4 h-4 text-green-500" />;
          case "DEACTIVATED":
            return <BanIcon className="w-4 h-4" />;
          default:
            return <PlayIcon className="w-4 h-4 text-green-500" />;
        }
      },
      onClick: (e: React.MouseEvent<HTMLButtonElement>, row: any) => {
        if (row.status == "DEACTIVATED") {
          console.log("Do nothing on DEACTIVATED");
        } else {
          row.status = botStatusTransition(row.status);
        }
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
        <BlockListView resourceName="trade-manager:block-listing" />
      </PageModule>
      <PageModule slotName="sidebar">
        <StockListView resourceName="trade-manager:asset-summary" />
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
            select: ["name", "profit", "applied_blocks", "status"],
          }}
          onActivate={(id, row) => {
            updatePageParams({
              bot_id: id as string,
              status: row.status as string,
            });
          }}
          rowActions={rowActions}
          customFormatters={{
            status: (value: string) => botStatusFormatter(value),
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
