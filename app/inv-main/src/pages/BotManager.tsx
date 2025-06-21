import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
  ItemView,
  QueryBuilderPanel,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule, setPageParam, usePageLayout } from "rjs-frame";
import { Header } from "../components";

const BotItemView = () => {
  const pageContext = usePageLayout();
  if (
    !pageContext ||
    !pageContext.pageParams ||
    !pageContext.pageParams["org"]
  ) {
    return <div>No organization selected</div>;
  }

  const itemId = pageContext.pageParams["org"] as string;

  return (
    <ItemView
      itemId={itemId}
      resourceName="idm:organization"
      className="no-border h-full"
    />
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
            setPageParam("org", id as string);
          }}
          actions={
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          }
        />
      </PageModule>

      <PageModule className="p-4" slotName="rightPanel">
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
