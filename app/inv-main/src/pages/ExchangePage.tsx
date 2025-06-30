import {
  DataTable,
  ItemView,
  QueryBuilderPanel,
  ThreeColumnLayout,
} from "rjs-admin";
import { PageModule, updatePageParams, usePageContext } from "rjs-frame";
import { Header, TransactionView } from "../components";
import { cn } from "rjs-admin";
import { formatMoney } from "@/components/Helper";

const transactionTypeFormatter = (status: string) => {
  const colorMap = {
    BUY: "status-buy",
    SELL: "status-sell",
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


const transactionStatusFormatter = (status: string) => {
  const colorMap = {
    PENDING: "status-pending",
    FILLED: "status-filled",
    PARTIAL: "status-partial",
    REJECTED: "status-rejected",
    CANCELED: "status-canceled",
    EXPIRED: "status-expired",
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

const ExchangeItemView = () => {
  const pageContext = usePageContext();

  if (!pageContext.pageParams.transaction_id) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-muted-foreground">
        No transaction selected
      </div>
    );
  }

  const itemId = pageContext.pageParams.transaction_id as string;
  return (
    <ItemView
      itemId={itemId}
      resourceName="trade-executor:transaction"
      className="no-border h-full"
      defaultTab="transaction"
      itemJsonView={false}
    >
      <ItemView.TabItem name="transaction" label="Transaction">
        <TransactionView />
      </ItemView.TabItem>
    </ItemView>
  );
};

export default function ExchangePage() {
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
            "order_id",
            "status",
            "symbol",
            "type",
            "quantity",
            "price",
            "currency",
            "created_at",
          ]}
          metaSource="trade-executor:transaction"
          className="no-border h-full"
        />
      </PageModule>

      <PageModule slotName="main" className="h-full">
        <DataTable
          resourceName="trade-executor:transaction"
          className="no-border h-full"
          showHeaderTitle={false}
          queryState={{
            select: ["order_id", "symbol", "type", "quantity", "price", "status", "currency"],
          }}
          title="Transaction"
          description="Transaction are the orders that are sent to the broker."
          onActivate={(id) => {
            updatePageParams({ transaction_id: id as string });
          }}
          customFormatters={{
            type: transactionTypeFormatter,
            status: transactionStatusFormatter,
            price: (value: number) => formatMoney(value),
          }}
        />
      </PageModule>

      <PageModule slotName="rightPanel">
        <ExchangeItemView />
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
