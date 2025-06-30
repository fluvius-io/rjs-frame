import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn, ItemFooter, useItemView } from "rjs-admin";
import { APIManager } from "rjs-frame";
import "../Status.css";

export const BotInstanceDetailView = () => {
  const { item } = useItemView();
  const [botInstance, setBotInstance] = useState<any>(null);

  useEffect(() => {
    if (item?.id) {
      APIManager.queryItem("trade-bot:bot-instance", item.id).then(
        (response) => {
          setBotInstance(response.data);
        }
      );
    } else if (item) {
      setBotInstance(item); // fallback for direct data
    }
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

  // Extract parameters from params object
  const paramObj = botInstance.params || {};
  const paramList = Object.keys(paramObj).map((key) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: paramObj[key],
  }));

  // Extract algorithms
  const algorithms = botInstance.algorithms || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 mb-2">
        <span className="font-semibold text-lg">{botInstance.name}</span>
        <span
          className={`status-${
            botInstance.status.toLowerCase() || "inactive"
          } ml-2 px-2 py-0.5 rounded text-xs font-medium`}
        >
          {botInstance.status || "ACTIVE"}
        </span>
      </div>

      {/* General Info */}
      <div>
        <h3 className="font-semibold text-base mb-2">General</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Name</div>
            <div>{botInstance.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div>
              <span className={cn("px-2 py-0.5 rounded text-xs", `status-${botInstance.status.toLowerCase() || "inactive"}`)}>
                {botInstance.status || "ACTIVE"}
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Investment Type</div>
            <div>{botInstance.investment_type || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Started Date</div>
            <div>{botInstance.started_date || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Applied Blocks</div>
            <div>{botInstance.applied_blocks || "-"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Profit / Loss</div>
            <div className="text-green-600 font-semibold">
              {formatM(botInstance.result_profit_value)} /{" "}
              {formatPercent(botInstance.result_profit)}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {botInstance.description && (
        <div className="bg-muted p-3 rounded">
          <div className="text-sm text-muted-foreground mb-1 font-semibold">
            Description
          </div>
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
                <th className="px-2 py-1 text-left">Parameter</th>
                <th className="px-2 py-1 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {paramList.map(
                (param: { name: string; value: any }, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="px-2 py-1">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-2 py-1">{param.name}</td>
                    <td className="px-2 py-1">
                      <input
                        className="bg-muted px-2 py-1 rounded w-full"
                        value={param.value ?? "-"}
                        readOnly
                      />
                    </td>
                  </tr>
                )
              )}
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
            <div>
              {formatM(botInstance.result_capital_value) || "-"}{" "}
              {botInstance.currency?.toLowerCase() || ""}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Market Value:</div>
            <div>
              {formatM(botInstance.result_market_value) || "-"}{" "}
              {botInstance.currency?.toLowerCase() || ""}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Profit:</div>
            <div className="text-green-600 font-semibold">
              {formatM(botInstance.result_profit_value)}{" "}
              {botInstance.currency?.toLowerCase() || ""} |{" "}
              {formatPercent(botInstance.result_profit)}
            </div>
          </div>
        </div>
      </div>

      {/* Algorithms */}
      {algorithms.length > 0 && (
        <div>
          <h3 className="font-semibold text-base mb-2">Algorithms</h3>
          <div className="space-y-2">
            {algorithms.map((algo: any, idx: number) => (
              <div
                key={algo._id || idx}
                className="border rounded p-3 bg-muted"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{algo.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {algo.key}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    {algo.risk_level}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {algo.description}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  <SyntaxHighlighter language="python" style={tomorrow}>
                    {algo.source_code}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ItemFooter item={botInstance} />
    </div>
  );
};
