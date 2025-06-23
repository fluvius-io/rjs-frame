import React from "react";
import { AlgorithmCard } from "../components/AlgorithmCard";
import type { AlgorithmData } from "../types/algorithm";

// Sample algorithm data
const sampleAlgorithm: AlgorithmData = {
  key: "ema_crossover",
  name: "VN EMA Crossover",
  description: "VN Exponential Moving Average Crossover",
  market: "VN",
  tags: ["EMA", "TA"],
  params: {
    type: "object",
    title: "EMAParams",
    required: ["market", "exchange", "symbol", "resolution"],
    properties: {
      market: {
        type: "string",
        const: "VNI",
        title: "Market",
        examples: ["VNI"],
        description: "Market to compute EMA for",
      },
      symbol: {
        type: "string",
        title: "Symbol",
        examples: ["HPG"],
        description: "Symbol to compute EMA for",
      },
      exchange: {
        type: "string",
        title: "Exchange",
        examples: ["HSX"],
        description: "Exchange to compute EMA for",
      },
      resolution: {
        enum: ["1D", "1M"],
        type: "string",
        title: "Resolution",
        examples: ["1M"],
        description: "Resolution to compute EMA for",
      },
    },
  },
  configuration: [4],
  compute_tier: 0,
  id: "5b3771dc-53eb-52a3-9766-cf14b37eaf0f",
  _created: "2025-06-23T08:19:55.808874+00:00",
  _creator: "79c71c91-5e8a-491e-ba97-6810f5df943f",
  _updated: null,
  _updater: null,
  _realm: null,
  _deleted: null,
  _etag: null,
};

// Additional sample algorithms for demonstration
const additionalAlgorithms: AlgorithmData[] = [
  {
    ...sampleAlgorithm,
    key: "rsi_strategy",
    name: "RSI Momentum Strategy",
    description: "Relative Strength Index based momentum trading strategy",
    tags: ["RSI", "Momentum", "TA"],
    compute_tier: 1,
    id: "7a4882ed-64fc-63b4-0877-dg25c48fbf0g",
    _created: "2025-06-22T14:30:22.123456+00:00",
    _creator: "89d82d02-6f9b-5a2f-cb08-7921g6eg054g",
  },
  {
    ...sampleAlgorithm,
    key: "macd_signal",
    name: "MACD Signal Generator",
    description: "Moving Average Convergence Divergence signal generation",
    tags: ["MACD", "Signal", "TA"],
    compute_tier: 2,
    id: "8b5993fe-75gd-74c5-1988-eh36d59gcg1h",
    _created: "2025-06-21T09:15:33.654321+00:00",
    _creator: "99e93e13-7g0c-6b3g-dc19-8032h7fh165h",
  },
];

export const AlgorithmDemoPage: React.FC = () => {
  const handleAlgorithmClick = (algorithm: AlgorithmData) => {
    console.log("Algorithm clicked:", algorithm.name);
    // You can add navigation or modal opening logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Algorithm Cards Demo
          </h1>
          <p className="text-gray-600">
            Displaying algorithm data in a friendly, compact format
          </p>
        </div>

        {/* Single Algorithm Display */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Single Algorithm Card
          </h2>
          <div className="flex justify-center">
            <AlgorithmCard
              algorithm={sampleAlgorithm}
              onClick={() => handleAlgorithmClick(sampleAlgorithm)}
            />
          </div>
        </div>

        {/* Multiple Algorithms Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Multiple Algorithm Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AlgorithmCard
              algorithm={sampleAlgorithm}
              onClick={() => handleAlgorithmClick(sampleAlgorithm)}
            />
            {additionalAlgorithms.map((algorithm) => (
              <AlgorithmCard
                key={algorithm.id}
                algorithm={algorithm}
                onClick={() => handleAlgorithmClick(algorithm)}
              />
            ))}
          </div>
        </div>

        {/* Compact Layout */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Compact Layout
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[sampleAlgorithm, ...additionalAlgorithms].map((algorithm) => (
              <AlgorithmCard
                key={algorithm.id}
                algorithm={algorithm}
                className="max-w-none"
                onClick={() => handleAlgorithmClick(algorithm)}
              />
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Usage Instructions
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Props:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <code>algorithm</code>: AlgorithmData object (required)
              </li>
              <li>
                <code>className</code>: Additional CSS classes (optional)
              </li>
              <li>
                <code>onClick</code>: Click handler function (optional)
              </li>
            </ul>
            <p className="mt-4">
              <strong>Features:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Responsive design with hover effects</li>
              <li>Compact display of all algorithm metadata</li>
              <li>Color-coded badges for market and tags</li>
              <li>Formatted dates and truncated IDs</li>
              <li>Separate sections for required and optional parameters</li>
              <li>Compute tier indicator with icon</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
