import { useEffect, useState } from "react";
import { Button, cn, useItemView } from "rjs-admin";
import { APIManager, updatePageParams } from "rjs-frame";
import "../Status.css";
import { formatMoney } from "../Helper";

interface BlockDefinitionDetailViewProps {
  onRefresh?: () => void;
}

export const BlockDefinitionDetailView = ({ onRefresh }: BlockDefinitionDetailViewProps) => {
  const { item } = useItemView();
  const [blockDefinition, setBlockDefinition] = useState<any>(null);
  const [blockComponents, setBlockComponents] = useState<any>(null);

  useEffect(() => {
    if (item?.id) { 
      APIManager.queryItem(`trade-manager:block-definition`, item.id, {
        cache: true,
      }).then((response) => {
        setBlockDefinition(response.data);
      });
    } else if (item) {
      setBlockDefinition(item); // fallback for direct data
    }
  }, [item]);

  useEffect(() => {
    if (item?.id) {
      APIManager.query(`trade-manager:block-component-view`, {
        search: {
          query: `{"bdef_id":"${item.id}"}`,
        },
      }).then((response) => {
        setBlockComponents(response.data);
      });
    }
  }, [item]);
  
  if (!blockDefinition) {
    return <div>No block definition found</div>;
  }

  // Helper for formatting ISO date
  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 mb-2">
        <span className="font-semibold text-lg">{blockDefinition.name}</span>
        <span className={cn("ml-2 px-2 py-0.5 rounded text-xs font-medium", `status-block-definition-${blockDefinition.status.toLowerCase()}`)}>
          {blockDefinition.status}
        </span>
        <div className="flex gap-2 ml-auto">
          {blockDefinition.status === "DRAFT" && (
            <>
              <Button
                type="button"
                onClick={async () => {
                  try {
                    await APIManager.send(
                      "trade-manager:publish-block-definition",
                      {},
                      { path: { resource: "block-definition", _id: item.id } }
                    );
                    // Refresh data
                    const response = await APIManager.queryItem("trade-manager:block-definition", item.id);
                    setBlockDefinition(response.data);
                    // Trigger parent refresh
                    onRefresh?.();
                  } catch (error) {
                    console.error("Failed to publish block definition:", error);
                  }
                }}
              >
                Publish
              </Button>
              <Button
                type="button"
                onClick={() => {
                  // Add edit logic here
                }}
              >
                Edit
              </Button>
            </>
          )}
          {blockDefinition.status === "PUBLISHED" && (
            <Button
              type="button"
              onClick={async () => {
                try {
                  await APIManager.send(
                    "trade-manager:unpublish-block-definition",
                    {},
                    { path: { resource: "block-definition", _id: item.id } }
                  );
                  // Refresh data
                  const response = await APIManager.queryItem("trade-manager:block-definition", item.id);
                  setBlockDefinition(response.data);
                  // Trigger parent refresh
                  onRefresh?.();
                } catch (error) {
                  console.error("Failed to unpublish block definition:", error);
                }
              }}
            >
              Unpublish
            </Button>
          )}
        </div>
      </div>

      {/* General Info */}
      <div>
        <h3 className="font-semibold text-base mb-2">General</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Symbol</div>
            <div>{blockDefinition.symbol}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Name</div>
            <div>{blockDefinition.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Revision</div>
            <div>{blockDefinition.revision}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Estimated Value</div>
            <div>{formatMoney(blockDefinition.est_value, 'VND')}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div>
              <span className={cn("px-2 py-0.5 rounded text-xs", `status-block-definition-${blockDefinition.status.toLowerCase()}`)}>
                {blockDefinition.status}
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Created</div>
            <div>{formatDate(blockDefinition.created)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Last Updated</div>
            <div>{formatDate(blockDefinition.updated)}</div>
          </div>
        </div>
      </div>

      {/* Block Components */}
      <div>
        <h3 className="font-semibold text-base mb-2">Block Components</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 text-left">No</th>
                <th className="px-2 py-1 text-left">Symbol</th>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Fraction</th>
              </tr>
            </thead>
            <tbody>
              {blockComponents && blockComponents.map(
                (
                  component: { symbol: string; name: string; fraction: number },
                  idx: number
                ) => (
                  <tr key={idx} className="border-t">
                    <td className="px-2 py-1">
                      {idx + 1}
                    </td>
                    <td className="px-2 py-1">
                      {component.symbol}
                    </td>
                    <td className="px-2 py-1">
                      {component.name}
                    </td>
                    <td className="px-2 py-1">
                      {component.fraction} %
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
