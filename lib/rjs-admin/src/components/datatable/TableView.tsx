import { AlertCircle, Table } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { ColumnConfig, TableViewProps } from "../../types/datatable";
import { QueryFieldMetadata } from "../../types/querybuilder";
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
  allowSelection = true,
}) => {
  const idField = metadata.idfield;
  const selectionEnabled = !!(allowSelection && idField);

  const selectedItems: string[] = queryState.selectedItems || [];

  // Local state to show/hide header filters
  const [showHeaderFilters, setShowHeaderFilters] = React.useState(true);

  // Normalize fields array
  const fieldArray = React.useMemo<QueryFieldMetadata[]>(() => {
    return metadata.fields as QueryFieldMetadata[];
  }, [metadata.fields]);

  // Create map for quick access to field metadata by name
  const fieldMap = React.useMemo(
    () => Object.fromEntries(fieldArray.map((f) => [f.name, f])),
    [fieldArray]
  );

  const toggleRow = (id: string, checked: boolean) => {
    let newSelected: string[];
    if (checked) {
      newSelected = [...selectedItems, id];
    } else {
      newSelected = selectedItems.filter((v) => v !== id);
    }
    onQueryStateChange({ ...queryState, selectedItems: newSelected });
  };

  /**
   * Select all rows currently visible (current page) in addition to any that
   * may already be selected from other pages.
   */
  const selectAll = () => {
    const pageIds = data.map((row) => String(row[idField as string]));
    const newSelected = Array.from(
      new Set([...(queryState.selectedItems || []), ...pageIds])
    );

    onQueryStateChange({ ...queryState, selectedItems: newSelected });
  };

  /**
   * Clear selection for rows currently visible (current page) while preserving
   * selections that belong to other pages.
   */
  const clearAll = () => {
    const pageIds = data.map((row) => String(row[idField as string]));
    const prevSelected = queryState.selectedItems || [];
    const newSelected = prevSelected.filter((id) => !pageIds.includes(id));

    onQueryStateChange({ ...queryState, selectedItems: newSelected });
  };

  // Generate column configurations from metadata and queryState
  const getColumns = (): ColumnConfig[] => {
    const selectedFields =
      queryState.select ||
      fieldArray.filter((f) => !f.hidden).map((f) => f.name);

    return selectedFields
      .filter((fieldKey) => !!fieldMap[fieldKey])
      .map<ColumnConfig>((fieldKey) => {
        const field = fieldMap[fieldKey] as QueryFieldMetadata;
        return {
          key: fieldKey,
          label: field.label,
          sortable: field.sortable,
          hidden: false,
        };
      });
  };

  const columns = getColumns();

  // Determine header checkbox state for current page
  const pageIds = data.map((row) => String(row[idField as string]));
  let selectAllState: boolean | "indeterminate" = false;
  if (pageIds.length > 0) {
    const allSelected = pageIds.every((id) => selectedItems.includes(id));
    const anySelected = pageIds.some((id) => selectedItems.includes(id));
    selectAllState = allSelected ? true : anySelected ? "indeterminate" : false;
  }

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
  // if (columns.length === 0) {
  //   return (
  //     <div className={cn("dt-table-view", className)}>
  //       <div className="dt-empty">
  //         <div className="flex flex-col items-center">
  //           <AlertCircle className="dt-empty-icon text-orange-300" />
  //           <div className="dt-empty-text">No columns selected</div>
  //           <div className="dt-empty-subtext">
  //             Use the column toggle or query builder to select columns to
  //             display
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  const noHeaderPrompt = () => {
    return (
      <tbody className="dt-tbody">
        <tr>
          <td>
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
          </td>
        </tr>
      </tbody>
    );
  };

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
              allowSelection={selectionEnabled}
              selectAllState={selectAllState}
              onSelectAll={selectAll}
              onClearAll={clearAll}
              showHeaderFilters={showHeaderFilters}
              onShowHeaderFiltersChange={setShowHeaderFilters}
              idField={idField}
            />

            {/* Filter Row */}
            {showHeaderFilters && columns.length > 0 ? (
              <TableFilter
                metadata={metadata}
                queryState={queryState}
                onQueryStateChange={onQueryStateChange}
                allowSelection={selectionEnabled}
              />
            ) : null}
          </thead>

          {/* Table Body */}
          {columns.length > 0 ? (
            <tbody className="dt-tbody">
              {data.map((row, index) => (
                <RowComponent
                  key={index}
                  row={row}
                  columns={columns}
                  rowIndex={index}
                  selected={
                    selectionEnabled &&
                    selectedItems.includes(String(row[idField as string]))
                  }
                  idValue={idField ? String(row[idField]) : undefined}
                  onSelect={selectionEnabled ? toggleRow : undefined}
                />
              ))}
            </tbody>
          ) : (
            noHeaderPrompt()
          )}
        </table>
      </div>
    </div>
  );
};
