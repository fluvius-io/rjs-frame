import { Code, Cpu, Hash, Settings, Tag } from "lucide-react";
import React from "react";
import { cn, ItemFooter, useItemView } from "rjs-admin";
import type { AlgorithmData } from "../types/algorithm";

interface AlgorithmCardProps {
  algorithm?: AlgorithmData;
  className?: string;
  onClick?: () => void;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  algorithm,
  className = "",
  onClick,
}) => {
  if (!algorithm) {
    const itemView = useItemView();
    algorithm = itemView.item as AlgorithmData;
  }

  const getRequiredParams = () => {
    return algorithm.params.required.map((param) => ({
      name: param,
      ...algorithm.params.properties[param],
    }));
  };

  const getOptionalParams = () => {
    return Object.entries(algorithm.params.properties)
      .filter(([key]) => !algorithm.params.required.includes(key))
      .map(([key, value]) => ({
        name: key,
        ...value,
      }));
  };
  className =
    className ||
    cn(
      "w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-4"
    );
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className={`${className}`} onClick={onClick}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {algorithm.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-500">
              Tier {algorithm.compute_tier}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">{algorithm.description}</p>

        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {algorithm.market}
          </span>
          {algorithm.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-3 pt-3">
          {/* Key and ID */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              <span className="font-mono">{algorithm.key}</span>
            </div>
            <div className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              <span className="font-mono truncate max-w-24">
                {algorithm.id?.slice(0, 8)}...
              </span>
            </div>
          </div>

          {/* Required Parameters */}
          {getRequiredParams().length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Settings className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-medium text-gray-700">
                  Required Parameters
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {getRequiredParams().map((param) => (
                  <div key={param.name} className="text-xs">
                    <span className="font-medium text-gray-700">
                      {param.title}:
                    </span>
                    <span className="text-gray-600 ml-1">
                      {param.examples?.[0] || param.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Parameters */}
          {getOptionalParams().length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Tag className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium text-gray-700">
                  Optional Parameters
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {getOptionalParams().map((param) => (
                  <div key={param.name} className="text-xs">
                    <span className="font-medium text-gray-700">
                      {param.title}:
                    </span>
                    <span className="text-gray-600 ml-1">
                      {param.examples?.[0] || param.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Configuration */}
          {algorithm.configuration.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-700">Config:</span>
              <span className="text-xs text-gray-600 font-mono">
                [{algorithm.configuration?.join(", ")}]
              </span>
            </div>
          )}

          {/* Metadata */}
          <ItemFooter item={algorithm} />
        </div>
      </div>
    </div>
  );
};
