import {
  DataTable,
  ItemView,
  QueryBuilderPanel,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule, updatePageParams, usePageContext } from "rjs-frame";
import { Header, DataSourceDetailView } from "../components";
import { cn } from "rjs-admin";


const datasourceStatusFormatter = (status: string) => {
  const colorMap = {
    UP_TO_DATE: "status-data-source-up_to_date",
    OUT_OF_DATE: "status-data-source-out_of_date",
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

const DataItemView = () => {
  const pageContext = usePageContext();

  if (!pageContext.pageParams.data_id) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
        No data selected
      </div>
    );
  }

  const itemId = pageContext.pageParams.data_id as string;
  return (
    <ItemView
      itemId={itemId}
      resourceName="trade-data:datasource"
      className="no-border h-full"
      defaultTab="data"
      itemJsonView={false}
    >
      <ItemView.TabItem name="data" label="Data">
        <DataSourceDetailView />
      </ItemView.TabItem>
    </ItemView>
  );
};

export default function DataPage() {
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
            "key", "name", "market", "asset", "status"
          ]}
          metaSource="trade-data:datasource"
          className="no-border h-full"
        />
      </PageModule>

      <PageModule slotName="main" className="h-full">
        <DataTable
          resourceName="trade-data:datasource"
          className="no-border h-full"
          showHeaderTitle={false}
          queryState={{
            select: ["key", "name", "market", "asset", "status"],
          }}
          title="Data"
          description="Data are the data that are used to train the model."
          onActivate={(id) => {
            updatePageParams({ data_id: id as string });
          }}
          customFormatters={{
            status: datasourceStatusFormatter,
          }}
        />
      </PageModule>

      <PageModule slotName="rightPanel">
        <DataItemView />
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
