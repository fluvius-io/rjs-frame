import { TextSearch } from "lucide-react";

export const PortfolioCard = () => {
  return (
    <div className="rjs-panel">
      <div className="rjs-panel-header">
        <div className="flex gap-2 w-full items-center">
          <TextSearch className="w-5 h-5 cursor-pointer" />
          <h2 className="rjs-panel-title">Portfolios</h2>
        </div>
      </div>
      <div className="rjs-panel-section">
        <div
          className="rounded-xl shadow-md border border-gray-200 p-2 relative"
          style={{
            background: "linear-gradient(135deg, #e6e6fa 0%, #f8f8ff 100%)",
            boxShadow: "0 4px 12px 0 #b9aaff33",
            border: "1.5px solid #d1c6f7",
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Cash Balance:</span>
              <span className="text-black text-sm font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Capital Value:</span>
              <span className="text-black text-sm font-medium">10,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Market Value:</span>
              <span className="text-black text-sm font-medium">11,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Profit/Loss:</span>
              <span className="text-green-500 text-sm font-semibold">
                1,000 (10%)
              </span>
            </div>
            <div className="pt-2">
              <span className="italic text-gray-400 text-sm">
                *Unit: million vnd (M)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
