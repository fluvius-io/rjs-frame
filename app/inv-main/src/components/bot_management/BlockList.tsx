import { BlocksIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { APIManager, ApiResponse } from "rjs-frame";

export interface BlockData {
  id: string;
  symbol: string;
  name: string;
  status: string;
  av: number;
  mv: number;
  profit: number;
  profit_percent: number;
}

interface BlockListViewProps {
  resourceName: string;
  profitSummary?: { value: number; percent: number };
}

const statusColor = (status: string) => {
  switch (status) {
    case "ACQUIRING":
      return "text-red-400";
    case "ACTIVE":
      return "text-blue-400";
    case "LIQUIDATING":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
};

const profitColor = (percent: number) => {
  if (percent >= 0) return "text-green-500";
  if (percent < 0) return "text-red-400";
  return "text-gray-500";
};

export const BlockListView: React.FC<BlockListViewProps> = ({
  resourceName,
  profitSummary,
}) => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<{ total: number }>({ total: 0 });
  useEffect(() => {
    setLoading(true);
    APIManager.query(resourceName, {
      search: {
        limit: 5,
        page: 1,
        offset: 0,
      },
    })
      .then((response: ApiResponse<BlockData[]>) => {
        setBlocks(response.data || []);
        setPagination(response.pagination || { total: 0 });
      })
      .finally(() => setLoading(false));
  }, [resourceName]);

  return (
    <div className="rjs-panel">
      <div className="rjs-panel-header">
        <div className="rjs-panel-title">
          <BlocksIcon className="w-6 h-6" /> Blocks ({pagination.total})
        </div>
        <span className="ml-auto text-gray-400">▼</span>
      </div>
      <div className="rjs-panel-section">
        {loading ? (
          <div className="text-center text-xs text-gray-400 py-4">
            Loading...
          </div>
        ) : (
          <table className="w-full text-xs text-gray-700 border-collapse">
            <thead>
              <tr className="text-gray-700">
                <th className="font-medium text-left px-1 py-1">
                  <div className="text-left">Code</div>
                  <div className="text-left">Name</div>
                </th>
                <th className="font-medium px-1 py-1">
                  <div className="text-left">AV</div>
                  <div className="text-left">MV</div>
                </th>
                <th className="font-medium px-1 py-1">
                  <div className="text-left">P/L</div>
                  <div className="text-left">%</div>
                </th>
                <th className="font-medium px-1 py-1">
                  <div className="text-center">Status</div>
                  <div className="text-center">&nbsp;</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block, idx) => (
                <React.Fragment key={block.id + idx}>
                  <tr className="border-b border-gray-200 text-gray-400 font-semibold text-xs">
                    <td className="px-1 py-1">
                      <div className="text-left">{block.symbol}</div>
                      <div className="text-left">{block.name}</div>
                    </td>
                    <td className="px-1 py-1">
                      <div className="text-left">{block.av}</div>
                      <div className="text-left">{block.mv}</div>
                    </td>
                    <td className="px-1 py-1">
                      <div className={`text-left ${profitColor(block.profit)}`}>
                        {block.profit}
                      </div>
                      <div
                        className={`text-left ${profitColor(
                          block.profit_percent
                        )}`}
                      >
                        {block.profit_percent > 1
                          ? block.profit_percent + "%"
                          : block.profit_percent}
                      </div>
                    </td>
                    <td
                      className={`px-1 py-1 ${statusColor(
                        block.status
                      )} text-center`}
                    >
                      {block.status}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="rjs-panel-section text-xs">
        <span className="text-gray-500">Profit/Loss:</span>
        {profitSummary && (
          <span className="text-green-500">
            {profitSummary.value.toLocaleString()} ({profitSummary.percent}%)
          </span>
        )}
      </div>
      <div className="rjs-panel-section text-[11px] text-gray-400 italic">
        *Value Unit: 1,000,000 vnd
      </div>
    </div>
  );
};
