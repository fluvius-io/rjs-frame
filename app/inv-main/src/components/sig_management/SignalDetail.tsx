import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useItemView } from "rjs-admin";
import { APIManager } from "rjs-frame";
import "../Status.css";

export const SignalDetailView = () => {
  const { item } = useItemView();
  const [signal, setSignal] = useState<any>(null);
  const [signalEntry, setSignalEntry] = useState<any>(null);

  useEffect(() => {
    if (item?.id) {
      APIManager.queryItem(`trade-signal:signal`, item.id, {
        cache: true,
      }).then((response) => {
        setSignal(response.data);
      });
    } else if (item) {
      setSignal(item); // fallback for direct data
    }
  }, [item]);

  useEffect(() => {
    if (item?.id) {
      APIManager.query(`trade-signal:signal-entry`, {
        search: {
          query: `{"signal_id":"${item.id}"}`,
          limit: 5,
          offset: 0,
          order: {
            created: "desc",
          },
        },
      }).then((response) => {
        console.log("signalEntry", response.data);
        setSignalEntry(response.data);
      });
    }
  }, [item]);

  if (!signal) {
    return <div>No signal found</div>;
  }

  // Helper for formatting ISO date
  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  // Extract parameters from params.properties
  const paramList =
    signal.params?.required?.map((key: string) => {
      const prop = signal.params.properties[key];
      return {
        name: prop.title || key,
        type: prop.type || "string",
        description: prop.description || "",
        required: prop.required || false,
      };
    }) || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b pb-2 mb-2">
        <span className="font-semibold text-lg">{signal.name}</span>
        <span className="status-active ml-2 px-2 py-0.5 rounded text-xs font-medium">
          {"ACTIVE"}
        </span>
      </div>

      {/* General Info */}
      <div>
        <h3 className="font-semibold text-base mb-2">General</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Name</div>
            <div>{signal.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Key</div>
            <div>{signal.key}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div>
              <span className="status-active px-2 py-0.5 rounded text-xs">
                {"ACTIVE"}
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Created</div>
            <div>{formatDate(signal.created)}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      {signal.description && (
        <div className="bg-muted p-3 rounded">
          <div className="text-sm text-muted-foreground mb-1 font-semibold">
            Description
          </div>
          <div className="text-sm">{signal.description}</div>
        </div>
      )}

      {/* Parameters */}
      <div>
        <h3 className="font-semibold text-base mb-2">Signal Input</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-left">Description</th>
                <th className="px-2 py-1 text-left">Required</th>
              </tr>
            </thead>
            <tbody>
              {paramList.map(
                (
                  param: { name: string; type: string; description: string; required: boolean },
                  idx: number
                ) => (
                  <tr key={idx} className="border-t">
                    <td className="px-2 py-1">
                      {param.name}
                    </td>
                    <td className="px-2 py-1">
                        {param.type}
                    </td>
                    <td className="px-2 py-1 text-xs text-muted-foreground">
                      {param.description}
                    </td>
                    <td className="px-2 py-1 text-xs text-muted-foreground">
                      {param.required ? "Yes" : "No"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-base mb-2">Signal Entry</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 text-left">Key</th>
                <th className="px-2 py-1 text-left">Mode</th>
                <th className="px-2 py-1 text-left">Confidence</th>
                <th className="px-2 py-1 text-left">Magnitube</th>
                <th className="px-2 py-1 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {signalEntry?.map((entry: any, idx: number) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1">{entry.key}</td>
                  <td className="px-2 py-1">{entry.mode}</td>
                  <td className="px-2 py-1">{entry.confidence}</td>
                  <td className="px-2 py-1">{entry.magnitube}</td>
                  <td className="px-2 py-1">{formatDate(entry.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
