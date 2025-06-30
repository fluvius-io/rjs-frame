import { useEffect, useState } from "react";
import { cn, useItemView } from "rjs-admin";
import { APIManager } from "rjs-frame";
import "../Status.css";

export const DataSourceDetailView = () => {
  const { item } = useItemView();
  const [dataSource, setDataSource] = useState<any>(null);
  const [dataSourceEntry, setDataSourceEntry] = useState<any>(null);

  useEffect(() => {
    if (item?.id) { 
      APIManager.queryItem(`trade-data:datasource`, item.id, {
        cache: true,
      }).then((response) => {
        setDataSource(response.data);
      });
    } else if (item) {
      setDataSource(item); // fallback for direct data
    }
  }, [item]);

  if (!dataSource) {
    return <div>No data source found</div>;
  }

  // Helper for formatting ISO date
  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  // Extract parameters from params.properties
  const paramList =
    dataSource.params?.required?.map((key: string) => {
      const prop = dataSource.params.properties[key];
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
        <span className="font-semibold text-lg">{dataSource.name}</span>
        <span className={cn("ml-2 px-2 py-0.5 rounded text-xs font-medium", `status-data-source-${dataSource.status.toLowerCase()}`)}>
          {dataSource.status}
        </span>
      </div>

      {/* General Info */}
      <div>
        <h3 className="font-semibold text-base mb-2">General</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Name</div>
            <div>{dataSource.name}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div>
              <span className={cn("px-2 py-0.5 rounded text-xs", `status-data-source-${dataSource.status.toLowerCase()}`)}>
                {dataSource.status}
              </span>
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Asset type</div>
            <div>{dataSource.asset}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Started date</div>
            <div>{formatDate(dataSource.created)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Data records</div>
            <div>{">10,000"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Market</div>
            <div>{dataSource.market}</div>
          </div>
        </div>
      </div>

      {/* Description */}
      {dataSource.description && (
        <div className="bg-muted p-3 rounded">
          <div className="text-sm text-muted-foreground mb-1 font-semibold">
            Description
          </div>
          <div className="text-sm">{dataSource.description}</div>
        </div>
      )}

      {/* Parameters */}
      <div>
        <h3 className="font-semibold text-base mb-2">Data Source Input</h3>
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
    </div>
  );
};
