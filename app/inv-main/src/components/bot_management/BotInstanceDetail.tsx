import { useItemView } from "rjs-admin";
import { useEffect, useState } from "react";

export const BotInstanceDetailView = () => {
  const { item } = useItemView();
  const [botInstance, setBotInstance] = useState<any>(item);

  useEffect(() => {
    setBotInstance(item);
  }, [item]);

  if (!botInstance) {
    return <div>No bot instance found</div>;
  }

  // Helper for formatting numbers with commas and M suffix
  const formatM = (value: number | string) => {
    if (value === undefined || value === null) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return value;
    return num.toLocaleString() + "M";
  };

  // Helper for formatting percent
  const formatPercent = (value: number | string) => {
    if (value === undefined || value === null) return "-";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return value;
    return num.toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%";
  };

  // Extract parameters for the table
  const parameters = botInstance.parameters || [
    { name: "Initial Capital", value: botInstance.initial_capital },
    { name: "Block A", value: botInstance.block_a },
    { name: "Block 8", value: botInstance.block_8 },
    { name: "Buy Threshold", value: botInstance.buy_threshold },
    { name: "Sell Threshold", value: botInstance.sell_threshold },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 mb-2">
        <span className="font-semibold text-lg">{botInstance.bot_name || botInstance.name}</span>
        <button className="ml-2 px-3 py-1 rounded bg-muted text-xs border">Pause</button>
      </div>

      {/* General Info */}
      <div>
        <h3 className="font-semibold text-base mb-2">General</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Name</div>
            <div>{botInstance.bot_name || botInstance.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{botInstance.status || "Active"}</span></div>
          </div>
          <div>
            <div className="text-muted-foreground">Investment Type</div>
            <div>{botInstance.investment_type || "Stocks"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Started Date</div>
            <div>{botInstance.started_date || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Applied Algorithms</div>
            <div>{botInstance.applied_algorithms || botInstance.applied_blocks || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Profit / Loss</div>
            <div className="text-green-600 font-semibold">{formatM(botInstance.profit_value)} / {formatPercent(botInstance.profit)}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      {botInstance.description && (
        <div className="bg-muted p-3 rounded">
          <div className="text-sm text-muted-foreground mb-1 font-semibold">Description</div>
          <div className="text-sm">{botInstance.description}</div>
        </div>
      )}

      {/* Bot Parameters */}
      <div>
        <h3 className="font-semibold text-base mb-2">Bot Parameters</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 text-left">No.</th>
                <th className="px-2 py-1 text-left">Parameters</th>
                <th className="px-2 py-1 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param: any, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="px-2 py-1">{param.name}</td>
                  <td className="px-2 py-1">
                    <input
                      className="bg-muted px-2 py-1 rounded w-full"
                      value={param.value || "-"}
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 className="font-semibold text-base mb-2">Results</h3>
        <div className="grid grid-cols-3 gap-4 text-sm mb-2">
          <div>
            <div className="text-muted-foreground">Capital Value:</div>
            <div>{formatM(botInstance.capital_value) || "-"} vnd</div>
          </div>
          <div>
            <div className="text-muted-foreground">Market Value:</div>
            <div>{formatM(botInstance.market_value) || "-"} vnd</div>
          </div>
          <div>
            <div className="text-muted-foreground">Profit:</div>
            <div className="text-green-600 font-semibold">{formatM(botInstance.profit_result)} vnd | {formatPercent(botInstance.profit_result_percent)}</div>
          </div>
        </div>
        {/* Profit summary */}
        <div className="bg-muted p-2 rounded flex items-center gap-2">
          <span className="font-semibold text-green-600">Profit:</span>
          <span className="font-semibold">{formatM(botInstance.profit_summary_value)} | {formatPercent(botInstance.profit_summary_percent)}</span>
          <span className="ml-auto text-xs text-muted-foreground">Monthly</span>
        </div>
      </div>
    </div>
  );
};