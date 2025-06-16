import { AlertCircle, Table } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ColumnConfig, TableViewProps } from "../../types/datatable";
import { TableFilter } from "./TableFilter";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";

export const TableView: React.FC<TableViewProps> = ({
  data,
  metadata,
  queryState,
  onQueryStateChange,
  customTableHeader: CustomTableHeader,
  customTableRow: CustomTableRow,
  className,
}) => {
  // Generate column configurations from metadata and queryState
  const getColumns = (): ColumnConfig[] => {
    const selectedFields =
      queryState.select ||
      Object.keys(metadata.fields).filter(
        (key) => !metadata.fields[key].hidden
      );

    return selectedFields.map((fieldKey: string) => {
      const field = metadata.fields[fieldKey];
      return {
        key: fieldKey,
        label: field.label,
        sortable: field.sortable,
        hidden: false,
      };
    });
  };

  const columns = getColumns();

  // Render empty state
  if (data.length === 0) {
    return (
      <div className={cn("dt-table-view", className)}>
        <div className="dt-empty">
          <div className="flex flex-col items-center">
            <Table className="dt-empty-icon" />
            <div className="dt-empty-text">No data found</div>
            <div className="dt-empty-subtext">
              Try adjusting your search or filter criteria
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have any columns to display
  if (columns.length === 0) {
    return (
      <div className={cn("dt-table-view", className)}>
        <div className="dt-empty">
          <div className="flex flex-col items-center">
            <AlertCircle className="dt-empty-icon text-orange-300" />
            <div className="dt-empty-text">No columns selected</div>
            <div className="dt-empty-subtext">
              Use the column toggle or query builder to select columns to
              display
            </div>
          </div>
        </div>
      </div>
    );
  }

  const HeaderComponent = CustomTableHeader || TableHeader;
  const RowComponent = CustomTableRow || TableRow;

  return (
    <div className={cn("dt-table-view", className)}>
      <div className="overflow-x-auto">
        <table className="dt-table">
          {/* Table Header with Filter */}
          <thead className="dt-thead">
            {/* Header Row */}
            <HeaderComponent
              metadata={metadata}
              queryState={queryState}
              onQueryStateChange={onQueryStateChange}
            />

            {/* Filter Row */}
            <TableFilter
              metadata={metadata}
              queryState={queryState}
              onQueryStateChange={onQueryStateChange}
            />
          </thead>

          {/* Table Body */}
          <tbody className="dt-tbody">
            {data.map((row, index) => (
              <RowComponent
                key={row.id || index}
                row={row}
                columns={columns}
                rowIndex={index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
