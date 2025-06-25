import { useItemView } from "rjs-admin";
import { APIManager } from "rjs-frame";
import { useEffect, useState } from "react";

export const BotDefinitionDetailView = () => {
  const { item } = useItemView();
  const [botDef, setBotDef] = useState<any>(null);

  useEffect(() => {
    if (item?.bot_def_id) {
      APIManager.queryItem(`trade-bot:bot-definition`, item.bot_def_id).then((response) => {
        setBotDef(response.data);
      });
    } else if (item) {
      setBotDef(item); // fallback for direct data
    }
  }, [item]);

  if (!botDef) {
    return <div>No bot definition found</div>;
  }

  // Helper for formatting ISO date
  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  // Extract parameters from params.properties
  const paramList = botDef.params?.required?.map((key: string) => {
    const prop = botDef.params.properties[key];
    return {
      name: prop.title || key,
      value: prop.examples?.[0] || "-",
      description: prop.description || "",
    };
  }) || [];

  // Extract algorithms
  const algorithms = botDef.algorithms || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 mb-2">
        <span className="font-semibold text-lg">{botDef.name}</span>
        <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">{'INACTIVE'}</span>
      </div>

      {/* General Info */}
      <div>
        <h3 className="font-semibold text-base mb-2">General</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Name</div>
            <div>{botDef.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Key</div>
            <div>{botDef.key}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{'INACTIVE'}</span></div>
          </div>
          <div>
            <div className="text-muted-foreground">Created</div>
            <div>{formatDate(botDef.created)}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      {botDef.description && (
        <div className="bg-muted p-3 rounded">
          <div className="text-sm text-muted-foreground mb-1 font-semibold">Description</div>
          <div className="text-sm">{botDef.description}</div>
        </div>
      )}

      {/* Parameters */}
      <div>
        <h3 className="font-semibold text-base mb-2">Parameters</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 text-left">No.</th>
                <th className="px-2 py-1 text-left">Parameter</th>
                <th className="px-2 py-1 text-left">Example</th>
                <th className="px-2 py-1 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {paramList.map((param: { name: string; value: string; description: string }, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="px-2 py-1">{param.name}</td>
                  <td className="px-2 py-1">{param.value}</td>
                  <td className="px-2 py-1 text-xs text-muted-foreground">{param.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithms */}
      {algorithms.length > 0 && (
        <div>
          <h3 className="font-semibold text-base mb-2">Algorithms</h3>
          <div className="space-y-2">
            {algorithms.map((algo: any, idx: number) => (
              <div key={algo._id || idx} className="border rounded p-3 bg-muted">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{algo.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{algo.key}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{algo.risk_level}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">{algo.description}</div>
                <div className="text-xs font-mono bg-slate-950 rounded p-2 overflow-x-auto border mt-1">
                  <pre className="whitespace-pre-wrap text-slate-50">
                    <code className="language-python">{algo.source_code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};