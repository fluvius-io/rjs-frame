import * as Select from "@radix-ui/react-select";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { PaginationProps } from "../../types/datatable";
import { Button } from "../common/Button";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onChange,
  loading = false,
  selectedCount = 0,
  onClearSelection,
  className,
}) => {
  const { page, pageSize, total } = pagination;
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onChange({ ...pagination, page: newPage });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (newPageSize !== pageSize) {
      // Reset to first page when changing page size
      onChange({ ...pagination, pageSize: newPageSize, page: 1 });
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots.filter(
      (item, index, arr) =>
        (arr.indexOf(item) === index && item !== 1) || index === 0
    );
  };

  const visiblePages = getVisiblePages();

  if (total === 0) {
    return (
      <div className={cn("dt-pagination", className)}>
        <div className="dt-pagination-info">No records found</div>
        <div className="dt-pagination-controls">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <Select.Root
              value={String(pageSize)}
              onValueChange={(val) => handlePageSizeChange(Number(val))}
              disabled={loading}
            >
              <Select.Trigger asChild>
                <Button variant="outline" size="sm" className="h-8 min-w-16">
                  <Select.Value />
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </Select.Trigger>
              <Select.Content className="qb-dropdown-content">
                <Select.Viewport className="p-1">
                  {PAGE_SIZE_OPTIONS.map((opt) => (
                    <Select.Item
                      key={opt}
                      value={String(opt)}
                      className="qb-dropdown-item"
                    >
                      <Select.ItemText>{opt}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Root>
            <span className="text-sm text-gray-500">per page</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("dt-pagination", className)}>
      <div className="dt-pagination-info flex items-center gap-2 flex-wrap">
        <span>
          Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of{" "}
          {total.toLocaleString()} entries
        </span>
        {selectedCount > 0 && (
          <>
            <span className="mx-3 text-gray-500 font-semibold">|</span>
            <span className="flex items-center gap-1">
              {selectedCount.toLocaleString()} entries selected
              {onClearSelection && (
                <button
                  type="button"
                  onClick={onClearSelection}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Clear selection"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          </>
        )}
      </div>
      {/* Loading Indicator */}
      {loading && (
        <div className="dt-pagination-loading">
          <Loader2 className="dt-pagination-loading-spinner" />
          Loading...
        </div>
      )}

      <div className="dt-pagination-controls">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>

          {/* Radix Select for page size */}
          <Select.Root
            value={String(pageSize)}
            onValueChange={(val) => handlePageSizeChange(Number(val))}
            disabled={loading}
          >
            <Select.Trigger asChild>
              <Button variant="outline" size="sm" className="h-8 min-w-16">
                <Select.Value />
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </Select.Trigger>
            <Select.Content className="qb-dropdown-content">
              <Select.Viewport className="p-1">
                {PAGE_SIZE_OPTIONS.map((opt) => (
                  <Select.Item
                    key={opt}
                    value={String(opt)}
                    className="qb-dropdown-item"
                  >
                    <Select.ItemText>{opt}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>

          <span className="text-sm text-gray-500">per page</span>
        </div>

        {/* Page Navigation */}
        <div className="dt-pagination-buttons">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            className="dt-pagination-button h-8 w-8 p-0"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {visiblePages.map((pageNum, index) => {
            if (pageNum === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }

            const pageNumber = pageNum as number;
            const isActive = pageNumber === page;
            return (
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="dt-pagination-button h-8 w-8 p-0"
                onClick={() => handlePageChange(pageNumber)}
                disabled={loading}
                title={`Go to page ${pageNumber}`}
              >
                {pageNumber}
              </Button>
            );
          })}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            className="dt-pagination-button h-8 w-8 p-0"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || loading}
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
