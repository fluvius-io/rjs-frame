import { Filter, Loader2, Search } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { TableControlProps } from "../../types/datatable";
import { QueryBuilderModal } from "../querybuilder/QueryBuilderModal";

export const TableControl: React.FC<TableControlProps> = ({
  metadata,
  queryState,
  onQueryStateChange,
  loading,
  debug = false,
  className,
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(queryState.search || "");

  // Debounce search input
  const searchTimeoutRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  React.useEffect(() => {
    setSearchValue(queryState.search || "");
  }, [queryState.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      onQueryStateChange({
        ...queryState,
        search: value,
      });
    }, 300);
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Count active filters
  const activeFiltersCount = queryState.query?.length || 0;
  const activeSortCount = queryState.sort?.length || 0;
  const hasActiveSearch = Boolean(queryState.search?.trim());

  return (
    <div className={cn("dt-control", className)}>
      <div className="dt-control-header">
        <div>
          <h2 className="dt-control-title">{metadata.title}</h2>
          {metadata.desc && (
            <p className="text-sm text-gray-500 mt-1">{metadata.desc}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                {activeFiltersCount} Filter
                {activeFiltersCount !== 1 ? "s" : ""}
              </span>
            )}
            {activeSortCount > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {activeSortCount} Sort{activeSortCount !== 1 ? "s" : ""}
              </span>
            )}
            {hasActiveSearch && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Search: "{queryState.search}"
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={`Search ${metadata.name}...`}
            className="dt-search-box pl-10"
          />
          {hasActiveSearch && (
            <button
              onClick={() => {
                setSearchValue("");
                onQueryStateChange({
                  ...queryState,
                  search: "",
                });
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
              title="Clear search"
            >
              <Search className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>

        <div className="dt-control-actions">
          <button
            onClick={() => setModalOpen(true)}
            className="dt-query-builder-trigger"
            title="Open Query Builder"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          {loading && (
            <div className="flex items-center text-sm text-gray-500 px-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </div>
          )}
        </div>
      </div>

      {/* Query Builder Modal */}
      <QueryBuilderModal
        metadata={metadata}
        queryState={queryState}
        onQueryStateChange={onQueryStateChange}
        open={modalOpen}
        onOpenChange={setModalOpen}
        showDebug={debug}
      />
    </div>
  );
};
