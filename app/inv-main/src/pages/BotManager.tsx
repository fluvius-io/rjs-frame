import {
  BanIcon,
  CopyIcon,
  FilePlus,
  PauseIcon,
  PlayIcon,
  SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import {
  cn,
  DataTable,
  ItemView,
  ModalViewSwitcher,
  ThreeColumnLayout,
} from "rjs-admin";
import {
  APIManager,
  PageModule,
  updatePageParams,
  useAppContext,
  usePageContext,
} from "rjs-frame";
import {
  BlockListView,
  BotConfigModal,
  BotDefinitionDetailView,
  BotInstanceDetailView,
  Header,
  StockListView,
} from "../components";
import "../components/Status.css";

const botStatusFormatter = (status: string) => {
  const colorMap = {
    DRAFT: "status-draft",
    DEACTIVATED: "status-deactivated",
    RUNNING: "status-running",
    INACTIVE: "status-inactive",
    PAUSED: "status-paused",
  };

  return (
    <div
      className={cn(
        "text-center text-xs font-medium border-gray-200 rounded-md p-1 w-20",
        colorMap[status as keyof typeof colorMap] || "text-gray-400 bg-gray-100"
      )}
    >
      {status}
    </div>
  );
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
      params={{ search: { status: status } }}
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
  const [showBotConfigModal, setShowBotConfigModal] = useState(false);
  const [botToConfig, setBotToConfig] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            return <SettingsIcon className="w-4 h-4 text-blue-500" />;
          case "RUNNING":
            return <PauseIcon className="w-4 h-4 text-red-500" />;
          case "PAUSED":
            return <PlayIcon className="w-4 h-4 text-green-500" />;
          case "DEACTIVATED":
            return <BanIcon className="w-4 h-4" />;
          default:
            return <SettingsIcon className="w-4 h-4 text-green-500" />;
        }
      },
      onClick: async (e: React.MouseEvent<HTMLButtonElement>, row: any) => {
        switch (row.status) {
          case "INACTIVE":
            setBotToConfig(row.id);
            setShowBotConfigModal(true);
            break;
          case "DEACTIVATED":
            console.log("Do nothing on DEACTIVATED");
            break;
          case "RUNNING": {
            row.status = "PAUSED";
            try {
              const response = await APIManager.send(
                "trade-bot:pause-bot",
                {},
                { path: { resource: "bot", _id: row.id } }
              );
              row.status = response.data?.[0]?.status;
            } catch (error: any) {
              console.error("Failed to pause bot:", error);
            }
            updatePageParams({
              bot_id: row.id,
              status: row.status,
            });
            break;
          }
          case "PAUSED": {
            row.status = "RUNNING";
            try {
              const response = await APIManager.send(
                "trade-bot:resume-bot",
                {},
                { path: { resource: "bot", _id: row.id } }
              );
              row.status = response.data?.[0]?.status;
            } catch (error: any) {
              console.error("Failed to resume bot:", error);
            }
            updatePageParams({
              bot_id: row.id,
              status: row.status,
            });
            break;
          }
          default:
            break;
        }
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
    <>
      <ThreeColumnLayout
        sidebarWidth="lg"
        slotClasses={{
          main: "no-padding",
          sidebar: "no-padding flex flex-col gap-4",
          rightPanel: "no-padding",
        }}
      >
        <Header slotName="header" />

        {/* <PageModule slotName="sidebar">
          <PortfolioCard />
        </PageModule> */}

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
              select: [
                "name",
                "started_date",
                "profit",
                "profit_value",
                "applied_blocks",
                "status",
              ],
            }}
            onActivate={(id: string, row: any) => {
              updatePageParams({
                bot_id: id as string,
                status: row.status as string,
              });
            }}
            rowActions={rowActions}
            customFormatters={{
              status: (value: string) => botStatusFormatter(value),
            }}
            key={refreshTrigger}
          />
        </PageModule>

        <PageModule slotName="rightPanel">
          <BotItemView />
        </PageModule>

        <PageModule slotName="footer">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              &copy; 2025 {appConfig?.get("app.name")}. All rights reserved.
            </p>
            <p>Version: {appConfig?.get("app.version")}</p>
          </div>
        </PageModule>
        <ModalViewSwitcher paramKey="modal" slotName="footer" />
      </ThreeColumnLayout>

      {showBotConfigModal && (
        <BotConfigModal
          open={showBotConfigModal}
          onClose={(results: any) => {
            if (results.success && results.data?.[0]?.bot_id) {
              console.log("Bot run result:", results);
              const newBotId = results.data?.[0]?.bot_id;
              updatePageParams({
                bot_id: newBotId,
                status: "RUNNING",
              });
              setRefreshTrigger((prev) => prev + 1);
            }
            setShowBotConfigModal(false);
            setBotToConfig(null);
          }}
          botDefId={botToConfig || ""}
          onRun={() => {}}
        />
      )}
    </>
  );
}
