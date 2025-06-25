import React, { useEffect, useState } from "react";
import { APIManager, ApiResponse } from "rjs-frame";

export interface StockData {
  id: string;
  symbol: string;
  proportion: number;
  volume: number;
  available: number;
  ap: number;
  mp: number;
  profit: number;
  profit_percent: number;
}

interface StockListViewProps {
  resourceName: string;
  profitSummary?: { value: number; percent: number };
}

const profitColor = (percent: number) => {
  if (percent >= 0) return "text-green-500";
  if (percent < 0) return "text-red-400";
  return "text-gray-500";
};

export const StockListView: React.FC<StockListViewProps> = ({ resourceName, profitSummary }) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<{ total: number }>({ total: 0 });
  useEffect(() => {
    setLoading(true);
    APIManager.query(resourceName, {
        search: {
            limit: 5,
            page: 1,
            offset: 0,
        }
    })
      .then((response: ApiResponse<StockData[]>) => {
        setStocks(response.data || []);
        setPagination(response.pagination || { total: 0 });
      })
      .finally(() => setLoading(false));
  }, [resourceName]);

  return (
    <div className="p-3 border bg-white/80 shadow-sm">
      <div className="flex items-center gap-2 px-2 pb-1 pt-1">
        <span className="font-semibold text-base text-gray-700 flex items-center gap-1">
          <span className="inline-block align-middle">🔲</span> Stocks ({pagination.total})
        </span>
        <span className="ml-auto text-gray-400">▼</span>
      </div>
      <hr className="my-1 border-gray-200" />
      {loading ? (
        <div className="text-center text-xs text-gray-400 py-4">Loading...</div>
      ) : (
        <table className="w-full text-xs text-gray-700 border-collapse">
          <thead>
            <tr className="text-gray-700">
              <th className="font-medium text-left px-1 py-1">
                <div className="text-left">Code</div>
                <div className="text-left">%</div>
              </th>
              <th className="font-medium px-1 py-1">
                <div className="text-left">Volume</div>
                <div className="text-left">Available</div>
              </th>
              <th className="font-medium px-1 py-1">
                <div className="text-left">AP</div>
                <div className="text-left">MP</div>
              </th>
              <th className="font-medium px-1 py-1">
                <div className="text-left">P/L</div>
                <div className="text-left">%</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, idx) => (
              <React.Fragment key={stock.id + idx}>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold text-xs">
                  <td className="px-1 py-1">
                    <div className="text-left">{stock.symbol}</div>
                    <div className="text-left">{stock.proportion}</div>
                  </td>
                  <td className="px-1 py-1">
                    <div className="text-left">{stock.volume}</div>
                    <div className="text-left">{stock.available}</div>
                  </td>
                  <td className="px-1 py-1">
                    <div className="text-left">{stock.ap}</div>
                    <div className="text-left">{stock.mp}</div>
                  </td>
                  <td className="px-1 py-1">
                    <div className={`text-left ${profitColor(stock.profit)}`}>{stock.profit}</div>
                    <div className={`text-left ${profitColor(stock.profit_percent)}`}>
                      {stock.profit_percent > 1 ? stock.profit_percent + "%" : stock.profit_percent}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex items-center justify-between px-1 pt-2 text-xs font-semibold">
        <span className="text-gray-500">Profit/Loss:</span>
        {profitSummary && (
          <span className="text-green-500">{profitSummary.value.toLocaleString()} ({profitSummary.percent}%)</span>
        )}
      </div>
      <div className="px-1 pt-1 text-[11px] text-gray-400 italic">*Value Unit: 1,000,000 vnd</div>
    </div>
  );
};