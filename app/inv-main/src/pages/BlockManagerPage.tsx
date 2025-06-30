import {
    DataTable,
    ItemView,
    QueryBuilderPanel,
    ThreeColumnLayout,
  } from "rjs-admin";
  import { PageModule, updatePageParams, usePageContext } from "rjs-frame";
  import { Header, BlockDefinitionDetailView } from "../components";
  import { cn } from "rjs-admin";
  import { formatMoney } from "../components/Helper";
  
  const blockDefinitionStatusFormatter = (status: string) => {
    const colorMap = {
      PUBLISHED: "status-block-definition-published",
      DRAFT: "status-block-definition-draft",
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
  
  const baseValueFormatter = (value: number) => {
    return formatMoney(value, 'VND');
  };
  
  const BlockDefinitionItemView = () => {
    const pageContext = usePageContext();
  
    if (!pageContext.pageParams.block_id) {
      return (
        <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
          No block selected
        </div>
      );
    }
  
    const itemId = pageContext.pageParams.block_id as string;
    return (
      <ItemView
        itemId={itemId}
        resourceName="trade-manager:block-definition"
        className="no-border h-full"
        defaultTab="block-info"
        itemJsonView={false}
      >
        <ItemView.TabItem name="block-info" label="Block Info">
          <BlockDefinitionDetailView />
        </ItemView.TabItem>
      </ItemView>
    );
  };
  
  export default function BlockManagerPage() {
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
              "symbol", "name", "revision", "est_value", "status"
            ]}
            metaSource="trade-manager:block-definition"
            className="no-border h-full"
          />
        </PageModule>
  
        <PageModule slotName="main" className="h-full">
          <DataTable
            resourceName="trade-manager:block-definition"
            className="no-border h-full"
            showHeaderTitle={false}
            queryState={{
              select: ["symbol", "name", "revision", "est_value", "status"],
            }}
            title="Blocks"
            description="Blocks are the blocks that are used to create the model."
            onActivate={(id) => {
              updatePageParams({ block_id: id as string });
            }}
            customFormatters={{
              est_value: baseValueFormatter,
              status: blockDefinitionStatusFormatter,
            }}
          />
        </PageModule>
  
        <PageModule slotName="rightPanel">
          <BlockDefinitionItemView />
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
  